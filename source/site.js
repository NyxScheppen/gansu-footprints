'use strict';
const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

const carousel = $('.hero-art');
if (carousel) {
  const track = $('.hero-track', carousel);
  const slides = $$('.hero-slide', carousel);
  const dots = $$('.carousel-dot', carousel);
  const toggle = $('.carousel-toggle', carousel);
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  let index = 0, timer, hovering = false, touchStart;
  let paused = motion.matches;
  function schedule() {
    clearTimeout(timer);
    if (paused || hovering || document.hidden || carousel.contains(document.activeElement) || $('#sources-dialog').open) return;
    timer = setTimeout(() => show(index + 1), 4500);
  }
  function show(next, announce = false) {
    index = (next + slides.length) % slides.length;
    carousel.dataset.activeSlide = String(index);
    track.style.transform = `translateX(-${index * 100}%)`;
    slides.forEach((slide, n) => { slide.inert = n !== index; });
    dots.forEach((dot, n) => dot.setAttribute('aria-current', String(n === index)));
    if (announce) $('.carousel-status', carousel).textContent = `第 ${index + 1} 张，共 ${slides.length} 张：${$('img', slides[index]).alt}`;
    schedule();
  }
  function updateToggle() {
    toggle.setAttribute('aria-label', paused ? '开始自动轮播' : '暂停自动轮播');
    toggle.setAttribute('aria-pressed', String(paused));
    toggle.textContent = paused ? '▷' : 'Ⅱ';
  }
  $$('[data-step]', carousel).forEach(button => button.addEventListener('click', () => show(index + Number(button.dataset.step), true)));
  dots.forEach((dot, n) => dot.addEventListener('click', () => show(n, true)));
  toggle.addEventListener('click', () => { paused = !paused; updateToggle(); schedule(); });
  carousel.addEventListener('pointerenter', event => { if (event.pointerType === 'mouse') { hovering = true; schedule(); } });
  carousel.addEventListener('pointerleave', () => { hovering = false; schedule(); });
  carousel.addEventListener('focusin', schedule);
  carousel.addEventListener('focusout', () => setTimeout(schedule, 0));
  document.addEventListener('visibilitychange', schedule);
  $('#sources-dialog').addEventListener('close', schedule);
  carousel.addEventListener('keydown', event => {
    if (!['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
    event.preventDefault();
    show(index + (event.key === 'ArrowRight' ? 1 : -1), true);
  });
  carousel.addEventListener('touchstart', event => {
    touchStart = {x:event.touches[0].clientX, y:event.touches[0].clientY};
    clearTimeout(timer);
  }, {passive:true});
  carousel.addEventListener('touchend', event => {
    if (!touchStart) return;
    const dx = event.changedTouches[0].clientX - touchStart.x;
    const dy = event.changedTouches[0].clientY - touchStart.y;
    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) show(index + (dx < 0 ? 1 : -1), true);
    else schedule();
    touchStart = null;
  }, {passive:true});
  carousel.addEventListener('touchcancel', () => { touchStart = null; schedule(); }, {passive:true});
  motion.addEventListener('change', event => { paused = event.matches; updateToggle(); schedule(); });
  updateToggle();
  show(0);
}

const bottomBar = $('.site-bottom');
if (bottomBar) {
  const updateBottomSpace = () => document.documentElement.style.setProperty('--bottom-height', bottomBar.getBoundingClientRect().height + 'px');
  new ResizeObserver(updateBottomSpace).observe(bottomBar);
  updateBottomSpace();
}

const directoryLinks = $$('.reader-directory a');
if (directoryLinks.length) {
  const sections = directoryLinks.map(link => document.getElementById(link.hash.slice(1)));
  let framePending = false;
  function updateDirectory() {
    const headerBottom = $('.topbar').getBoundingClientRect().bottom;
    let activeIndex = 0;
    sections.forEach((section, index) => {
      if (section.getBoundingClientRect().top <= headerBottom + Math.min(180, innerHeight * .25)) activeIndex = index;
    });
    directoryLinks.forEach((link, index) => {
      if (index === activeIndex) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
    framePending = false;
  }
  addEventListener('scroll', () => {
    if (!framePending) {
      requestAnimationFrame(updateDirectory);
      framePending = true;
    }
  }, {passive:true});
  addEventListener('resize', updateDirectory);
  updateDirectory();
}

const menuButton = $('#menu-button');
const navLinks = $('#nav-links');
function closeMenu() {
  navLinks.classList.remove('open');
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', '展开导航');
}
menuButton.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? '收起导航' : '展开导航');
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && navLinks.classList.contains('open')) {
    closeMenu();
    menuButton.focus();
  }
});
document.addEventListener('click', event => {
  if (!event.target.closest('.nav')) closeMenu();
});

