/**
 * Utility Functions
 *
 * Shared helpers used across multiple modules.
 */

/**
 * Debounce — delays calling `func` until `wait` ms have passed
 * since the last invocation. Useful for auto-saving on input.
 */
export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Convert a percentage score to a grade point on the 10-point scale.
 * Based on the KJSCE / Somaiya Vidyavihar University grading system.
 *
 *   80%+ → 10    70-79% → 9    60-69% → 8    55-59% → 7
 *   50-54% → 6   45-49% → 5    40-44% → 4    Below 40% → 0 (Fail)
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

/**
 * Human-readable branch names keyed by branch ID.
 * Used in breadcrumbs and print reports.
 */
export const branchNames = {
  aids: "Artificial Intelligence & Data Science",
  comp: "Computer Engineering",
  cce: "Computer & Communication Engineering",
  csbs: "Computer Science & Business Systems",
  ece: "Electronics & Computer Engineering",
  extc: "Electronics & Telecommunication Engineering",
  vlsi: "Electronics Engineering (VLSI Design & Technology)",
  it: "Information Technology",
  mech: "Mechanical Engineering",
  rai: "Robotics & Artificial Intelligence",
};
