export default function StageNav({ stages = [], currentIndex = 0, onSelect }) {
  if (!stages.length) return null;
  return (
    <div className="stage-nav" role="tablist" aria-label="Stages">
      {stages.map((s, i) => {
        const active = i === currentIndex;
        return (
          <button
            key={i}
            role="tab"
            aria-selected={active}
            className={`stage-chip ${active ? "active" : ""}`}
            onClick={() => onSelect(i)}
          >
            {s.label || `Stage ${i + 1}`}
          </button>
        );
      })}
    </div>
  );
}
