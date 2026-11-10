"""Generate an offline, static HTML page for each part of the experience."""
import base64
import html
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SOURCE = ROOT / 'source'
chapters = json.loads((SOURCE / 'chapters.json').read_text(encoding='utf-8'))
esc = html.escape

icons = json.loads((SOURCE / 'icons.json').read_text(encoding='utf-8'))

def icon(c):
    return '<svg viewBox="0 0 165 125" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + icons[c['icon']] + '</svg>'

def photo(filename='maijishan.webp'):
    return 'data:image/webp;base64,' + base64.b64encode((ROOT / 'assets' / filename).read_bytes()).decode('ascii')

background_photos = {
    'fuxi': ('fuxi-temple.webp', '伏羲庙实景', '新甘肃客户端 / 天水市融媒体中心'),
    'bronze': ('bronze-horse.webp', '甘肃省博物馆铜奔马', '新浪新闻'),
    'apple': ('apples.webp', '红苹果主题配图', 'Unsplash · 苹果主题配图'),
    'maiji': ('maijishan.webp', '秋色中的麦积山石窟', '敦煌研究院'),
    'river': ('yellow-river.webp', '兰州黄河之滨的夕阳', '华声在线'),
}

def scenic_background(chapter):
    filename, alt, _ = background_photos[chapter]
    return '<div class="reader-background" aria-hidden="true"><img src="'+photo(filename)+'" alt="" fetchpriority="high"></div><div class="reader-shade"></div>'

def nav(active):
    links = [('index.html', '足迹序章', 'home'), ('explore.html', '五境探索', 'explore'), ('quiz.html', '知识自测', 'quiz')]
    return '''<header class="topbar"><nav class="nav wrap" aria-label="主导航">
    <a class="brand" href="index.html" aria-label="甘肃足迹首页"><span class="brand-seal" aria-hidden="true">甘肃<br>足迹</span><span><span class="brand-name">甘肃足迹</span><span class="brand-en">GANSU · A LIVING HERITAGE</span></span></a>
    <div class="nav-links" id="nav-links">''' + ''.join('<a href="' + href + '"' + (' class="active" aria-current="page"' if kind == active else '') + '>' + label + '</a>' for href, label, kind in links) + '''</div>
    <button class="menu-button" id="menu-button" aria-expanded="false" aria-controls="nav-links" aria-label="展开导航">☰</button>
    </nav></header>'''

def footer():
    return '''<footer class="site-bottom"><div class="wrap bottom-inner"><div class="bottom-quote"><span aria-hidden="true">“</span><p>古老文明与现代发展在这里共生，多元的文化在此交汇相融。</p></div><div class="bottom-identity"><a href="index.html">甘肃足迹</a><p>《习概》课程作业</p></div><button class="source-button" data-sources>内容与图片来源 ↗</button></div></footer>'''

sources = '''<dialog id="sources-dialog" aria-labelledby="sources-title"><div class="dialog-top"><span>REFERENCE / 内容来源</span><button class="dialog-close" aria-label="关闭来源说明">×</button></div><div class="dialog-content"><p class="eyebrow">循迹有据</p><h2 id="sources-title">内容与图片来源</h2><h3>内容</h3><p>神话与民间说法按文化叙事介绍，未注明年份的统计数据不作为当前统计展示。</p><p>青铜器博物院的关联考察发生在陕西宝鸡，与甘肃青铜文化分开介绍。</p><h3>图片</h3><p>麦积山石窟实景来自<a href="https://www.dha.ac.cn/skxl/mjssk.htm" target="_blank" rel="noopener noreferrer">敦煌研究院 · 麦积山石窟</a>，图片著作权归原权利人。伏羲庙实景来自<a href="https://xgs.newgscloud.com/pages/2025/06/18/0c808c510d50434abec8969aa68b3789.html" target="_blank" rel="noopener noreferrer">新甘肃客户端《伏羲庙，中华精神图腾之地》</a>，原文来源为天水市融媒体中心。铜奔马配图来自<a href="https://k.sina.com.cn/article_2490780034_p9476498202700i1zn.html" target="_blank" rel="noopener noreferrer">新浪新闻铜奔马图集</a>；红苹果配图来自<a href="https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6" target="_blank" rel="noopener noreferrer">Unsplash</a>，用于苹果主题意象，不作为花牛苹果品种或产地的证明；兰州黄河照片来自<a href="https://www.voc.com.cn/article/202009/202009211330205646.html" target="_blank" rel="noopener noreferrer">华声在线《黄河之滨也很美》</a>。图片著作权归原权利人。线描图为主题示意。</p><h3>地图</h3><p>市州轮廓依据<a href="https://geo.datav.aliyun.com/areas_v3/bound/620000_full.json" target="_blank" rel="noopener noreferrer">阿里云 DataV 行政区划数据</a>绘制，仅作主题导航。标记为方便阅读有适当偏移，不用于精确地理测量。</p></div></dialog>'''

