/**
 * Main Application Logic
 *
 * This is the entry point. It ties together all modules:
 *  - state.js        → holds global app state
 *  - data-config.js  → subject data
 *  - ui.js           → screen switching and rendering
 *  - profiles.js     → multi-profile management
 *  - persistence.js  → save/load logic
 *  - calculator.js   → calculation engine
 *  - utils.js        → helper functions
 */

import {
  getState,
  setState,
  setSelectedBatch,
  setSelectedBranch,
  setSelectedSemester,
  setCurrentSubjects,
} from "./state.js";

import { getSubjects } from "./data-config.js";

import {
  switchScreen,
  showError,
  createSubjectCards,
  openFormulaModal,
  closeFormulaModal,
  closeModalOnClickOutside,
} from "./ui.js";

import { debounce, branchNames } from "./utils.js";

import {
  calculateSubject,
  updatePrediction,
  triggerConfetti,
} from "./calculator.js";

import {
  initProfiles,
  getActiveProfileData,
  switchProfileLogic,
  renderProfileMenu,
} from "./profiles.js";

import {
  saveState,
  loadState,
  restoreMarksForCurrentSelection,
} from "./persistence.js";

// ── Expose functions to `window` for HTML handlers ──
window.openFormulaModal = openFormulaModal;
window.closeFormulaModal = closeFormulaModal;
window.closeModalOnClickOutside = closeModalOnClickOutside;
window.calculateSubject = calculateSubject;
window.updatePrediction = updatePrediction;
window.proceedToCalculator = proceedToCalculator;
window.proceedToCGPACalculator = proceedToCGPACalculator;
window.changeSelection = changeSelection;
window.calculateOverallSGPA = calculateOverallSGPA;
window.calculateCGPA = calculateCGPA;
window.backToSGPACalculator = backToSGPACalculator;
window.switchProfile = switchProfile;
window.toggleProfileMenu = toggleProfileMenu;

// ══════════════════════════════════════════════════════════════
//  MAIN FLOW — Screen navigation and user actions
// ══════════════════════════════════════════════════════════════

function proceedToCalculator() {
  const batchId = document.getElementById("batchSelect").value;
  const branchId = document.getElementById("branchSelect").value;
  const semesterId = parseInt(document.getElementById("semesterSelect").value);

  if (!batchId) return showError("Please select a batch");
  if (!branchId) return showError("Please select a branch");
  if (!semesterId || isNaN(semesterId)) return showError("Please select a semester");

  const subjects = getSubjects(branchId, semesterId, batchId);
  if (!subjects) return showError("Data for this combination is not available yet");

  setSelectedBatch(batchId);
  setSelectedBranch(branchId);
  setSelectedSemester(semesterId);
  setCurrentSubjects(subjects);

  switchScreen("calculatorScreen", () => {
    document.getElementById("app-container").classList.remove("main-card");
    document.body.classList.remove("body-centered");
  });

  document.getElementById("breadcrumbText").textContent = 
    `Batch ${batchId} | ${branchNames[branchId]} | Semester ${semesterId}`;

  createSubjectCards(subjects);
  restoreMarksForCurrentSelection();
  saveState();
  addAutoSaveListeners();
}

function proceedToCGPACalculator() {
  switchScreen("cgpaCalculatorScreen", () => {
    document.getElementById("app-container").classList.remove("main-card");
    document.body.classList.remove("body-centered");
  });
  document.getElementById("cgpaOutputSection").innerHTML =
    '<div class="placeholder-text"><h3>Your overall CGPA will appear here</h3></div>';
}

function backToSGPACalculator() {
  const batchId = document.getElementById("batchSelect").value;
  const branchId = document.getElementById("branchSelect").value;
  const semesterId = parseInt(document.getElementById("semesterSelect").value);

  if (!batchId || !branchId || isNaN(semesterId) || semesterId === 0) {
    changeSelection();
  } else {
    proceedToCalculator();
  }
}

