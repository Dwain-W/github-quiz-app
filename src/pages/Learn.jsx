import { Link } from "react-router-dom";
import lessons from "../data/lessons.json";
import "../styles/learn.css";

export default function Learn() {
  const firstFive = lessons.slice(0, 5);
  const remaining = lessons.slice(5);

  return (
    <section className="stack">
      <div className="learn-header">
        <h1>Learn</h1>
        <Link to="/test/first-five" className="btn">Test first 5</Link>
      </div>

      <h2 className="section-title">First 5 lessons</h2>
      <div className="lesson-grid">
        {firstFive.map((l, i) => (
          <Link key={i} to={`/learn/${i+1}/stage/1`} className="lesson-card">
            <div className="lesson-index">#{i+1}</div>
            <div className="lesson-title">{l.title}</div>
            <div className="lesson-meta">{(l.stages?.length || 0)} stage(s)</div>
          </Link>
        ))}
      </div>

      {remaining.length > 0 && (
        <>
          <h2 className="section-title">More lessons</h2>
          <div className="lesson-grid">
            {remaining.map((l, i) => (
                <Link key={i+5} to={`/learn/${i+6}/stage/1`} className="lesson-card">
                <div className="lesson-index">#{i+6}</div>
                <div className="lesson-title">{l.title}</div>
                <div className="lesson-meta">{(l.stages?.length || 0)} stage(s)</div>
              </Link>
            ))}
          </div>
        </>
      )}
    </section>
  );
}
