import MultipleChoice from "./MultipleChoice";

export default function StageRunner({ stage, lessonId }) {
  if (!stage) return null;

  switch (stage.type) {
    case "multiple":
    case "multiple_choice":
      return (
        <MultipleChoice
          questions={stage.questions || []}
          lessonId={lessonId}
          onComplete={({ score, total }) => {
            // You can toast here if you want
            // console.log(`Completed stage: ${score}/${total}`);
          }}
        />
      );

    // ready for future types:
    // case "true_false": ...
    // case "matching": ...
    default:
      return <div className="muted">Unsupported stage type: <code>{String(stage.type)}</code></div>;
  }
}
