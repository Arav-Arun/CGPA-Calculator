/**
 * Persistence Module
 * 
 * Handles saving and restoring the application state (marks, dropdowns, CGPA)
 * by interacting with the active profile.
 */

import { getState } from "./state.js";
import { updatePrediction } from "./calculator.js";
import { getActiveProfileData, saveActiveProfileData } from "./profiles.js";

/**
 * Captures all current UI inputs and saves them to the active profile.
 */
export function saveState() {
  const state = getState();
  const persistentData = {
    batch: state.selectedBatch,
    branch: state.selectedBranch,
    semester: state.selectedSemester,
    marks: {},
    cgpa: {},
  };

  // Save subject marks
  state.currentSubjects.forEach((subject) => {
    const marks = {};
    
    // Save elective selection if applicable
    if (subject.hasOptions) {
      const el = document.getElementById("s" + subject.id + "-elective");
      if (el) marks.elective = el.value;
    }

    // Save individual component marks
    subject.fields.forEach((field) => {
      const el = document.getElementById("s" + subject.id + "-" + field.name);
      if (el) marks[field.name] = el.value;
    });

    // Save highest total override
    const high = document.getElementById("s" + subject.id + "-highest");
    if (high) marks.highest = high.value;

    persistentData.marks[subject.id] = marks;
  });

  // Save overall CGPA calculator fields
  for (let s = 1; s <= 8; s++) {
    const sgpa = document.getElementById("sgpa" + s);
    const cred = document.getElementById("credits" + s);
    if (sgpa && cred) {
      persistentData.cgpa[s] = { sgpa: sgpa.value, credits: cred.value };
    }
  }

  saveActiveProfileData(persistentData);
}

/**
 * Restores selection dropdowns and CGPA values from the active profile.
 */
export function loadState() {
  const data = getActiveProfileData();
  if (!data) return;

  // Restore CGPA fields
  if (data.cgpa) {
    for (let s = 1; s <= 8; s++) {
      if (data.cgpa[s]) {
        const sgpa = document.getElementById("sgpa" + s);
        const cred = document.getElementById("credits" + s);
        if (sgpa && cred) {
          sgpa.value = data.cgpa[s].sgpa || "";
          cred.value = data.cgpa[s].credits || "";
        }
      }
    }
  }

  // Restore the main selection dropdowns
  if (data.batch && data.branch && data.semester) {
    const batchSelect = document.getElementById("batchSelect");
    const branchSelect = document.getElementById("branchSelect");
    const semesterSelect = document.getElementById("semesterSelect");

    if (batchSelect && branchSelect && semesterSelect) {
      batchSelect.value = data.batch;
      branchSelect.value = data.branch;
      semesterSelect.value = data.semester;
    }
  }
}

/**
 * Specifically restores the marks for subject cards once they are rendered.
 */
export function restoreMarksForCurrentSelection() {
  const data = getActiveProfileData();
  if (!data || !data.marks) return;

  const currentBatch = document.getElementById("batchSelect").value;
  const currentBranch = document.getElementById("branchSelect").value;
  const currentSemester = parseInt(document.getElementById("semesterSelect").value);

  // Only restore if the saved selection matches the current UI
  if (
    data.batch === currentBatch &&
    data.branch === currentBranch &&
    data.semester === currentSemester
  ) {
    Object.keys(data.marks).forEach((subId) => {
      const marks = data.marks[subId];
      if (!marks) return;

      if (marks.elective) {
        const el = document.getElementById("s" + subId + "-elective");
        if (el) el.value = marks.elective;
      }
      
      if (marks.highest) {
        const el = document.getElementById("s" + subId + "-highest");
        if (el) el.value = marks.highest;
      }

      Object.keys(marks).forEach((key) => {
        if (key !== "elective" && key !== "highest") {
          const el = document.getElementById("s" + subId + "-" + key);
          if (el) {
            el.value = marks[key];
            updatePrediction(parseInt(subId));
          }
        }
      });
    });
  }
}
