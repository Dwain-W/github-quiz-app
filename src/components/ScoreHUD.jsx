import { useScore } from "../state/ScoreContext";
import { FiZap } from "react-icons/fi";
import { FaFire } from "react-icons/fa";  // ⟵ new

export default function ScoreHUD() {
  const { levelInfo, state, accuracy, lastGain } = useScore();
  const pct = Math.round((levelInfo.intoLevelXP / levelInfo.toNext) * 100);

  return (
    <div className="scorehud">
      {lastGain && <div className="xp-float">+{lastGain.xp} XP</div>}

      <div className="level">
        <FiZap aria-hidden />
        <span>Lv {levelInfo.level}</span>
        <div className="bar" aria-label="XP progress" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
          <div className="fill" style={{ width: `${pct}%` }} />
        </div>
      </div>

      <div className="streak" title="Daily streak">
        <FaFire aria-hidden />   {/* ⟵ swapped */}
        <span>{state.streakDays}d</span>
      </div>

      <div className="acc" title="Accuracy">{accuracy}%</div>
    </div>
  );
}