function changeSelection() {
  setState({
    selectedBatch: null,
    selectedBranch: null,
    selectedSemester: null,
    currentSubjects: [],
    gradePoints: {},
  });

  // Clear UI
  document.getElementById("subjectsGrid").innerHTML = "";
  const placeholder = '<div class="placeholder-text"><h3>Your results will appear here</h3></div>';
  document.getElementById("outputSection").innerHTML = placeholder;
  document.getElementById("cgpaOutputSection").innerHTML = placeholder;

  for (let sem = 1; sem <= 8; sem++) {
    const s = document.getElementById("sgpa" + sem);
    const c = document.getElementById("credits" + sem);
    if (s) s.value = "";
    if (c) c.value = "";
  }

  document.getElementById("batchSelect").value = "";
  document.getElementById("branchSelect").value = "";
  document.getElementById("semesterSelect").value = "";

  switchScreen("selectionScreen", () => {
    document.getElementById("app-container").classList.add("main-card");
    document.body.classList.add("body-centered");
  });
}

// ══════════════════════════════════════════════════════════════
//  MULTI-PROFILE ACTIONS
// ══════════════════════════════════════════════════════════════

function switchProfile(profileId) {
  switchProfileLogic(profileId, () => {
    renderProfileDropdown();
    
    // Smart Reload: Jump to calculator if selection exists
    const data = getActiveProfileData();
    
    // Reset everything first
    changeSelection();
    loadState();

    if (data && data.batch && data.branch && data.semester) {
      proceedToCalculator();
    }
  });
}

function renderProfileDropdown() {
  renderProfileMenu(
    (id) => switchProfile(id),
    () => switchProfile("ADD_NEW")
  );
}

function toggleProfileMenu(forceState) {
  const menu = document.getElementById("profileMenu");
  if (!menu) return;
  if (typeof forceState === "boolean") {
    forceState ? menu.classList.add("show") : menu.classList.remove("show");
  } else {
    menu.classList.toggle("show");
  }
}

// Close profile menu on outside click
document.addEventListener("click", (e) => {
  const container = document.querySelector(".profile-dropdown-container");
  if (container && !container.contains(e.target)) {
    toggleProfileMenu(false);
  }
});

// ══════════════════════════════════════════════════════════════
//  CALCULATION WRAPPERS (Directly calling engine)
// ══════════════════════════════════════════════════════════════

// Simplified wrappers that handle UI results based on calculator.js logic
// These remain here as they are tightly coupled to the DOM result sections.

function calculateOverallSGPA() {
  const state = getState();
  if (state.currentSubjects.length === 0) return;

  let totalCreditPoints = 0;
  let totalCredits = 0;
  let allCalculated = true;

  state.currentSubjects.forEach((subject) => {
    const gp = state.gradePoints[subject.id];
    if (gp !== undefined && gp !== null) {
      totalCreditPoints += gp * subject.credits;
      totalCredits += subject.credits;
    } else {
      allCalculated = false;
    }
  });

  if (!allCalculated) {
    return showError("Please calculate all subjects first!");
  }

  const sgpa = totalCreditPoints / totalCredits;
  const resultDiv = document.getElementById("outputSection");

  let output = `<div class="sgpa-display">
    <div class="label">Semester ${state.selectedSemester} SGPA:</div>
    <div class="value">${sgpa.toFixed(2)}</div>
  </div>`;

  output += `<h4 class="breakdown-title">Subject Breakdown:</h4>
  <div class="table-responsive">
  <table class="breakdown-table">
  <thead><tr>
  <th>Subject</th><th>Grade Point</th><th>Credits</th><th>Credit Points</th>
  </tr></thead><tbody>`;

  state.currentSubjects.forEach((subject) => {
    let gp = state.gradePoints[subject.id] || 0;
    const cp = gp * subject.credits;
    let displayName = subject.name;

    if (subject.hasOptions) {
      const el = document.getElementById("s" + subject.id + "-elective");
      if (el && el.value) {
        const opt = subject.options.find((o) => o.value === el.value);
        if (opt) displayName = opt.label;
      }
    }

    output += `<tr>
      <td>${displayName}</td>
      <td>${gp}</td>
      <td>${subject.credits}</td>
      <td>${cp.toFixed(2)}</td>
    </tr>`;
  });

  output += `</tbody></table></div>`;
  output += `<div class="summary-box">
    <strong>Total Credit Points:</strong> ${totalCreditPoints.toFixed(2)} | 
    <strong>Total Credits:</strong> ${totalCredits} | 
    <strong>SGPA:</strong> ${sgpa.toFixed(2)}
  </div>`;

  resultDiv.innerHTML = output;
  resultDiv.scrollIntoView({ behavior: "smooth" });
  if (sgpa >= 9.0) triggerConfetti();
  saveState();
}

