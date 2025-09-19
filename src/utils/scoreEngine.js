// Lightweight XP rules + math helpers

export function todayISO(d = new Date()) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate()).toISOString().slice(0,10);
}

export function daysBetweenISO(aISO, bISO) {
  const a = new Date(aISO + "T00:00:00");
  const b = new Date(bISO + "T00:00:00");
  return Math.round((b - a) / 86400000);
}

// XP formula:
// - base 10 for a correct answer; 1 XP for an attempt that's wrong (keep users moving)
// - difficulty bonus: +5 * difficulty (difficulty defaults to 1)
// - speed bonus: [<=4s: +5] [<=8s: +3] [<=15s: +1] [>15s: 0]
// - streak multiplier: 1 + min(streak*0.10, 0.50)
export function computeXP({ correct, difficulty = 1, timeMs = 0, streak = 0 }) {
  const base = correct ? 10 : 1;
  const diffBonus = correct ? 5 * Math.max(1, Number(difficulty) || 1) : 0;

  let speedBonus = 0;
  if (correct) {
    if (timeMs <= 4000) speedBonus = 5;
    else if (timeMs <= 8000) speedBonus = 3;
    else if (timeMs <= 15000) speedBonus = 1;
  }

  const streakMult = 1 + Math.min(0.10 * Math.max(0, streak), 0.50);
  const raw = (base + diffBonus + speedBonus) * streakMult;
  const xp = Math.round(raw);

  return {
    xp,
    parts: { base, diffBonus, speedBonus, streakMult },
  };
}

// Leveling: simple growing thresholds (Level 1->2 at 100 XP, +50 per level)
export function xpToNext(level) {
  if (level <= 1) return 100;
  return 100 + (level - 1) * 50;
}

export function computeLevel(totalXP) {
  let level = 1;
  let carried = totalXP;
  // consume thresholds until can't
  for (;;) {
    const need = xpToNext(level);
    if (carried >= need) {
      carried -= need;
      level += 1;
    } else {
      return { level, intoLevelXP: carried, toNext: need };
    }
  }
}