def write_page(name, title, body, page='explore'):
    css = (SOURCE / 'site.css').read_text(encoding='utf-8')
    script = (SOURCE / 'site.js').read_text(encoding='utf-8')
    if page == 'quiz':
        script = (SOURCE / 'quiz-data.js').read_text(encoding='utf-8') + script
    document = f'''<!doctype html>
<html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="theme-color" content="#263f35"><meta name="description" content="探索伏羲庙、青铜文明、花牛苹果、麦积山石窟与黄河治理。"><title>{esc(title)} · 甘肃足迹</title><style>{css}</style></head>
<body data-page="{page}" class="{'has-bottom' if page != 'home' else ''}"><a class="skip-link" href="#main">跳到主要内容</a>{nav('explore' if page == 'reader' else page)}<main id="main">{body}</main>{'' if page == 'home' else footer()}{sources}<script>{script}</script></body></html>'''
    (ROOT / name).write_text(document, encoding='utf-8')

def build_home():
    descriptions = [
        ('maiji', 'TIANSHUI, GANSU · 麦积山', '山河有迹，文脉悠长', '一眼千年，走近陇原的文化与生活'),
        ('fuxi', 'TIANSHUI, GANSU · 伏羲庙', '羲皇故里，寻根华夏', '在古建与祭典之间，读懂文明的记忆'),
        ('bronze', 'GANSU · 青铜文明', '金石有声，千年回响', '从铜奔马的昂扬姿态，感受古代工艺之美'),
        ('apple', 'GANSU · 乡土新生 / 苹果配图', '一颗红果，一方丰收', '循着花牛苹果的故事，走进乡村的日常'),
        ('river', 'LANZHOU, GANSU · 黄河', '黄河奔流，万物共生', '在黄河之滨，看见城市与山河相依'),
    ]
    slides = []
    for n, (key, place, title, desc) in enumerate(descriptions):
        filename, alt, credit = background_photos[key]
        slides.append(f'<div class="hero-slide" role="group" aria-roledescription="幻灯片" aria-label="{n+1} / 5"'+(' inert' if n else '')+f'><img src="{photo(filename)}" width="1800" height="1350" alt="{alt}"'+(' fetchpriority="high"' if n == 0 else ' loading="eager" decoding="async"')+f'><div class="hero-caption"><p class="eyebrow">{place}</p><h2>{title}</h2><p>{desc}</p></div><button class="photo-credit" data-sources>图片来源：{credit} ↗</button></div>')
    dots = ''.join(f'<button class="carousel-dot" data-slide="{n}" aria-label="查看第{n+1}张：{background_photos[key][1]}" aria-current="'+('true' if n == 0 else 'false')+'"></button>' for n,(key,*_) in enumerate(descriptions))
    carousel = '<section class="hero-art" role="region" aria-roledescription="轮播图" aria-label="陇原风景" tabindex="0"><div class="hero-track">'+''.join(slides)+'</div><span class="hero-stamp" aria-hidden="true">陇原行记</span><div class="carousel-controls"><button class="carousel-arrow" data-step="-1" aria-label="上一张">←</button><div class="carousel-dots">'+dots+'</div><button class="carousel-arrow" data-step="1" aria-label="下一张">→</button><button class="carousel-toggle" aria-label="暂停自动轮播" aria-pressed="false">Ⅱ</button></div><span class="carousel-status sr-only" aria-live="polite" aria-atomic="true"></span></section>'
    body = '''<section class="hero" aria-labelledby="hero-title"><div class="wrap hero-grid"><div class="hero-copy"><p class="hero-kicker">行走陇原大地 · 感知时代脉搏</p><h1 id="hero-title">沿着足迹，<br>读懂<em>甘肃。</em></h1><p class="hero-desc">从文明根脉到乡土新生，从千年石窟到黄河安澜。<br>循着五重视角，走近厚重而鲜活的陇原大地。</p><a class="primary" href="explore.html">开启陇原之旅<span class="arrow" aria-hidden="true">↗</span></a></div>''' + carousel + '</div></section>'
    write_page('index.html', '沿着足迹，读懂甘肃', body, 'home')


