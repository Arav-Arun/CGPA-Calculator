/**
 * The subject catalog: which subjects a (batch, branch, semester) maps to,
 * plus the dropdown options for the selection screen.
 *
 * Adding a batch/semester: drop a data file in this folder, import its arrays,
 * and add a matching entry to CATALOG.
 */

import {
  semester1Subjects,
  semester2CommonSubjects,
  semester2Subject_ComputerAllied,
  semester2Subject_ElectronicsAllied,
  semester2Subjects_MechRAI,
} from "./2025-2029.js";

import {
  semester3Subjects_COMP_2024,
  semester3Subjects_RAI_2024,
  semester3Subjects_AIDS_2024,
  semester3Subjects_CSBS_2024,
  semester3Subjects_IT_2024,
  semester4Subjects_COMP_2024,
  semester4Subjects_AIDS_2024,
  semester4Subjects_CSBS_2024,
  semester4Subjects_IT_2024,
} from "./2024-2028.js";

// ── Dropdown options ──

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

export const branchFullName = (id) => BRANCHES.find((b) => b.id === id)?.fullName ?? id;

// ── Catalog lookup ──

const COMPUTER_ALLIED = ["aids", "comp", "cce", "csbs", "it"];
const ELECTRONICS_ALLIED = ["ece", "extc", "vlsi"];
const MECH_RAI = ["mech", "rai"];

// { batch: { semester: (branchId) => subjects | null } }
const CATALOG = {
  "2025-2029": {
    1: () => semester1Subjects,
    2: (branch) => {
      if (COMPUTER_ALLIED.includes(branch)) return [...semester2CommonSubjects, semester2Subject_ComputerAllied];
      if (ELECTRONICS_ALLIED.includes(branch)) return [...semester2CommonSubjects, semester2Subject_ElectronicsAllied];
      if (MECH_RAI.includes(branch)) return [...semester2CommonSubjects, ...semester2Subjects_MechRAI];
      return null;
    },
  },
  "2024-2028": {
    3: (branch) =>
      ({ comp: semester3Subjects_COMP_2024, rai: semester3Subjects_RAI_2024, aids: semester3Subjects_AIDS_2024,
         csbs: semester3Subjects_CSBS_2024, it: semester3Subjects_IT_2024 })[branch] ?? null,
    4: (branch) =>
      ({ comp: semester4Subjects_COMP_2024, aids: semester4Subjects_AIDS_2024,
         csbs: semester4Subjects_CSBS_2024, it: semester4Subjects_IT_2024 })[branch] ?? null,
  },
};

/** @returns subject array, or null if that combination isn't available yet. */
export function getSubjects(branchId, semesterId, batchId) {
  return CATALOG[batchId]?.[semesterId]?.(branchId) ?? null;
}
