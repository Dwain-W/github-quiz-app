import { useMemo, useRef, useState, useEffect } from "react";
import { useScore } from "../../state/ScoreContext";

function ProgressBar({ value, max }) {
  const pct = Math.round((value / max) * 100);
  return (
    <div className="quiz-progress" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
      <div className="quiz-progress__bar" style={{ width: `${pct}%` }} />
      <span className="quiz-progress__label">{pct}%</span>
    </div>
  );
}

export default function MultipleChoice({ questions = [], onComplete, lessonId = "lesson-0" }) {
  const total = questions.length;
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [score, setScore] = useState(0);

  const startRef = useRef(Date.now());
  const { actions } = useScore();

  useEffect(() => {
    // reset timer on question change
    startRef.current = Date.now();
  }, [index]);

  const q = questions[index];
  const answerIndex = useMemo(() => q ? q.options.findIndex(o => o === q.answer) : -1, [q]);

  if (!q) return <div className="quiz-card">No questions found.</div>;

  const isCorrect = submitted && selected === answerIndex;

  const handleSubmit = () => {
    if (selected == null && !submitted) return;

    if (!submitted) {
      // First submit => judge + award XP
      setSubmitted(true);
      const correct = selected === answerIndex;
      if (correct) setScore(s => s + 1);

      const timeMs = Date.now() - startRef.current;
      const difficulty = Number(q.difficulty || 1);
      actions.award({ correct, difficulty, timeMs, lessonId });
    } else {
      // Go next or finish
      const next = index + 1;
      if (next < total) {
        setIndex(next);
        setSelected(null);
        setSubmitted(false);
        setShowHint(false);
      } else {
        actions.completeQuiz();
        if (onComplete) onComplete({ score, total });
      }
    }
  };

  const primaryCta = submitted ? (index + 1 < total ? "Next" : "Finish") : "Check";
  const canSubmit = selected != null;

  return (
    <div className="quiz-card">
      <header className="quiz-card__header">
        <div className="quiz-pill">Question {index + 1} / {total}</div>
        <ProgressBar value={index} max={total - 1} />
      </header>

      <h2 className="quiz-question">{q.text}</h2>

      <form className="quiz-options" onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} aria-label="Answer choices">
        {q.options.map((opt, i) => {
          const isSelected = selected === i;
          const isAnswer = i === answerIndex;

          const stateClass =
            submitted
              ? (isAnswer ? "correct" : (isSelected ? "wrong" : ""))
              : (isSelected ? "selected" : "");

          return (
            <label key={i} className={`quiz-option ${stateClass}`}>
              <input
                type="radio"
                name={`q-${index}`}
                value={opt}
                checked={isSelected}
                onChange={() => setSelected(i)}
                disabled={submitted}
              />
              <span className="quiz-option__marker" aria-hidden="true" />
              <span className="quiz-option__text">{opt}</span>
            </label>
          );
        })}
      </form>

      <div className="quiz-actions">
        <button type="button" className="btn text" onClick={() => setShowHint(h => !h)}>
          {showHint ? "Hide hint" : "Show hint"}
        </button>
        <button
          type="button"
          className="btn primary"
          onClick={handleSubmit}
          disabled={!canSubmit && !submitted}
        >
          {primaryCta}
        </button>
      </div>

      {showHint && !submitted && q.hint && (
        <div className="quiz-hint" role="note">
          <strong>Hint:</strong> {q.hint}
        </div>
      )}

      {submitted && (
        <div className={`quiz-feedback ${isCorrect ? "ok" : "nope"}`} role="region" aria-live="polite">
          <div className="quiz-feedback__title">
            {isCorrect ? "Correct ✅" : "Not quite ❌"}
          </div>
          {q.explanation && <p className="quiz-feedback__body">{q.explanation}</p>}
          <div className="quiz-score">Score in this set: {score} / {total}</div>
        </div>
      )}
    </div>
  );
}