const sources = $('#sources-dialog');
let sourceTrigger;
$$('[data-sources]').forEach(button => button.addEventListener('click', () => {
  sourceTrigger = button;
  sources.showModal();
  document.body.classList.add('locked');
}));
$('.dialog-close', sources).addEventListener('click', () => sources.close());
sources.addEventListener('close', () => {
  document.body.classList.remove('locked');
  sourceTrigger?.focus();
});
sources.addEventListener('click', event => {
  if (event.target !== sources) return;
  const rect = sources.getBoundingClientRect();
  if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) sources.close();
});

if (document.body.dataset.page === 'quiz') {
  const chapterNames = {fuxi:'伏羲庙', bronze:'青铜文明', apple:'花牛苹果', maiji:'麦积山石窟', river:'黄河治理'};
  let questionIndex = 0;
  let answers = [];
  const box = $('#quiz-box');
  const letters = ['A', 'B', 'C', 'D'];

  function renderQuiz(focusQuestion = false) {
    if (questionIndex === questions.length) {
      const score = answers.filter((answer, i) => answer === questions[i].correct).length;
      const missed = questions.filter((question, i) => answers[i] !== question.correct);
      box.innerHTML = `<div class="quiz-result"><p class="eyebrow">一段旅程，一次回望</p><div class="result-number">${score}<span> / 5</span></div><h2 id="quiz-result-title" tabindex="-1">${score === 5 ? '五境新知，已收入行囊。' : '带着问题，再读一次陇原。'}</h2><p>你已完成全部五道题。${score === 5 ? '愿这些知识，成为下一次探索的起点。' : '以下主题值得再回顾。'}</p>${missed.length ? '<div class="quiz-review">' + missed.map(question => `<a class="text-link" href="${question.chapter}.html">回顾${chapterNames[question.chapter]} →</a>`).join('') + '</div>' : ''}<button class="primary" id="restart-quiz">再挑战一次 <span aria-hidden="true">↻</span></button></div>`;
      $('#restart-quiz').addEventListener('click', () => {
        questionIndex = 0;
        answers = [];
        renderQuiz(true);
      });
      $('#quiz-result-title').focus({preventScroll:true});
      return;
    }
    const question = questions[questionIndex];
    box.innerHTML = `<div class="quiz-top"><span>0${questionIndex + 1} / 05 · ${chapterNames[question.chapter]}</span><div class="quiz-track" aria-label="第 ${questionIndex + 1} 题，共 5 题">${questions.map((_, i) => `<i class="${i < questionIndex ? 'done' : i === questionIndex ? 'current' : ''}"></i>`).join('')}</div></div><h2 id="quiz-question" tabindex="-1">${question.q}</h2><div class="quiz-options" role="group" aria-labelledby="quiz-question">${question.options.map((option, i) => `<button class="quiz-option" data-answer="${i}"><span>${letters[i]}</span>${option}</button>`).join('')}</div><p class="quiz-feedback" id="quiz-feedback">选择一个答案，看看你的理解。</p><div class="quiz-footer"><span>在思考中，把知识变成自己的收获</span><button class="primary" id="quiz-next" disabled>${questionIndex === 4 ? '查看结果' : '下一题'} <span aria-hidden="true">→</span></button></div>`;
    $$('[data-answer]', box).forEach(button => button.addEventListener('click', () => {
      if (answers[questionIndex] !== undefined) return;
      const answer = Number(button.dataset.answer);
      answers[questionIndex] = answer;
      $$('[data-answer]', box).forEach(option => {
        option.disabled = true;
        const value = Number(option.dataset.answer);
        option.classList.toggle('correct', value === question.correct);
        option.classList.toggle('wrong', value === answer && answer !== question.correct);
      });
      const feedback = $('#quiz-feedback');
      feedback.textContent = (answer === question.correct ? '✓ 答对了。' : `正确答案：${letters[question.correct]}。`) + question.explain;
      feedback.classList.toggle('wrong-text', answer !== question.correct);
      $('#quiz-next').disabled = false;
      $('#quiz-next').focus({preventScroll:true});
    }));
    $('#quiz-next').addEventListener('click', () => {
      if (answers[questionIndex] === undefined) return;
      questionIndex++;
      renderQuiz(true);
    });
    if (focusQuestion) $('#quiz-question').focus({preventScroll:true});
  }
  renderQuiz();
}
