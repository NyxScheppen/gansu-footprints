import { useEffect, useRef, useState } from 'react';
import questions from '../questions.json';
import { chapters } from '../data.js';
import { ScenicBackground } from '../components/Layout.jsx';

const names = Object.fromEntries(chapters.map(chapter => [chapter.id, chapter.name]));
const letters = ['A', 'B', 'C', 'D'];

export default function Quiz() {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const title = useRef(null);
  const next = useRef(null);
  const initial = useRef(true);
  const finished = index === questions.length;
  const question = questions[index];
  const answer = answers[index];
  const answered = answer !== undefined;
  const score = answers.filter((value, n) => value === questions[n].correct).length;
  const missed = questions.filter((item, n) => answers[n] !== item.correct);

  useEffect(() => {
    if (initial.current) { initial.current = false; return; }
    title.current?.focus({ preventScroll: true });
  }, [index]);
  useEffect(() => { if (answered && !finished) next.current?.focus({ preventScroll: true }); }, [answered, finished]);

  function choose(value) {
    if (answered) return;
    setAnswers(previous => [...previous, value]);
  }

  return <><ScenicBackground chapter="river" /><section className="quiz-page wrap"><div className="quiz-layout"><div className="quiz-intro"><p className="eyebrow">A MOMENT TO REFLECT / 知识自测</p><h1>走过五境，<br />你记住了什么？</h1><p>用五道小题回望这段旅程。<br />答完每一题，即可查看答案与解读。</p><a href="explore.html" className="text-link">回到五境，再看一看 →</a></div><div className="quiz-box" id="quiz-box" aria-live="polite">
    {finished ? <div className="quiz-result"><p className="eyebrow">一段旅程，一次回望</p><div className="result-number">{score}<span> / 5</span></div><h2 id="quiz-result-title" tabIndex="-1" ref={title}>{score === 5 ? '五境新知，已收入行囊。' : '带着问题，再读一次陇原。'}</h2><p>你已完成全部五道题。{score === 5 ? '愿这些知识，成为下一次探索的起点。' : '以下主题值得再回顾。'}</p>{missed.length > 0 && <div className="quiz-review">{missed.map(item => <a className="text-link" href={`${item.chapter}.html`} key={item.chapter}>回顾{names[item.chapter]} →</a>)}</div>}<button className="primary" id="restart-quiz" onClick={() => { setAnswers([]); setIndex(0); }}>再挑战一次 <span aria-hidden="true">↻</span></button></div> : <>
      <div className="quiz-top"><span>0{index + 1} / 05 · {names[question.chapter]}</span><div className="quiz-track" aria-label={`第 ${index + 1} 题，共 5 题`}>{questions.map((_, n) => <i key={n} className={n < index ? 'done' : n === index ? 'current' : ''} />)}</div></div>
      <h2 id="quiz-question" tabIndex="-1" ref={title}>{question.q}</h2><div className="quiz-options" role="group" aria-labelledby="quiz-question">{question.options.map((option, n) => <button key={`${index}-${n}`} className={'quiz-option' + (answered && n === question.correct ? ' correct' : answered && n === answer ? ' wrong' : '')} data-answer={n} disabled={answered} onClick={() => choose(n)}><span>{letters[n]}</span>{option}</button>)}</div>
      <p className={'quiz-feedback' + (answered && answer !== question.correct ? ' wrong-text' : '')} id="quiz-feedback">{answered ? (answer === question.correct ? '✓ 答对了。' : `正确答案：${letters[question.correct]}。`) + question.explain : '选择一个答案，看看你的理解。'}</p>
      <div className="quiz-footer"><span>在思考中，把知识变成自己的收获</span><button className="primary" id="quiz-next" ref={next} disabled={!answered} onClick={() => { if (answered) setIndex(index + 1); }}>{index === 4 ? '查看结果' : '下一题'} <span aria-hidden="true">→</span></button></div>
    </>}
  </div></div></section></>;
}
