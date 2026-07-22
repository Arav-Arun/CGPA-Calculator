/**
 * Persistence Module
 *
 * Saves and restores the application state (selection, subject marks and the
 * CGPA grid) in localStorage under a single key.
 */

import { getState } from "./state.js";
import { updatePrediction } from "./calculator.js";

const STORAGE_KEY = "cgpaCalcState";
const LEGACY_PROFILES_KEY = "cgpaProfiles";

// The shape of a saved blob
const emptyData = () => ({
  batch: null,
  branch: null,
  semester: null,
  marks: {},
  cgpa: {},
});

/**
 * Reads the saved blob from localStorage.
 *
 * Falls back to the older multi-profile format (cgpaProfiles) and migrates the
 * active profile across, so users of the previous version keep their data.
 * Never throws — corrupt storage just starts the user off empty.
 */
function readStoredData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...emptyData(), ...JSON.parse(raw) };

    const legacy = localStorage.getItem(LEGACY_PROFILES_KEY);
    if (legacy) {
      const parsed = JSON.parse(legacy);
      const active = parsed && parsed.profiles && parsed.profiles[parsed.activeProfileId];
      if (active && active.data) {
        const migrated = { ...emptyData(), ...active.data };
        writeStoredData(migrated);
        return migrated;
      }
    }
  } catch (error) {
    console.warn("Could not read saved data, starting fresh:", error);
  }

  return emptyData();
}

function writeStoredData(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.warn("Could not save data:", error);
  }
}

// ── Capture helpers ──

function collectMarks(subjects) {
  const marks = {};

  subjects.forEach((subject) => {
    const entry = {};

    // Elective selection, if this subject has options
    if (subject.hasOptions) {
      const el = document.getElementById("s" + subject.id + "-elective");
      if (el) entry.elective = el.value;
    }

    // Individual component marks
    subject.fields.forEach((field) => {
      const el = document.getElementById("s" + subject.id + "-" + field.name);
      if (el) entry[field.name] = el.value;
    });

    // Highest total override
    const high = document.getElementById("s" + subject.id + "-highest");
    if (high) entry.highest = high.value;

    marks[subject.id] = entry;
  });

  return marks;
}

function collectCGPA() {
  const cgpa = {};

  for (let s = 1; s <= 8; s++) {
    const sgpa = document.getElementById("sgpa" + s);
    const cred = document.getElementById("credits" + s);
    if (sgpa && cred) {
      cgpa[s] = { sgpa: sgpa.value, credits: cred.value };
    }
  }

  return cgpa;
}

/**
 * Captures the current UI inputs and merges them into what is already saved.
 *
 * The merge matters: auto-save fires from every screen, but the subject cards
 * only exist on the SGPA screen. Rebuilding the whole blob from scratch would
 * wipe the saved marks whenever the user typed anything anywhere else.
 */
export function saveState() {
  const state = getState();
  const data = readStoredData();

  // Selection and marks are only meaningful once subject cards are rendered.
  if (state.currentSubjects.length > 0) {
    data.batch = state.selectedBatch;
    data.branch = state.selectedBranch;
    data.semester = state.selectedSemester;
    data.marks = collectMarks(state.currentSubjects);
  }

  // The CGPA grid is always present in the DOM, so it is always safe to read.
  data.cgpa = collectCGPA();

  writeStoredData(data);
}

/**
 * Restores the selection dropdowns and the CGPA grid from storage.
 */
export function loadState() {
  const data = readStoredData();

  // Restore CGPA fields
  for (let s = 1; s <= 8; s++) {
    if (!data.cgpa[s]) continue;
    const sgpa = document.getElementById("sgpa" + s);
    const cred = document.getElementById("credits" + s);
    if (sgpa && cred) {
      sgpa.value = data.cgpa[s].sgpa || "";
      cred.value = data.cgpa[s].credits || "";
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
 * Restores the marks for the subject cards once they have been rendered.
 *
 * Subject IDs repeat across branches (COMP and IT both use 301-312 in
 * semester 3), so this only restores when the saved selection matches what is
 * currently on screen.
 */
export function restoreMarksForCurrentSelection() {
  const data = readStoredData();
  if (!data.marks) return;

  const currentBatch = document.getElementById("batchSelect").value;
  const currentBranch = document.getElementById("branchSelect").value;
  const currentSemester = parseInt(document.getElementById("semesterSelect").value);

  if (
    data.batch !== currentBatch ||
    data.branch !== currentBranch ||
    data.semester !== currentSemester
  ) {
    return;
  }

  Object.keys(data.marks).forEach((subId) => {
    const marks = data.marks[subId];
    if (!marks) return;

    if (marks.elective) {
      const el = document.getElementById("s" + subId + "-elective");
      if (el) el.value = marks.elective;
    }

    // Restore "highest" before the component marks so the predictions below
    // each ESE field are computed against the right denominator.
    if (marks.highest) {
      const el = document.getElementById("s" + subId + "-highest");
      if (el) el.value = marks.highest;
    }

    Object.keys(marks).forEach((key) => {
      if (key === "elective" || key === "highest") return;
      const el = document.getElementById("s" + subId + "-" + key);
      if (el) {
        el.value = marks[key];
        updatePrediction(parseInt(subId));
      }
    });
  });
}
