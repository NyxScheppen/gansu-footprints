import Carousel from '../components/Carousel.jsx';

export default function Home({ onSources, sourcesOpen }) {
  return <section className="hero" aria-labelledby="hero-title"><div className="wrap hero-grid"><div className="hero-copy"><p className="hero-kicker">行走陇原大地 · 感知时代脉搏</p><h1 id="hero-title">沿着足迹，<br />读懂<em>甘肃。</em></h1><p className="hero-desc">从文明根脉到乡土新生，从千年石窟到黄河安澜。<br />循着五重视角，走近厚重而鲜活的陇原大地。</p><a className="primary" href="explore.html">开启陇原之旅<span className="arrow" aria-hidden="true">↗</span></a></div><Carousel onSources={onSources} sourcesOpen={sourcesOpen} /></div></section>;
}
