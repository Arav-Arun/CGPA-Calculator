/**
 * Grading engine — pure functions, no DOM, no React.
 *
 * A "marks entry" is a flat object of strings keyed by field name, plus the
 * optional `highest` override and `elective` choice, e.g.
 *   { ia: "18", mse: "25", ese: "42", highest: "", elective: "" }
 */

/**
 * Percentage → grade point on the 10-point KJSCE / Somaiya scale.
 *   80%+ → 10   70+ → 9   60+ → 8   55+ → 7
 *   50+ → 6     45+ → 5   40+ → 4   below 40 → 0 (Fail)
 */
export function getGradePoint(percentage) {
  if (percentage >= 80) return 10;
  if (percentage >= 70) return 9;
  if (percentage >= 60) return 8;
  if (percentage >= 55) return 7;
  if (percentage >= 50) return 6;
  if (percentage >= 45) return 5;
  if (percentage >= 40) return 4;
  return 0;
}

/** Resolve the denominator: the override if valid, else the subject default. */
function resolveHighest(subject, entry) {
  const override = parseFloat(entry.highest);
  return isNaN(override) || override === 0 ? subject.defaultHighest : override;
}

/** The label to show for a subject (elective choice wins if one is picked). */
export function subjectLabel(subject, entry = {}) {
  if (subject.hasOptions && entry.elective) {
    const opt = subject.options.find((o) => o.value === entry.elective);
    if (opt) return opt.label;
  }
  return subject.name;
}

/**
 * Grade a single subject from its marks entry.
 * @returns {{valid: true, total, highest, percentage, gradePoint} | {valid: false, error: string}}
 */
export function calcSubject(subject, entry = {}) {
  let total = 0;

  for (const field of subject.fields) {
    const value = parseFloat(entry[field.name]);
    if (isNaN(value) || value < 0 || value > field.max) {
      return { valid: false, error: "Fill all fields correctly !" };
    }
    total += value;
  }

  const highest = resolveHighest(subject, entry);
  if (highest > subject.defaultHighest) {
    return {
      valid: false,
      error: `Highest marks cannot exceed ${subject.defaultHighest} !`,
    };
  }

  const percentage = (total / highest) * 100;
  return { valid: true, total, highest, percentage, gradePoint: getGradePoint(percentage) };
}

/**
 * Marks needed in the ESE to secure a 9 or 10 pointer.
 * Returns null when there is no ESE field, the ESE is already filled, or the
 * student hasn't entered any other marks yet.
 */
export function predictEse(subject, entry = {}) {
  const eseField = subject.fields.find((f) => f.name === "ese");
  if (!eseField || (entry.ese ?? "") !== "") return null;

  let currentTotal = 0;
  let anyFilled = false;
  for (const field of subject.fields) {
    if (field.name === "ese") continue;
    const value = parseFloat(entry[field.name]);
    if ((entry[field.name] ?? "") !== "" && !isNaN(value)) {
      currentTotal += value;
      anyFilled = true;
    }
  }
  if (!anyFilled) return null;

  const highest = resolveHighest(subject, entry);
  const part = (targetRatio, pointer) => {
    const need = Math.ceil(targetRatio * highest - currentTotal);
    if (need > eseField.max) return { kind: "fail", pointer };
    if (need <= 0) return { kind: "secured", pointer };
    return { kind: "need", need, max: eseField.max, pointer };
  };

  return { p10: part(0.8, 10), p9: part(0.7, 9) };
}

/**
 * A "report" is the shape <ResultBreakdown> renders: a headline value, a table,
 * and a summary row. Both SGPA and CGPA produce one.
 */
function report(label, value, title, columns, rows, summary) {
  return { label, value: value.toFixed(2), title, columns, rows, summary };
}

/**
 * Overall SGPA for the given subjects. Every subject must grade cleanly.
 * @returns {{ok: true, value: number, report} | {ok: false, error: string}}
 */
export function calcSgpa(subjects, marks, semester) {
  let totalCreditPoints = 0;
  let totalCredits = 0;
  const rows = [];

  for (const subject of subjects) {
    const result = calcSubject(subject, marks[subject.id]);
    if (!result.valid) {
      return { ok: false, error: "Please fill all subject details correctly first!" };
    }
    const creditPoints = result.gradePoint * subject.credits;
    totalCreditPoints += creditPoints;
    totalCredits += subject.credits;
    rows.push([
      subjectLabel(subject, marks[subject.id]),
      result.gradePoint,
      subject.credits,
      creditPoints.toFixed(2),
    ]);
  }

  if (totalCredits === 0) {
    return { ok: false, error: "Please fill all subject details correctly first!" };
  }

  const sgpa = totalCreditPoints / totalCredits;
  return {
    ok: true,
    value: sgpa,
    report: report(
      `Semester ${semester} SGPA:`,
      sgpa,
      "Subject Breakdown:",
      ["Subject", "Grade Point", "Credits", "Credit Points"],
      rows,
      [
        ["Total Credit Points", totalCreditPoints.toFixed(2)],
        ["Total Credits", totalCredits],
        ["SGPA", sgpa.toFixed(2)],
      ],
    ),
  };
}

/**
 * Overall CGPA from up to 8 semesters. Blank/invalid rows are skipped.
 * @param {{sgpa: string, credits: string}[]} semesters - index 0 = Semester 1
 * @returns {{ok: true, value: number, report} | {ok: false, error: string}}
 */
export function calcCgpa(semesters) {
  let totalCreditPoints = 0;
  let totalCredits = 0;
  const rows = [];

  semesters.forEach((row, i) => {
    const sgpa = parseFloat(row.sgpa);
    const credits = parseFloat(row.credits);
    if (isNaN(sgpa) || isNaN(credits) || credits <= 0) return;

    const creditPoints = sgpa * credits;
    totalCreditPoints += creditPoints;
    totalCredits += credits;
    rows.push([`Semester ${i + 1}`, sgpa.toFixed(2), credits, creditPoints.toFixed(2)]);
  });

  if (rows.length === 0) {
    return { ok: false, error: "Please enter at least one semester's data" };
  }

  const cgpa = totalCreditPoints / totalCredits;
  return {
    ok: true,
    value: cgpa,
    report: report(
      "Overall CGPA:",
      cgpa,
      "Semester Breakdown:",
      ["Semester", "SGPA", "Credits", "Credit Points"],
      rows,
      [
        ["Total Credit Points", totalCreditPoints.toFixed(2)],
        ["Total Credits", totalCredits],
        ["Semesters Included", rows.length],
        ["CGPA", cgpa.toFixed(2)],
      ],
    ),
  };
}
