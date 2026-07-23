/**
 * Maps a (batch, branch, semester) selection to its subject list.
 *
 * Adding a batch/semester: add the data file under /src/data, import it here,
 * and add a matching case below.
 */

import {
  semester1Subjects,
  semester2CommonSubjects,
  semester2Subject_ComputerAllied,
  semester2Subject_ElectronicsAllied,
  semester2Subjects_MechRAI,
} from "./batch-2025-2029.js";

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
} from "./batch-2024-2028.js";

const COMPUTER_ALLIED = ["aids", "comp", "cce", "csbs", "it"];
const ELECTRONICS_ALLIED = ["ece", "extc", "vlsi"];
const MECH_RAI = ["mech", "rai"];

// { batch: { semester: (branchId) => subjects | null } }
const CATALOG = {
  "2025-2029": {
    1: () => semester1Subjects,
    2: (branch) => {
      if (COMPUTER_ALLIED.includes(branch))
        return [...semester2CommonSubjects, semester2Subject_ComputerAllied];
      if (ELECTRONICS_ALLIED.includes(branch))
        return [...semester2CommonSubjects, semester2Subject_ElectronicsAllied];
      if (MECH_RAI.includes(branch))
        return [...semester2CommonSubjects, ...semester2Subjects_MechRAI];
      return null;
    },
  },
  "2024-2028": {
    3: (branch) =>
      ({
        comp: semester3Subjects_COMP_2024,
        rai: semester3Subjects_RAI_2024,
        aids: semester3Subjects_AIDS_2024,
        csbs: semester3Subjects_CSBS_2024,
        it: semester3Subjects_IT_2024,
      })[branch] ?? null,
    4: (branch) =>
      ({
        comp: semester4Subjects_COMP_2024,
        aids: semester4Subjects_AIDS_2024,
        csbs: semester4Subjects_CSBS_2024,
        it: semester4Subjects_IT_2024,
      })[branch] ?? null,
  },
};

/** @returns subject array, or null if that combination isn't available yet. */
export function getSubjects(branchId, semesterId, batchId) {
  return CATALOG[batchId]?.[semesterId]?.(branchId) ?? null;
}
