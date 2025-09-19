export function validateLessons(lessons) {
  // Returns per-lesson array of checks: { hasStages, mcCount, qCount, missingAnswers, badOptions, dupOptions, emptyTexts }
  return lessons.map(lesson => {
    const stages = Array.isArray(lesson?.stages) ? lesson.stages : [];
    const mcStages = stages.filter(s => s?.type === "multiple" || s?.type === "multiple_choice");

    let qCount = 0;
    let missingAnswers = 0;
    let badOptions = 0;
    let dupOptions = 0;
    let emptyTexts = 0;

    mcStages.forEach(stage => {
      const qs = Array.isArray(stage.questions) ? stage.questions : [];
      qCount += qs.length;

      qs.forEach(q => {
        const text = (q.text || "").trim();
        if (!text) emptyTexts += 1;

        const opts = Array.isArray(q.options) ? q.options : [];
        if (opts.length < 2) badOptions += 1;

        const set = new Set(opts);
        if (set.size !== opts.length) dupOptions += 1;

        if (!opts.includes(q.answer)) missingAnswers += 1;
      });
    });

    return {
      hasStages: stages.length > 0,
      mcCount: mcStages.length,
      qCount,
      missingAnswers,
      badOptions,
      dupOptions,
      emptyTexts,
    };
  });
}

export function summarizeIssues(r) {
  const issues = [];
  if (!r.hasStages) issues.push("No stages");
  if (r.mcCount === 0) issues.push("No multiple-choice stage");
  if (r.qCount === 0) issues.push("No questions found");
  if (r.missingAnswers > 0) issues.push(`${r.missingAnswers} question(s) where answer not in options`);
  if (r.badOptions > 0) issues.push(`${r.badOptions} question(s) with < 2 options`);
  if (r.dupOptions > 0) issues.push(`${r.dupOptions} question(s) with duplicate options`);
  if (r.emptyTexts > 0) issues.push(`${r.emptyTexts} question(s) with empty text`);
  return issues;
}