def build_map(target_id=None):
    geo = json.loads((SOURCE / 'gansu-geo.json').read_text(encoding='utf-8'))
    all_points = []
    for feature in geo['features']:
        geometry = feature['geometry']
        polygons = geometry['coordinates'] if geometry['type'] == 'MultiPolygon' else [geometry['coordinates']]
        for polygon in polygons:
            for ring in polygon:
                all_points.extend(ring)
    min_lon, max_lon = min(p[0] for p in all_points), max(p[0] for p in all_points)
    min_lat, max_lat = min(p[1] for p in all_points), max(p[1] for p in all_points)
    scale = min(490 / ((max_lon - min_lon) * .8), 275 / (max_lat - min_lat))
    ox = (580 - (max_lon - min_lon) * .8 * scale) / 2
    oy = (330 - (max_lat - min_lat) * scale) / 2

    def project(lon, lat):
        return round(ox + (lon - min_lon) * .8 * scale, 1), round(oy + (max_lat - lat) * scale, 1)

    paths = []
    for feature in geo['features']:
        geometry = feature['geometry']
        polygons = geometry['coordinates'] if geometry['type'] == 'MultiPolygon' else [geometry['coordinates']]
        segments = []
        for polygon in polygons:
            for ring in polygon:
                coords = [project(*p) for p in ring]
                segments.append('M' + 'L'.join(f'{x},{y}' for x, y in coords) + 'Z')
        target_city = {'fuxi':'天水市','bronze':'武威市','apple':'天水市','maiji':'天水市','river':'兰州市'}.get(target_id)
        highlight = ' location-highlight' if target_id and feature['properties']['name'] == target_city else ''
        paths.append('<path class="province' + highlight + '" d="' + ''.join(segments) + '"><title>' + feature['properties']['name'] + '</title></path>')
    positions = [(105.71,34.58,-8,-5,-27,-22,'end'),(102.64,37.93,0,0,-17,-13,'end'),(105.96,34.53,10,-6,28,-20,'start'),(106,34.35,9,12,30,33,'start'),(103.83,36.06,0,0,21,-12,'start')]
    for c, (lon,lat,dx,dy,tx,ty,anchor) in zip(chapters,positions):
        if target_id and c['id'] != target_id:
            continue
        x,y = project(lon,lat)
        if target_id:
            paths.append(f'<g class="map-marker"><circle cx="{x+dx}" cy="{y+dy}" r="7"/><text x="{x+tx}" y="{y+ty}" text-anchor="{anchor}">{c["name"]}</text></g>')
        else:
            paths.append(f'<a href="{c["id"]}.html" class="map-marker" aria-label="探索{c["name"]}"><line x1="{x+dx}" y1="{y+dy}" x2="{x+tx}" y2="{y+ty}"/><circle cx="{x+dx}" cy="{y+dy}" r="6"/><text x="{x+tx}" y="{y+ty}" text-anchor="{anchor}">{c["name"]}</text></a>')
    label = '甘肃省内主题位置示意图' if target_id else '甘肃主题地点示意图'
    return '<svg viewBox="0 0 580 350" role="img" aria-label="' + label + '">' + ''.join(paths) + '</svg>'

def build_explore():
    destinations = ''.join(f'<a class="destination" href="{c["id"]}.html"><span class="destination-number">0{i+1}</span><span class="destination-copy"><strong>{c["name"]}</strong><small>{c["subtitle"]}</small></span><span class="destination-category">{c["category"]}</span><span class="arrow" aria-hidden="true">↗</span></a>' for i,c in enumerate(chapters))
    body = '''<section class="explore wrap"><div class="page-heading"><p class="eyebrow">EXPLORE GANSU / 五境探索</p><h1>把陇原，慢慢读给你听</h1><p>选择一个地方，展开一段旅程。<br>在文化、产业与生态之间，发现甘肃的不同面貌。</p></div><div class="explore-grid"><div class="map-panel"><p class="map-eyebrow">GANSU / 陇原主题图</p><span class="map-north">N<br>↑</span>''' + build_map() + '''<p class="map-foot">点击标记进入主题 · 地点仅作示意</p></div><div class="destinations" aria-label="五个独立主题页面">''' + destinations + '''</div></div></section>'''
    write_page('explore.html', '五境探索', body)

