import { useScore } from "../state/ScoreContext";

export default function Profile() {
  const { state, accuracy, levelInfo } = useScore();

  return (
    <section className="stack">
      <h1>Your Profile</h1>
      <p>XP: <strong>{state.totalXP}</strong></p>
      <p>Level: <strong>{levelInfo.level}</strong> (to next: {levelInfo.toNext - levelInfo.intoLevelXP} XP)</p>
      <p>Answered: <strong>{state.answered}</strong> • Correct: <strong>{state.correct}</strong> • Accuracy: <strong>{accuracy}%</strong></p>
      <p>Quizzes Completed: <strong>{state.quizzesCompleted}</strong></p>
      <p>Daily Streak: <strong>{state.streakDays}</strong> day(s)</p>
    </section>
  );
}
