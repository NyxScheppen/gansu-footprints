const {chromium} = require('playwright');
const {pathToFileURL} = require('node:url');
const path = require('node:path');
const fs = require('node:fs');

(async () => {
  const systemChrome = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
  const executablePath = process.env.CHROME_PATH || (fs.existsSync(systemChrome) ? systemChrome : undefined);
  const browser = await chromium.launch({headless:true,executablePath});
  const context = await browser.newContext({viewport:{width:1237,height:612},deviceScaleFactor:1,reducedMotion:'reduce'});
  const page = await context.newPage();
  const errors = [], requests = [];
  const check = (condition,message) => {if(!condition) throw new Error(message)};
  const react = process.argv.includes('--react');
  const base = process.env.SITE_BASE_URL || (react ? 'http://127.0.0.1:4174/' : null);
  const url = name => base ? new URL(name+'.html',base).href : pathToFileURL(path.resolve(name+'.html')).href;
  const navigate = async name => { await page.goto(url(name)); await page.locator('main h1').waitFor(); };
  const files = ['index','explore','fuxi','bronze','apple','maiji','river','quiz'];
  const chapters = ['fuxi','bronze','apple','maiji','river'];
  page.on('pageerror',error=>errors.push(error.message));
  page.on('request',request=>{if(/^https?:/.test(request.url()) && (!base || new URL(request.url()).origin!==new URL(base).origin))requests.push(request.url())});

  for(const name of files){
    await navigate(name);
    check(await page.locator('main h1').count()===1,name+': one title');
    const text=await page.locator('body').innerText();
    check(!/手记|学习进度|PPT|阅读序章|一条足迹|新的起点/.test(text),name+': earlier removals preserved');
    check(!await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),name+': no desktop overflow');
    const links=await page.locator('a[href]').evaluateAll(els=>els.map(el=>el.getAttribute('href')));
    for(const href of links){
      if(href.startsWith('#'))check(await page.locator(href).count()>0,name+': anchor exists '+href);
      else if(!/^https?:/.test(href))check(fs.existsSync(path.join(react?'docs':'.',href)),name+': file exists '+href);
    }
  }
  await navigate('index');
  check(await page.locator('main > section').count()===1,'Home only contains hero');
  check(await page.locator('.hero-slide').count()===5,'Five scenic photographs in homepage carousel');
  check(await page.locator('.hero-slide img').evaluateAll(els=>els.every(img=>img.complete&&img.naturalWidth>0)),'All carousel photos load offline');
  check(await page.locator('.carousel-toggle').getAttribute('aria-label')==='开始自动轮播','Reduced motion disables automatic rotation');
  for(let i=0;i<5;i++){
    await page.locator('.carousel-dot').nth(i).click();
    const slide=await page.locator('.hero-slide').nth(i).boundingBox();
    const frame=await page.locator('.hero-art').boundingBox();
    check(Math.abs(slide.x-frame.x)<2,'Selected slide fills the frame: '+i);
    check(await page.locator('.hero-slide:not([inert])').count()===1,'Only active slide can receive focus');
  }
  await page.locator('[data-step="1"]').click();
  check(await page.locator('.carousel-dot').first().getAttribute('aria-current')==='true','Carousel wraps to first slide');
  await page.locator('.hero-art').focus();
  await page.keyboard.press('ArrowLeft');
  check(await page.locator('.carousel-dot').last().getAttribute('aria-current')==='true','Keyboard can move backwards and wrap');
  await page.locator('.hero-slide:not([inert]) [data-sources]').click();
  check(await page.locator('#sources-dialog').isVisible(),'Active photo source opens');
  await page.keyboard.press('Escape');
  await page.locator('.carousel-dot').first().click();
  await page.screenshot({path:'preview.png',fullPage:true});
  await page.locator('.hero-copy .primary').click();
  check(page.url()===url('explore'),'Hero links to explore');
  check(await page.locator('.destination').count()===5,'Five destinations');
  await page.screenshot({path:'source/preview-explore-desktop.png'});
  await page.locator('.map-marker[href="fuxi.html"] circle').click();
  check(page.url()===url('fuxi'),'Map links to Fuxi');

  for(const name of chapters){
    await navigate(name);
    check(await page.locator('.chapter-nav,.scene-window').count()===0,'Old navigation and small window removed: '+name);
    check(await page.locator('.reader-topic').count()===5,'Five expanded sections: '+name);
    check(await page.locator('.reader-focus,.route-facts,.reader-location small').count()===0,'Requested blocks removed: '+name);
    check(!(await page.locator('body').innerText()).includes('主题位置示意，非导航地图'),'Map hint removed: '+name);
    check(await page.locator('.reader-paragraph').count()===10,'Two paragraphs per section: '+name);
    const articleText=await page.locator('.reader-topic').allTextContents();
    check(articleText.join('').length>1000,'Expanded article content: '+name);
    check(await page.locator('.reader-intro,.reader-topic h2,.reader-paragraph').evaluateAll(els=>els.every(el=>getComputedStyle(el).textAlign==='center')),'Headings and paragraphs centered: '+name);

    check(await page.locator('.reader-topic p:last-child:visible').count()===5,'No folded article text: '+name);
    const sidebar=await page.locator('.reader-sidebar').boundingBox();
    const article=await page.locator('.reader-article').boundingBox();
    check(sidebar.x+sidebar.width<article.x,'Map and directory are left of article: '+name);
    check(article.width>700,'Expanded article width: '+name);
    check(await page.locator('.reader-article').evaluate(el=>getComputedStyle(el).overflowY)==='visible','Article scrolls with document: '+name);
    check(await page.locator('.reader-sidebar').evaluate(el=>getComputedStyle(el).position)==='sticky','Sidebar sticks: '+name);
    check(await page.locator('.reader-background img').evaluate(img=>img.complete&&img.naturalWidth>0),'Topic background photo loads: '+name);
    if(name==='fuxi'){
      check(await page.locator('.reader-background img').evaluate(img=>img.complete&&img.naturalWidth>0),'Local Fuxi photo loads');
      await page.screenshot({path:'source/preview-fuxi-desktop.png'});
    }
    await page.locator('.reader-directory a[href="#topic-3"]').click();
    await page.waitForFunction(()=>document.querySelector('.reader-directory a[aria-current="location"]').hash==='#topic-3');
    check(await page.evaluate(()=>scrollY)>300,'Document scroll advances: '+name);
    const after=await page.locator('.reader-sidebar').boundingBox();
    check(Math.abs(after.y-sidebar.y)<8,'Sidebar remains in position: '+name);
    if(name==='fuxi')await page.screenshot({path:'source/preview-fuxi-reading.png'});
    await page.evaluate(()=>scrollTo(0,document.documentElement.scrollHeight));
    const next=await page.locator('.reader-pagination').boundingBox();
    const footer=await page.locator('.site-bottom').boundingBox();
    check(next.y+next.height<=footer.y+1,'Footer clears pagination: '+name);
    await page.reload();
    await page.locator('main h1').waitFor();
    check(await page.locator('.reader-topic').count()===5,'Direct refresh works: '+name);
  }
  await navigate('quiz');
  check(await page.locator('.quiz-decoration').count()===0,'Large 05 decoration removed');
  check(await page.locator('.reader-background img').evaluate(img=>img.complete&&img.naturalWidth>0),'Quiz has a local Gansu background');
  const quizRect=await page.locator('.quiz-box').boundingBox();
  check(quizRect.width>700&&quizRect.height>=460,'Answer card expanded on desktop');
  await page.screenshot({path:'source/preview-quiz-desktop.png',fullPage:true});
  check(await page.locator('#quiz-next').isDisabled(),'No skipping unanswered question');
  for(const answer of [0,1,2,3,1]){
    await page.locator('[data-answer="'+answer+'"]').click();
    await page.locator('#quiz-next').click();
  }
  check((await page.locator('.result-number').innerText()).replace(/\s/g,'')==='5/5','Quiz scores answers');
  await page.locator('#restart-quiz').click();
  for(const answer of [1,0,0,0,0]){
    await page.locator('[data-answer="'+answer+'"]').click();
    check(await page.locator('.quiz-option.wrong').count()===1,'Incorrect answer feedback');
    await page.locator('#quiz-next').click();
  }
  check(await page.locator('.quiz-review a').count()===5,'Review links retained');
  await page.locator('.quiz-review a').first().click();
  check(page.url()===url('fuxi'),'Review opens reader page');
  await page.locator('.site-bottom [data-sources]').click();
  check(await page.locator('#sources-dialog').isVisible(),'Source attribution opens');
  await page.keyboard.press('Escape');
  check(!await page.locator('#sources-dialog').isVisible(),'Source attribution closes');

  for(const width of [390,320,768]){
    await page.setViewportSize({width,height:844});
    for(const name of files){
      await navigate(name);
      check(!await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),name+': no overflow at '+width);
      if(width===390&&['index','explore','fuxi','maiji','quiz'].includes(name))await page.screenshot({path:'source/preview-'+name+'-mobile.png',fullPage:true});
      if(chapters.includes(name)){
        await page.evaluate(()=>scrollTo(0,document.documentElement.scrollHeight));
        const pagination=await page.locator('.reader-pagination').boundingBox();
        const footer=await page.locator('.site-bottom').boundingBox();
        check(pagination.y+pagination.height<=footer.y+1,name+': final content clears footer at '+width);
      }
    }
  }
  await page.setViewportSize({width:390,height:844});
  await navigate('index');
  await page.locator('#menu-button').click();
  check(await page.locator('#nav-links').isVisible(),'Mobile menu opens');
  await page.locator('#nav-links a[href="explore.html"]').click();
  check(page.url()===url('explore'),'Mobile menu navigates');
  check(!await page.locator('#nav-links').isVisible(),'Menu resets on navigation');
  const automatic = await browser.newContext({viewport:{width:1237,height:756},reducedMotion:'no-preference'});
  const autoPage=await automatic.newPage();
  autoPage.on('pageerror',error=>errors.push(error.message));
  await autoPage.goto(url('index'));
  await autoPage.locator('.carousel-dot').first().waitFor();
  await autoPage.waitForFunction(()=>document.querySelector('.carousel-dot[aria-current=true]').dataset.slide==='1',{},{timeout:7000});
  await autoPage.locator('.carousel-toggle').click();
  await autoPage.locator('.hero-copy').click();
  await autoPage.mouse.move(10,100);
  const pausedSlide=await autoPage.locator('.carousel-dot[aria-current=true]').getAttribute('data-slide');
  await autoPage.waitForTimeout(4800);
  check(await autoPage.locator('.carousel-dot[aria-current=true]').getAttribute('data-slide')===pausedSlide,'Pause holds the current photograph');
  await autoPage.locator('.carousel-toggle').click();
  await autoPage.locator('.hero-copy').click();
  await autoPage.mouse.move(10,100);
  await autoPage.waitForFunction(previous=>document.querySelector('.carousel-dot[aria-current=true]').dataset.slide!==previous,pausedSlide,{timeout:7000});
  await automatic.close();
  check(errors.length===0,'No browser script errors: '+errors.join('; '));
  check(requests.length===0,'Site loads no third party resources');
  const checks=['five full length articles','left sticky map and directory','wide document-scrolling article','active table of contents','local scenic backgrounds on five topics and quiz','no old floating window','no horizontal overflow','fixed footer spacing','expanded quiz card and review links','direct refresh','offline','mobile navigation','five image carousel with auto rotation pause resume dots and keyboard','reduced motion disables autoplay'];
  fs.writeFileSync(react?'source/verification-react.json':'source/verification.json',JSON.stringify({passed:true,pages:files,viewports:[1237,390,320,768],errors,externalRequests:requests,checks},null,2));
  console.log('PASS: reading layout, sticky map, directory tracking, whole-page scrolling, mobile, links, quiz, offline, and all eight pages.');
  await browser.close();
})().catch(error=>{console.error(error);process.exit(1)});
