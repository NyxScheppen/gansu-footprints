import { useEffect, useRef, useState } from 'react';
import { photos } from '../data.js';

export function Navigation({ active }) {
  const [open, setOpen] = useState(false);
  const nav = useRef(null);
  const menu = useRef(null);
  useEffect(() => {
    const click = event => { if (!nav.current?.contains(event.target)) setOpen(false); };
    const key = event => {
      if (event.key === 'Escape' && open) { setOpen(false); menu.current?.focus(); }
    };
    document.addEventListener('click', click);
    document.addEventListener('keydown', key);
    return () => { document.removeEventListener('click', click); document.removeEventListener('keydown', key); };
  }, [open]);
  const links = [['index', '足迹序章', 'home'], ['explore', '五境探索', 'explore'], ['quiz', '知识自测', 'quiz']];
  return <header className="topbar"><nav className="nav wrap" aria-label="主导航" ref={nav}>
    <a className="brand" href="index.html" aria-label="甘肃足迹首页"><span className="brand-seal" aria-hidden="true">甘肃<br />足迹</span><span><span className="brand-name">甘肃足迹</span><span className="brand-en">GANSU · A LIVING HERITAGE</span></span></a>
    <div className={`nav-links${open ? ' open' : ''}`} id="nav-links">{links.map(([path, label, kind]) => <a key={path} href={`${path}.html`} className={active === kind ? 'active' : undefined} aria-current={active === kind ? 'page' : undefined}>{label}</a>)}</div>
    <button className="menu-button" id="menu-button" ref={menu} aria-expanded={open} aria-controls="nav-links" aria-label={open ? '收起导航' : '展开导航'} onClick={() => setOpen(!open)}>☰</button>
  </nav></header>;
}

export function Footer({ onSources }) {
  const footer = useRef(null);
  useEffect(() => {
    const update = () => document.documentElement.style.setProperty('--bottom-height', `${footer.current.getBoundingClientRect().height}px`);
    const observer = new ResizeObserver(update);
    observer.observe(footer.current);
    update();
    return () => observer.disconnect();
  }, []);
  return <footer className="site-bottom" ref={footer}><div className="wrap bottom-inner"><div className="bottom-quote"><span aria-hidden="true">“</span><p>古老文明与现代发展在这里共生，多元的文化在此交汇相融。</p></div><div className="bottom-identity"><a href="index.html">甘肃足迹</a><p>《习概》课程作业</p></div><button className="source-button" data-sources onClick={onSources}>内容与图片来源 ↗</button></div></footer>;
}

function Reference({ href, children }) {
  return <a href={href} target="_blank" rel="noopener noreferrer">{children}</a>;
}

export function Sources({ open, onClose }) {
  const dialog = useRef(null);
  const trigger = useRef(null);
  useEffect(() => {
    const el = dialog.current;
    if (open) {
      trigger.current = document.activeElement;
      if (!el.open) el.showModal();
      document.body.classList.add('locked');
    } else if (el.open) el.close();
    return () => document.body.classList.remove('locked');
  }, [open]);
  function closed() {
    document.body.classList.remove('locked');
    onClose();
    trigger.current?.focus();
  }
  return <dialog id="sources-dialog" aria-labelledby="sources-title" ref={dialog} onClose={closed} onClick={event => {
    if (event.target !== dialog.current) return;
    const { left, right, top, bottom } = dialog.current.getBoundingClientRect();
    if (event.clientX < left || event.clientX > right || event.clientY < top || event.clientY > bottom) dialog.current.close();
  }}><div className="dialog-top"><span>REFERENCE / 内容来源</span><button className="dialog-close" aria-label="关闭来源说明" onClick={() => dialog.current.close()}>×</button></div><div className="dialog-content"><p className="eyebrow">循迹有据</p><h2 id="sources-title">内容与图片来源</h2><h3>内容</h3><p>神话与民间说法按文化叙事介绍，未注明年份的统计数据不作为当前统计展示。</p><p>青铜器博物院的关联考察发生在陕西宝鸡，与甘肃青铜文化分开介绍。</p><h3>图片</h3><p>麦积山石窟实景来自<Reference href="https://www.dha.ac.cn/skxl/mjssk.htm">敦煌研究院 · 麦积山石窟</Reference>，图片著作权归原权利人。伏羲庙实景来自<Reference href="https://xgs.newgscloud.com/pages/2025/06/18/0c808c510d50434abec8969aa68b3789.html">新甘肃客户端《伏羲庙，中华精神图腾之地》</Reference>，原文来源为天水市融媒体中心。铜奔马配图来自<Reference href="https://k.sina.com.cn/article_2490780034_p9476498202700i1zn.html">新浪新闻铜奔马图集</Reference>；红苹果配图来自<Reference href="https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6">Unsplash</Reference>，用于苹果主题意象，不作为花牛苹果品种或产地的证明；兰州黄河照片来自<Reference href="https://www.voc.com.cn/article/202009/202009211330205646.html">华声在线《黄河之滨也很美》</Reference>。图片著作权归原权利人。线描图为主题示意。</p><h3>地图</h3><p>市州轮廓依据<Reference href="https://geo.datav.aliyun.com/areas_v3/bound/620000_full.json">阿里云 DataV 行政区划数据</Reference>绘制，仅作主题导航。标记为方便阅读有适当偏移，不用于精确地理测量。</p></div></dialog>;
}

export function ScenicBackground({ chapter }) {
  return <><div className="reader-background" aria-hidden="true"><img src={photos[chapter].src} alt="" fetchPriority="high" /></div><div className="reader-shade" /></>;
}
