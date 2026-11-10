import { useState } from 'react';
import { chapters } from './data.js';
import { Footer, Navigation, Sources } from './components/Layout.jsx';
import Home from './pages/Home.jsx';
import Explore from './pages/Explore.jsx';
import Chapter from './pages/Chapter.jsx';
import Quiz from './pages/Quiz.jsx';

export default function App() {
  const slug = location.pathname.split('/').filter(Boolean).at(-1)?.replace(/\.html$/, '') || 'index';
  const chapter = chapters.find(item => item.id === slug);
  const page = chapter ? 'reader' : slug === 'explore' ? 'explore' : slug === 'quiz' ? 'quiz' : 'home';
  const [sourcesOpen, setSourcesOpen] = useState(false);
  const openSources = () => setSourcesOpen(true);
  return <><a className="skip-link" href="#main">跳到主要内容</a><Navigation active={page === 'reader' ? 'explore' : page} /><main id="main">{chapter ? <Chapter chapter={chapter} onSources={openSources} /> : page === 'explore' ? <Explore /> : page === 'quiz' ? <Quiz /> : <Home onSources={openSources} sourcesOpen={sourcesOpen} />}</main>{page !== 'home' && <Footer onSources={openSources} />}<Sources open={sourcesOpen} onClose={() => setSourcesOpen(false)} /></>;
}
