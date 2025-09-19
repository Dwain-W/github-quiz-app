import { Link, useParams, useNavigate } from "react-router-dom";
import lessons from "../data/lessons.json";
import StageRunner from "../components/quiz/StageRunner";
import StageNav from "../components/quiz/StageNav"; // new
import "../styles/learn.css";

export default function LessonPlayer() {
  const { lessonId, stageIndex } = useParams();   // both 1-based
  const navigate = useNavigate();

  const lIdx = Math.max(1, parseInt(lessonId || "1", 10)) - 1;
  const sIdx = Math.max(1, parseInt(stageIndex || "1", 10)) - 1;

  const lesson = lessons[lIdx];
  if (!lesson) {
    return (
      <section className="stack">
        <h1>Lesson not found</h1>
        <p>We only have {lessons.length} lessons.</p>
        <Link className="btn primary" to="/learn">Back to Learn</Link>
      </section>
    );
  }

  const stages = Array.isArray(lesson.stages) ? lesson.stages : [];
  const stage = stages[sIdx];
  if (!stage) {
    return (
      <section className="stack">
        <h1>Stage not found</h1>
        <p>This lesson has {stages.length} stage(s).</p>
        <Link className="btn" to={`/learn/${lIdx + 1}/stage/1`}>Go to Stage 1</Link>
      </section>
    );
  }

  const goPrev = () => sIdx > 0 && navigate(`/learn/${lIdx + 1}/stage/${sIdx}`);
  const goNext = () => sIdx + 1 < stages.length && navigate(`/learn/${lIdx + 1}/stage/${sIdx + 2}`);

  return (
    <section className="stack">
      <div className="crumbs">
        <Link to="/learn">← Back to Learn</Link>
      </div>

      <h1>{lesson.title}</h1>
      {lesson.intro && <p className="muted">{lesson.intro}</p>}

      <StageNav
        stages={stages}
        currentIndex={sIdx}
        onSelect={(i) => navigate(`/learn/${lIdx + 1}/stage/${i + 1}`)}
      />

      <div className="stage-header">
        <button className="btn" onClick={goPrev} disabled={sIdx === 0}>Prev</button>
        <div className="stage-title">{stage.label || `Stage ${sIdx + 1}`}</div>
        <button className="btn" onClick={goNext} disabled={sIdx + 1 >= stages.length}>Next</button>
      </div>

      {/* Render ONLY the current stage */}
      <div className="stage-block">
        <StageRunner stage={stage} lessonId={`lesson-${lIdx + 1}`} />
      </div>
    </section>
  );
}
