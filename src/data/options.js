/** Dropdown options for the selection screen. */

export const BATCHES = ["2025-2029", "2024-2028"];

export const SEMESTERS = [1, 2, 3, 4, 5, 6, 7];

/** `label` shows in the dropdown; `fullName` shows in the breadcrumb. */
export const BRANCHES = [
  { id: "comp", label: "Computer Engineering", fullName: "Computer Engineering" },
  { id: "it", label: "Information Technology", fullName: "Information Technology" },
  { id: "aids", label: "Artificial Intelligence & Data Science", fullName: "Artificial Intelligence & Data Science" },
  { id: "csbs", label: "Computer Science & Business Systems", fullName: "Computer Science & Business Systems" },
  { id: "cce", label: "Computer & Communication Engineering", fullName: "Computer & Communication Engineering" },
  { id: "ece", label: "Electronics & Computer Engineering", fullName: "Electronics & Computer Engineering" },
  { id: "extc", label: "Electronics & Telecommunication Engineering", fullName: "Electronics & Telecommunication Engineering" },
  { id: "vlsi", label: "VLSI Design & Technology", fullName: "Electronics Engineering (VLSI Design & Technology)" },
  { id: "rai", label: "Robotics & Artificial Intelligence", fullName: "Robotics & Artificial Intelligence" },
  { id: "mech", label: "Mechanical Engineering", fullName: "Mechanical Engineering" },
];

export const branchFullName = (id) =>
  BRANCHES.find((b) => b.id === id)?.fullName ?? id;
