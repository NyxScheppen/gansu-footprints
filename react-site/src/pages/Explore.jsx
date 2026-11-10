import { chapters } from '../data.js';
import GansuMap from '../components/GansuMap.jsx';

export default function Explore() {
  return <section className="explore wrap"><div className="page-heading"><p className="eyebrow">EXPLORE GANSU / 五境探索</p><h1>把陇原，慢慢读给你听</h1><p>选择一个地方，展开一段旅程。<br />在文化、产业与生态之间，发现甘肃的不同面貌。</p></div><div className="explore-grid"><div className="map-panel"><p className="map-eyebrow">GANSU / 陇原主题图</p><span className="map-north">N<br />↑</span><GansuMap /><p className="map-foot">点击标记进入主题 · 地点仅作示意</p></div><div className="destinations" aria-label="五个独立主题页面">{chapters.map((chapter, index) => <a className="destination" href={`${chapter.id}.html`} key={chapter.id}><span className="destination-number">0{index + 1}</span><span className="destination-copy"><strong>{chapter.name}</strong><small>{chapter.subtitle}</small></span><span className="destination-category">{chapter.category}</span><span className="arrow" aria-hidden="true">↗</span></a>)}</div></div></section>;
}