function calculateCGPA() {
  let totalCreditPoints = 0;
  let totalCredits = 0;
  let semestersEntered = 0;

  for (let s = 1; s <= 8; s++) {
    const sgpaEl = document.getElementById("sgpa" + s);
    const creditsEl = document.getElementById("credits" + s);

    if (sgpaEl && creditsEl && sgpaEl.value && creditsEl.value) {
      const sgpa = parseFloat(sgpaEl.value);
      const credits = parseFloat(creditsEl.value);

      if (!isNaN(sgpa) && !isNaN(credits) && credits > 0) {
        totalCreditPoints += sgpa * credits;
        totalCredits += credits;
        semestersEntered++;
      }
    }
  }

  if (semestersEntered === 0) {
    return showError("Please enter at least one semester's data");
  }

  const cgpa = totalCreditPoints / totalCredits;
  
  let output = `<div class="sgpa-display">
    <div class="label">Overall CGPA:</div>
    <div class="value">${cgpa.toFixed(2)}</div>
  </div>`;

  output += `<h4 class="breakdown-title">Semester Breakdown:</h4>
  <div class="table-responsive"><table class="breakdown-table">
  <thead><tr><th>Semester</th><th>SGPA</th><th>Credits</th><th>Credit Points</th></tr></thead><tbody>`;

  for (let s = 1; s <= 8; s++) {
    const sgpaEl = document.getElementById("sgpa" + s);
    const creditsEl = document.getElementById("credits" + s);
    if (!sgpaEl || !creditsEl) continue;

    const sgpaVal = parseFloat(sgpaEl.value);
    const credVal = parseFloat(creditsEl.value);
    if (!isNaN(sgpaVal) && !isNaN(credVal) && credVal > 0) {
      const cp = sgpaVal * credVal;
      output += `<tr><td>Semester ${s}</td><td>${sgpaVal.toFixed(2)}</td><td>${credVal}</td><td>${cp.toFixed(2)}</td></tr>`;
    }
  }

  output += `</tbody></table></div>`;
  output += `<div class="summary-box">
    <strong>Total Credit Points:</strong> ${totalCreditPoints.toFixed(2)} | 
    <strong>Total Credits:</strong> ${totalCredits} | 
    <strong>Semesters Included:</strong> ${semestersEntered} | 
    <strong>CGPA:</strong> ${cgpa.toFixed(2)}
  </div>`;

  document.getElementById("cgpaOutputSection").innerHTML = output;
  document.getElementById("cgpaOutputSection").scrollIntoView({ behavior: "smooth" });
  if (cgpa >= 9.0) triggerConfetti();
  saveState();
}

// ── Shared Logic: Auto-save ──

function addAutoSaveListeners() {
  const inputs = document.querySelectorAll("input, select");
  const debouncedSave = debounce(saveState, 500);
  inputs.forEach((input) => {
    input.addEventListener("input", debouncedSave);
    input.addEventListener("change", debouncedSave);
  });
}

// ══════════════════════════════════════════════════════════════
//  INITIALIZATION
// ══════════════════════════════════════════════════════════════

document.addEventListener("DOMContentLoaded", () => {
  initProfiles();
  renderProfileDropdown();
  loadState();
  addAutoSaveListeners();
});
