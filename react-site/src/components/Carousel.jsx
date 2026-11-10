import { useEffect, useRef, useState } from 'react';
import { photos, slides } from '../data.js';

export default function Carousel({ onSources, sourcesOpen }) {
  const root = useRef(null);
  const touch = useRef(null);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(() => matchMedia('(prefers-reduced-motion: reduce)').matches);
  const [hover, setHover] = useState(false);
  const [focused, setFocused] = useState(false);
  const [hidden, setHidden] = useState(document.hidden);
  const [touching, setTouching] = useState(false);
  const [status, setStatus] = useState('');

  useEffect(() => {
    const media = matchMedia('(prefers-reduced-motion: reduce)');
    const motion = event => setPaused(event.matches);
    const visibility = () => setHidden(document.hidden);
    media.addEventListener('change', motion);
    document.addEventListener('visibilitychange', visibility);
    return () => { media.removeEventListener('change', motion); document.removeEventListener('visibilitychange', visibility); };
  }, []);
  useEffect(() => {
    if (paused || hover || focused || hidden || sourcesOpen || touching) return;
    const timer = setTimeout(() => setIndex(current => (current + 1) % slides.length), 4500);
    return () => clearTimeout(timer);
  }, [index, paused, hover, focused, hidden, sourcesOpen, touching]);

  function show(next) {
    const selected = (next + slides.length) % slides.length;
    setIndex(selected);
    setStatus(`第 ${selected + 1} 张，共 ${slides.length} 张：${photos[slides[selected].id].alt}`);
  }
  return <section className="hero-art" role="region" aria-roledescription="轮播图" aria-label="陇原风景" tabIndex="0" ref={root} data-active-slide={index}
    onPointerEnter={event => { if (event.pointerType === 'mouse') setHover(true); }} onPointerLeave={() => setHover(false)}
    onFocus={() => setFocused(true)} onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false); }}
    onKeyDown={event => {
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') { event.preventDefault(); show(index + (event.key === 'ArrowRight' ? 1 : -1)); }
    }}
    onTouchStart={event => { touch.current = { x: event.touches[0].clientX, y: event.touches[0].clientY }; setTouching(true); }}
    onTouchEnd={event => {
      if (touch.current) {
        const dx = event.changedTouches[0].clientX - touch.current.x;
        const dy = event.changedTouches[0].clientY - touch.current.y;
        if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) show(index + (dx < 0 ? 1 : -1));
      }
      touch.current = null; setTouching(false);
    }} onTouchCancel={() => { touch.current = null; setTouching(false); }}>
    <div className="hero-track" style={{ transform: `translateX(-${index * 100}%)` }}>{slides.map((slide, n) => <div className="hero-slide" key={slide.id} role="group" aria-roledescription="幻灯片" aria-label={`${n + 1} / 5`} inert={n !== index}>
      <img src={photos[slide.id].src} width="1800" height="1350" alt={photos[slide.id].alt} fetchPriority={n === 0 ? 'high' : undefined} decoding={n === 0 ? undefined : 'async'} />
      <div className="hero-caption"><p className="eyebrow">{slide.place}</p><h2>{slide.title}</h2><p>{slide.desc}</p></div>
      <button className="photo-credit" data-sources onClick={onSources}>图片来源：{photos[slide.id].credit} ↗</button>
    </div>)}</div><span className="hero-stamp" aria-hidden="true">陇原行记</span>
    <div className="carousel-controls"><button className="carousel-arrow" data-step="-1" aria-label="上一张" onClick={() => show(index - 1)}>←</button><div className="carousel-dots">{slides.map((slide, n) => <button className="carousel-dot" key={slide.id} data-slide={n} aria-label={`查看第${n + 1}张：${photos[slide.id].alt}`} aria-current={n === index ? 'true' : 'false'} onClick={() => show(n)} />)}</div><button className="carousel-arrow" data-step="1" aria-label="下一张" onClick={() => show(index + 1)}>→</button><button className="carousel-toggle" aria-label={paused ? '开始自动轮播' : '暂停自动轮播'} aria-pressed={paused} onClick={() => setPaused(!paused)}>{paused ? '▷' : 'Ⅱ'}</button></div>
    <span className="carousel-status sr-only" aria-live="polite" aria-atomic="true">{status}</span>
  </section>;
}
