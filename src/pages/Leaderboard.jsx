import { useScore } from "../state/ScoreContext";

export default function Leaderboard() {
  const { state } = useScore();

  // Placeholder local-only board with just "You" for now
  const data = [
    { rank: 1, name: "You", xp: state.totalXP },
  ];

  return (
    <section className="stack">
      <h1>Leaderboard</h1>
      <table style={{ borderCollapse: "collapse", width: "100%", maxWidth: 640 }}>
        <thead>
          <tr>
            <th style={{ textAlign: "left", padding: 8, borderBottom: "1px solid var(--border)" }}>#</th>
            <th style={{ textAlign: "left", padding: 8, borderBottom: "1px solid var(--border)" }}>User</th>
            <th style={{ textAlign: "right", padding: 8, borderBottom: "1px solid var(--border)" }}>XP</th>
          </tr>
        </thead>
        <tbody>
          {data.map(row => (
            <tr key={row.rank}>
              <td style={{ padding: 8 }}>{row.rank}</td>
              <td style={{ padding: 8 }}>{row.name}</td>
              <td style={{ padding: 8, textAlign: "right" }}>{row.xp}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
