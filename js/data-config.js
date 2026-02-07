// Data Configuration - Subject Retrieval Logic
// Maps batch + branch + semester to the correct subject list.

import {
  semester1Subjects,
  semester2CommonSubjects,
  semester2Subject_ComputerAllied,
  semester2Subject_ElectronicsAllied,
  semester2Subjects_MechRAI,
} from "./data/batch-2025-2029.js";

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
} from "./data/batch-2024-2028.js";

// Get subjects for a branch, semester, and batch
export function getSubjects(branchId, semesterId, batchId) {
  // Batch 2025-2029
  if (batchId === "2025-2029") {
    if (semesterId === 1) {
      return semester1Subjects;
    }

    // Semester 2 - Branch-specific logic
    if (semesterId === 2) {
      // Group branches by curriculum type
      const computerAlliedBranches = ["aids", "comp", "cce", "csbs", "it"];
      const electronicsAlliedBranches = ["ece", "extc", "vlsi"];
      const mechRAIBranches = ["mech", "rai"];

      // Computer & Allied Programs
      if (computerAlliedBranches.includes(branchId)) {
        return [...semester2CommonSubjects, semester2Subject_ComputerAllied];
      }

      // Electronics & Allied Programs
      if (electronicsAlliedBranches.includes(branchId)) {
        return [...semester2CommonSubjects, semester2Subject_ElectronicsAllied];
      }

      // Mechanical & RAI Programs
      if (mechRAIBranches.includes(branchId)) {
        return [...semester2CommonSubjects, ...semester2Subjects_MechRAI];
      }

      // If branch not found in any group, return null
      return null;
    }
  }

  // Batch 2024-2028
  if (batchId === "2024-2028") {
    if (semesterId === 3) {
      if (branchId === "comp") {
        return semester3Subjects_COMP_2024;
      } else if (branchId === "rai") {
        return semester3Subjects_RAI_2024;
      } else if (branchId === "aids") {
        return semester3Subjects_AIDS_2024;
      } else if (branchId === "csbs") {
        return semester3Subjects_CSBS_2024;
      } else if (branchId === "it") {
        return semester3Subjects_IT_2024;
      } else {
        // Data not available for other branches yet
        return null;
      }
    }
    // Semester 4 for Computer Engineering and others
    if (semesterId === 4) {
      if (branchId === "comp") {
        return semester4Subjects_COMP_2024;
      } else if (branchId === "aids") {
        return semester4Subjects_AIDS_2024;
      } else if (branchId === "csbs") {
        return semester4Subjects_CSBS_2024;
      } else if (branchId === "it") {
        return semester4Subjects_IT_2024;
      } else {
        // Data not available for other branches yet
        return null;
      }
    }
  }

  // Data not available for other semesters/batches yet
  return null;
}
