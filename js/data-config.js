/**
 * Data Configuration — Subject Retrieval Logic
 *
 * Maps a (batch, branch, semester) combination to the correct list of subjects.
 * Subject data itself lives in the /js/data/ folder, one file per batch.
 *
 * When adding a new batch or semester:
 *   1. Create a new data file in /js/data/ (e.g. batch-2026-2030.js)
 *   2. Import the subject arrays here
 *   3. Add matching cases inside getSubjects()
 */

// ── Batch 2025-2029 ──
import {
  semester1Subjects,
  semester2CommonSubjects,
  semester2Subject_ComputerAllied,
  semester2Subject_ElectronicsAllied,
  semester2Subjects_MechRAI,
} from "./data/batch-2025-2029.js";

// ── Batch 2024-2028 ──
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

/**
 * Returns the subject list for the given combination, or null if not available.
 *
 * @param {string} branchId   - e.g. "comp", "it", "aids"
 * @param {number} semesterId - 1 through 8
 * @param {string} batchId    - e.g. "2025-2029"
 * @returns {Array|null}
 */
export function getSubjects(branchId, semesterId, batchId) {
  // ── Batch 2025-2029 ──

  if (batchId === "2025-2029") {
    // Semester 1 — same for all branches
    if (semesterId === 1) {
      return semester1Subjects;
    }

    // Semester 2 — differs by branch group
    if (semesterId === 2) {
      const computerAlliedBranches = ["aids", "comp", "cce", "csbs", "it"];
      const electronicsAlliedBranches = ["ece", "extc", "vlsi"];
      const mechRAIBranches = ["mech", "rai"];

      if (computerAlliedBranches.includes(branchId)) {
        return [...semester2CommonSubjects, semester2Subject_ComputerAllied];
      }
      if (electronicsAlliedBranches.includes(branchId)) {
        return [...semester2CommonSubjects, semester2Subject_ElectronicsAllied];
      }
      if (mechRAIBranches.includes(branchId)) {
        return [...semester2CommonSubjects, ...semester2Subjects_MechRAI];
      }

      return null; // Branch not mapped yet
    }
  }

  // ── Batch 2024-2028 ──

  if (batchId === "2024-2028") {
    // Semester 3
    if (semesterId === 3) {
      if (branchId === "comp") return semester3Subjects_COMP_2024;
      if (branchId === "rai") return semester3Subjects_RAI_2024;
      if (branchId === "aids") return semester3Subjects_AIDS_2024;
      if (branchId === "csbs") return semester3Subjects_CSBS_2024;
      if (branchId === "it") return semester3Subjects_IT_2024;
      return null; // Other branches not available yet
    }

    // Semester 4
    if (semesterId === 4) {
      if (branchId === "comp") return semester4Subjects_COMP_2024;
      if (branchId === "aids") return semester4Subjects_AIDS_2024;
      if (branchId === "csbs") return semester4Subjects_CSBS_2024;
      if (branchId === "it") return semester4Subjects_IT_2024;
      return null; // Other branches not available yet
    }
  }

  // Data not available for this combination yet
  return null;
}
