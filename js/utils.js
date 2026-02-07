/**
 * Utility functions for the application
 */

// Debounce utility to prevent excessive function calls
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

// Convert percentage to 10-point scale
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
