import { useEffect, useState } from 'react';
import { chapters, photos } from '../data.js';
import GansuMap from '../components/GansuMap.jsx';
import { ScenicBackground } from '../components/Layout.jsx';

const locations = { fuxi: '秦州区 · 伏羲路', bronze: '多地遗存 · 武威代表点', apple: '麦积区 · 南山果园', maiji: '麦积区 · 麦积山', river: '兰州 · 中山桥段' };
const topicLabel = title => title.split('：').at(-1);

export default function Chapter({ chapter, onSources }) {
  const [active, setActive] = useState('overview');
  const index = chapters.findIndex(item => item.id === chapter.id);
  useEffect(() => {
    const sections = ['overview', ...chapter.topics.map((_, n) => `topic-${n + 1}`)].map(id => document.getElementById(id));
    let frame;
    const update = () => {
      const edge = document.querySelector('.topbar').getBoundingClientRect().bottom + Math.min(180, innerHeight * .25);
      let current = 'overview';
      sections.forEach(section => { if (section.getBoundingClientRect().top <= edge) current = section.id; });
      setActive(current);
      frame = null;
    };
    const scroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    addEventListener('scroll', scroll, { passive: true });
    addEventListener('resize', scroll);
    update();
    return () => { removeEventListener('scroll', scroll); removeEventListener('resize', scroll); cancelAnimationFrame(frame); };
  }, [chapter]);

  return <><ScenicBackground chapter={chapter.id} /><div className="wrap reader-layout"><aside className="reader-sidebar" aria-label="地理位置与文章目录"><a className="reader-back" href="explore.html">← 返回五境探索</a><section className="reader-location" aria-labelledby="location-title"><p className="eyebrow">LOCATION / 地理位置</p><GansuMap chapter={chapter.id} /><h2 id="location-title">{chapter.id === 'bronze' ? '甘肃多地' : chapter.place}</h2><p>{locations[chapter.id]}</p></section><div className="reader-directory"><p className="eyebrow">CONTENTS / 本境导览</p><nav aria-label="文章目录"><a href="#overview" aria-current={active === 'overview' ? 'location' : undefined}><span>序</span><span>景点介绍</span></a>{chapter.topics.map(([title], n) => <a key={title} href={`#topic-${n + 1}`} aria-current={active === `topic-${n + 1}` ? 'location' : undefined}><span>0{n + 1}</span><span>{topicLabel(title)}</span></a>)}</nav></div></aside>
    <article className="reader-article" aria-labelledby="reader-title"><header className="reader-heading" id="overview"><p className="eyebrow">{chapter.en}</p><h1 id="reader-title">{chapter.name}</h1><p className="reader-subtitle">{chapter.subtitle}</p><p className="reader-intro">{chapter.intro}</p></header>{chapter.topics.map(([title, body], n) => <section className="reader-topic chapter-topic" id={`topic-${n + 1}`} aria-labelledby={`topic-title-${n + 1}`} key={title}><p className="eyebrow">0{n + 1} / {topicLabel(title)}</p><h2 id={`topic-title-${n + 1}`}>{title}</h2>{body.split('\n\n').map((paragraph, p) => <p className="reader-paragraph" key={p}>{paragraph}</p>)}</section>)}
    <nav className="reader-pagination" aria-label="相邻主题">{index === 0 ? <a className="text-link" href="explore.html">← 返回五境探索</a> : <a className="text-link" href={`${chapters[index - 1].id}.html`}>← 上一站：{chapters[index - 1].name}</a>}{index === chapters.length - 1 ? <a className="primary" href="quiz.html">去知识自测 ↗</a> : <a className="primary" href={`${chapters[index + 1].id}.html`}>下一站：{chapters[index + 1].name} →</a>}</nav><button className="reader-photo-credit" data-sources onClick={onSources}>图片来源：{photos[chapter.id].credit} ↗</button></article></div></>;
}