def clean_text(text):
    replacements = {
        'PPT 记述，考察伏羲庙时强调，':'在伏羲庙考察时强调，',
        'PPT 记述南山花牛苹果基地考察，':'南山花牛苹果基地的考察，',
        'PPT 记述在麦积山石窟察看洞窟、雕塑与壁画，并与保护修复工作人员交流，':'在麦积山石窟考察时，察看洞窟、雕塑与壁画，与保护修复工作人员交流，',
        'PPT 记述在黄河兰州中山桥段考察，':'在黄河兰州中山桥段考察时，',
        'PPT 以苹果试种、销售与地方育种的故事，讲述':'苹果试种、销售与地方育种的故事，讲述了',
        'PPT 介绍了花牛苹果带动农户增收、拓展国内外市场的作用。原稿的面积、产值等数字未注明统计年份，本预览不将其作为当前统计展示。':'花牛苹果带动农户增收，并不断拓展国内外市场，成为当地乡村振兴的重要特色产业。',
        'PPT 同时介绍引洮供水工程。':'引洮供水工程为当地发展提供重要保障。',
    }
    for before,after in replacements.items():
        text = text.replace(before,after)
    return esc(text)

def build_chapter(c,i):
    background = scenic_background(c['id'])
    locations = {'fuxi':'秦州区 · 伏羲路','bronze':'多地遗存 · 武威代表点','apple':'麦积区 · 南山果园','maiji':'麦积区 · 麦积山','river':'兰州 · 中山桥段'}
    contents = ''.join('<a href="#topic-'+str(n+1)+'"><span>0'+str(n+1)+'</span><span>'+esc(t[0].split('：')[-1])+'</span></a>' for n,t in enumerate(c['topics']))
    topics = ''.join('<section class="reader-topic chapter-topic" id="topic-'+str(n+1)+'" aria-labelledby="topic-title-'+str(n+1)+'"><p class="eyebrow">0'+str(n+1)+' / '+esc(t[0].split('：')[-1])+'</p><h2 id="topic-title-'+str(n+1)+'">'+esc(t[0])+'</h2>'+''.join('<p class="reader-paragraph">'+clean_text(paragraph)+'</p>' for paragraph in t[1].split('\n\n'))+'</section>' for n,t in enumerate(c['topics']))
    previous = '<a class="text-link" href="explore.html">← 返回五境探索</a>' if i == 0 else '<a class="text-link" href="'+chapters[i-1]['id']+'.html">← 上一站：'+chapters[i-1]['name']+'</a>'
    following = '<a class="primary" href="quiz.html">去知识自测 ↗</a>' if i == 4 else '<a class="primary" href="'+chapters[i+1]['id']+'.html">下一站：'+chapters[i+1]['name']+' →</a>'
    credit = '<button class="reader-photo-credit" data-sources>图片来源：'+background_photos[c['id']][2]+' ↗</button>'
    body = background + '<div class="wrap reader-layout"><aside class="reader-sidebar" aria-label="地理位置与文章目录"><a class="reader-back" href="explore.html">← 返回五境探索</a><section class="reader-location" aria-labelledby="location-title"><p class="eyebrow">LOCATION / 地理位置</p>'+build_map(c['id'])+'<h2 id="location-title">'+('甘肃多地' if c['id']=='bronze' else c['place'])+'</h2><p>'+locations[c['id']]+'</p></section><div class="reader-directory"><p class="eyebrow">CONTENTS / 本境导览</p><nav aria-label="文章目录"><a href="#overview" aria-current="location"><span>序</span><span>景点介绍</span></a>'+contents+'</nav></div></aside><article class="reader-article" aria-labelledby="reader-title"><header class="reader-heading" id="overview"><p class="eyebrow">'+c['en']+'</p><h1 id="reader-title">'+c['name']+'</h1><p class="reader-subtitle">'+c['subtitle']+'</p><p class="reader-intro">'+c['intro']+'</p></header>'+topics+'<nav class="reader-pagination" aria-label="相邻主题">'+previous+following+'</nav>'+credit+'</article></div>'
    write_page(c['id']+'.html',c['name'],body,'reader')

def build_quiz():
    body='''<section class="quiz-page wrap"><div class="quiz-layout"><div class="quiz-intro"><p class="eyebrow">A MOMENT TO REFLECT / 知识自测</p><h1>走过五境，<br>你记住了什么？</h1><p>用五道小题回望这段旅程。<br>答完每一题，即可查看答案与解读。</p><a href="explore.html" class="text-link">回到五境，再看一看 →</a></div><div class="quiz-box" id="quiz-box" aria-live="polite"></div></div></section>'''
    write_page('quiz.html','知识自测',scenic_background('river') + body,'quiz')

build_home()
build_explore()
for i,c in enumerate(chapters):
    build_chapter(c,i)
build_quiz()
print('Built 8 static HTML pages: home, explore, 5 destinations, and quiz.')
