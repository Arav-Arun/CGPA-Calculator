/**
 * Grading engine — pure functions, no DOM, no React.
 *
 * A "marks entry" is a flat map of strings keyed by field name, plus the
 * optional `highest` override and `elective` choice:
 *   { ia: "18", mse: "25", ese: "42", highest: "", elective: "" }
 *
 * calcSgpa / calcCgpa return a `report` — the exact shape <Output> renders.
 */

/** Percentage → grade point on the 10-point KJSCE / Somaiya scale. */
export function getGradePoint(pct) {
  if (pct >= 80) return 10;
  if (pct >= 70) return 9;
  if (pct >= 60) return 8;
  if (pct >= 55) return 7;
  if (pct >= 50) return 6;
  if (pct >= 45) return 5;
  if (pct >= 40) return 4;
  return 0;
}

/** The denominator: the override if valid, else the subject default. */
const highestOf = (subject, entry) => {
  const override = parseFloat(entry.highest);
  return isNaN(override) || override === 0 ? subject.defaultHighest : override;
};

/** Display name for a subject — the picked elective wins if there is one. */
export const subjectLabel = (subject, entry = {}) =>
  (subject.hasOptions && subject.options.find((o) => o.value === entry.elective)?.label) ||
  subject.name;

/**
 * Grade one subject.
 * @returns {{valid:true, total, highest, percentage, gradePoint} | {valid:false, error}}
 */
export function calcSubject(subject, entry = {}) {
  let total = 0;
  for (const { name, max } of subject.fields) {
    const value = parseFloat(entry[name]);
    if (isNaN(value) || value < 0 || value > max) {
      return { valid: false, error: "Fill all fields correctly !" };
    }
    total += value;
  }

  const highest = highestOf(subject, entry);
  if (highest > subject.defaultHighest) {
    return { valid: false, error: `Highest marks cannot exceed ${subject.defaultHighest} !` };
  }

  const percentage = (total / highest) * 100;
  return { valid: true, total, highest, percentage, gradePoint: getGradePoint(percentage) };
}

/**
 * Marks needed in the ESE for a 9 or 10 pointer, or null when not applicable
 * (no ESE field, ESE already entered, or nothing else filled in yet).
 */
export function predictEse(subject, entry = {}) {
  const ese = subject.fields.find((f) => f.name === "ese");
  if (!ese || (entry.ese ?? "") !== "") return null;

  let current = 0;
  let anyFilled = false;
  for (const { name } of subject.fields) {
    if (name === "ese" || (entry[name] ?? "") === "") continue;
    const value = parseFloat(entry[name]);
    if (!isNaN(value)) (current += value), (anyFilled = true);
  }
  if (!anyFilled) return null;

  const highest = highestOf(subject, entry);
  const part = (ratio, pointer) => {
    const need = Math.ceil(ratio * highest - current);
    if (need > ese.max) return { kind: "fail", pointer };
    if (need <= 0) return { kind: "secured", pointer };
    return { kind: "need", need, max: ese.max, pointer };
  };
  return { p10: part(0.8, 10), p9: part(0.7, 9) };
}

const report = (label, value, title, columns, rows, summary) => ({
  label,
  value: value.toFixed(2),
  title,
  columns,
  rows,
  summary,
});

/** Overall SGPA — every subject must grade cleanly. */
export function calcSgpa(subjects, marks, semester) {
  let points = 0;
  let credits = 0;
  const rows = [];

  for (const subject of subjects) {
    const r = calcSubject(subject, marks[subject.id]);
    if (!r.valid) return { ok: false, error: "Please fill all subject details correctly first!" };
    const cp = r.gradePoint * subject.credits;
    points += cp;
    credits += subject.credits;
    rows.push([subjectLabel(subject, marks[subject.id]), r.gradePoint, subject.credits, cp.toFixed(2)]);
  }
  if (credits === 0) return { ok: false, error: "Please fill all subject details correctly first!" };

  const sgpa = points / credits;
  return {
    ok: true,
    value: sgpa,
    report: report(`Semester ${semester} SGPA:`, sgpa, "Subject Breakdown:",
      ["Subject", "Grade Point", "Credits", "Credit Points"], rows,
      [["Total Credit Points", points.toFixed(2)], ["Total Credits", credits], ["SGPA", sgpa.toFixed(2)]]),
  };
}

/**
 * Overall CGPA from up to 8 semesters; blank/invalid rows are skipped.
 * @param {{sgpa:string, credits:string}[]} semesters - index 0 = Semester 1
 */
export function calcCgpa(semesters) {
  let points = 0;
  let credits = 0;
  const rows = [];

  semesters.forEach((row, i) => {
    const sgpa = parseFloat(row.sgpa);
    const cr = parseFloat(row.credits);
    if (isNaN(sgpa) || isNaN(cr) || cr <= 0) return;
    points += sgpa * cr;
    credits += cr;
    rows.push([`Semester ${i + 1}`, sgpa.toFixed(2), cr, (sgpa * cr).toFixed(2)]);
  });
  if (rows.length === 0) return { ok: false, error: "Please enter at least one semester's data" };

  const cgpa = points / credits;
  return {
    ok: true,
    value: cgpa,
    report: report("Overall CGPA:", cgpa, "Semester Breakdown:",
      ["Semester", "SGPA", "Credits", "Credit Points"], rows,
      [["Total Credit Points", points.toFixed(2)], ["Total Credits", credits],
       ["Semesters Included", rows.length], ["CGPA", cgpa.toFixed(2)]]),
  };
}
