import lessons from "../data/lessons.json";
import MultipleChoice from "../components/quiz/MultipleChoice";
import "../styles/quiz.css";

export default function Learn() {
  const lesson = lessons[0]; // pick first lesson for now
  const mcStage = lesson.stages.find(s => s.type === "multiple");

  return (
    <section className="stack">
      <h1>{lesson.title}</h1>
      <p className="muted">{lesson.intro}</p>

      <h3 className="stage-title">{mcStage.label}</h3>
      <MultipleChoice
        questions={mcStage.questions}
        onComplete={({ score, total }) => {
          alert(`Great job! You scored ${score}/${total}.`);
        }}
      />
    </section>
  );
}
