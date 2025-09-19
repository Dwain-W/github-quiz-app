import { createContext, useContext, useMemo, useRef, useState, useEffect } from "react";
import { computeXP, computeLevel, todayISO, daysBetweenISO } from "../utils/scoreEngine";

const STORAGE_KEY = "gqa_progress_v1";
const ScoreCtx = createContext(null);

const initial = {
  totalXP: 0,
  answered: 0,
  correct: 0,
  quizzesCompleted: 0,
  lastActiveISO: null,  // "YYYY-MM-DD"
  streakDays: 0,        // consecutive active days
};

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return initial;
    const parsed = JSON.parse(raw);
    return { ...initial, ...parsed };
  } catch {
    return initial;
  }
}

function save(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function ScoreProvider({ children }) {
  const [state, setState] = useState(load());
  const [lastGain, setLastGain] = useState(null); // {xp, parts}

  // bump / reset daily streak based on today usage
  const ensureStreak = (draft = state) => {
    const today = todayISO();
    if (!draft.lastActiveISO) {
      draft.lastActiveISO = today;
      draft.streakDays = 1;
      return draft;
    }
    const gap = daysBetweenISO(draft.lastActiveISO, today);
    if (gap === 0) return draft;      // already active today
    if (gap === 1) draft.streakDays += 1;   // next day
    else draft.streakDays = 1;              // reset
    draft.lastActiveISO = today;
    return draft;
  };

  const award = ({ correct, difficulty = 1, timeMs = 0, lessonId = "lesson-unknown" }) => {
    setState(prev => {
      const draft = { ...prev };
      ensureStreak(draft);
      const { xp, parts } = computeXP({
        correct,
        difficulty,
        timeMs,
        streak: draft.streakDays,
      });
      draft.totalXP += xp;
      draft.answered += 1;
      if (correct) draft.correct += 1;
      save(draft);
      setLastGain({ xp, parts, correct, lessonId });
      return draft;
    });
  };

  const completeQuiz = () => {
    setState(prev => {
      const draft = { ...prev };
      ensureStreak(draft);
      draft.quizzesCompleted += 1;
      save(draft);
      return draft;
    });
  };

  const resetProgress = () => {
    setState(() => {
      save(initial);
      return initial;
    });
  };

  // auto-clear the transient lastGain after a short delay
  const clearTimer = useRef();
  useEffect(() => {
    if (!lastGain) return;
    clearTimer.current && clearTimeout(clearTimer.current);
    clearTimer.current = setTimeout(() => setLastGain(null), 2200);
    return () => clearTimer.current && clearTimeout(clearTimer.current);
  }, [lastGain]);

  const accuracy = state.answered ? Math.round((state.correct / state.answered) * 100) : 0;
  const levelInfo = computeLevel(state.totalXP);

  const value = useMemo(() => ({
    state,
    accuracy,
    levelInfo,  // { level, intoLevelXP, toNext }
    lastGain,
    actions: { award, completeQuiz, resetProgress },
  }), [state, accuracy, levelInfo, lastGain]);

  return <ScoreCtx.Provider value={value}>{children}</ScoreCtx.Provider>;
}

export function useScore() {
  const ctx = useContext(ScoreCtx);
  if (!ctx) throw new Error("useScore must be used within <ScoreProvider>");
  return ctx;
}
