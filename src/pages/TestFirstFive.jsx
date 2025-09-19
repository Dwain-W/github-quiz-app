import { Link } from "react-router-dom";
import lessons from "../data/lessons.json";
import { validateLessons, summarizeIssues } from "../utils/lessonUtils";
import "../styles/learn.css";

export default function TestFirstFive() {
  const subset = lessons.slice(0, 5);
  const results = validateLessons(subset);

  return (
    <section className="stack">
      <div className="learn-header">
        <h1>First 5 Lessons — Test</h1>
        <Link to="/learn" className="btn">Back to Learn</Link>
      </div>

      <div className="test-grid">
        {subset.map((lesson, i) => {
          const r = results[i];
          const issues = summarizeIssues(r);
          const ok = issues.length === 0;

          return (
            <div key={i} className={`test-card ${ok ? "ok" : "warn"}`}>
              <div className="lesson-index">#{i+1}</div>
              <h3 className="lesson-title">{lesson.title}</h3>
              <div className="lesson-meta">{(lesson.stages?.length || 0)} stage(s)</div>

              <ul className="issues">
                {ok ? <li className="ok-text">✓ No issues found</li> : issues.map((msg, k) => <li key={k}>• {msg}</li>)}
              </ul>

              <div className="test-actions">
                <Link to={`/learn/${i+1}`} className="btn primary">Play lesson #{i+1}</Link>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
