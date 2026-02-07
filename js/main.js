/**
 * Main Application Logic
 *
 * This is the entry point. It ties together all modules:
 *  - state.js        → holds the global app state (selections, marks, grade points)
 *  - data-config.js  → maps batch + branch + semester to subject lists
 *  - ui.js           → screen switching, error messages, subject card rendering
 *  - calculator.js   → grade/SGPA calculation and confetti
 *  - print.js        → generating printable SGPA/CGPA reports
 *  - utils.js        → helper functions (debounce, grade point lookup, branch names)
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
import { printResult, printOverallResult } from "./print.js";

// ── Expose functions to `window` so onclick handlers in HTML can call them ──

window.openFormulaModal = openFormulaModal;
window.closeFormulaModal = closeFormulaModal;
window.closeModalOnClickOutside = closeModalOnClickOutside;
window.calculateSubject = calculateSubject;
window.updatePrediction = updatePrediction;
window.printResult = printResult;
window.printOverallResult = printOverallResult;
window.proceedToCalculator = proceedToCalculator;
window.proceedToCGPACalculator = proceedToCGPACalculator;
window.changeSelection = changeSelection;
window.calculateOverallSGPA = calculateOverallSGPA;
window.calculateCGPA = calculateCGPA;

// ══════════════════════════════════════════════════════════════
//  MAIN FLOW — Screen navigation and user actions
// ══════════════════════════════════════════════════════════════

function proceedToCalculator() {
  const batchDropdown = document.getElementById("batchSelect");
  const branchDropdown = document.getElementById("branchSelect");
  const semesterDropdown = document.getElementById("semesterSelect");

  const batchId = batchDropdown.value;
  const branchId = branchDropdown.value;
  const semesterId = parseInt(semesterDropdown.value);

  if (batchId === "") return showError("Please select a batch");
  if (branchId === "") return showError("Please select a branch");
  if (semesterId === 0 || isNaN(semesterId))
    return showError("Please select a semester");

  const subjects = getSubjects(branchId, semesterId, batchId);
  if (subjects === null)
    return showError("Data for the selected combination is not available yet");

  setSelectedBatch(batchId);
  setSelectedBranch(branchId);
  setSelectedSemester(semesterId);
  setCurrentSubjects(subjects);

  switchScreen("calculatorScreen", function () {
    document.getElementById("app-container").classList.remove("main-card");
    document.body.classList.remove("body-centered");
  });

  const breadcrumbText = document.getElementById("breadcrumbText");
  breadcrumbText.textContent = `Batch ${batchId} | ${branchNames[branchId]} | Semester ${semesterId}`;

  createSubjectCards(subjects);
  restoreMarksForCurrentSelection();
  saveState();
  addAutoSaveListeners();
}

function proceedToCGPACalculator() {
  switchScreen("cgpaCalculatorScreen", function () {
    document.getElementById("app-container").classList.remove("main-card");
    document.body.classList.remove("body-centered");
  });
  document.getElementById("cgpaOutputSection").innerHTML =
    '<div class="placeholder-text"><h3>Your overall CGPA will appear here</h3></div>';
}

function changeSelection() {
  setState({
    selectedBatch: null,
    selectedBranch: null,
    selectedSemester: null,
    currentSubjects: [],
    gradePoints: {},
  });

  document.getElementById("subjectsGrid").innerHTML = "";
  document.getElementById("outputSection").innerHTML =
    '<div class="placeholder-text"><h3>Your overall SGPA will appear here</h3></div>';

  for (let sem = 1; sem <= 8; sem++) {
    const s = document.getElementById("sgpa" + sem);
    const c = document.getElementById("credits" + sem);
    if (s) s.value = "";
    if (c) c.value = "";
  }
  document.getElementById("cgpaOutputSection").innerHTML =
    '<div class="placeholder-text"><h3>Your overall CGPA will appear here</h3></div>';

  document.getElementById("batchSelect").value = "";
  document.getElementById("branchSelect").value = "";
  document.getElementById("semesterSelect").value = "";

  switchScreen("selectionScreen", function () {
    document.getElementById("app-container").classList.add("main-card");
    document.body.classList.add("body-centered");
  });
}

// ── Calculate SGPA from all subject marks on the calculator screen ──
function calculateOverallSGPA() {
  const { currentSubjects, gradePoints } = getState();

  // Check valid inputs
  let allValid = true;
  for (const subject of currentSubjects) {
    for (const field of subject.fields) {
      const inputId = "s" + subject.id + "-" + field.name;
      const el = document.getElementById(inputId);
      const val = parseFloat(el.value);
      if (isNaN(val) || el.value === "" || val < 0 || val > field.max) {
        allValid = false;
        break;
      }
    }
  }

  if (!allValid) {
    const outputSection = document.getElementById("outputSection");
    outputSection.innerHTML =
      '<div class="placeholder-text"><h3 style="color: #ff6b6b;">Please enter marks for all subjects correctly!</h3></div>';
    outputSection.scrollIntoView({ behavior: "smooth" });
    return;
  }

  // Calculate SGPA
  let totalCreditPoints = 0;
  let totalCredits = 0;

  // Recalculate all subjects to ensure gradePoints is fresh
  currentSubjects.forEach((sub) => calculateSubject(sub.id));

  // Re-read grade points (calculateSubject updates state.gradePoints)
  // Note: calculateSubject is synchronous
  const freshState = getState();

  currentSubjects.forEach((subject) => {
    let gp = freshState.gradePoints[subject.id] || 0;
    totalCreditPoints += gp * subject.credits;
    totalCredits += subject.credits;
  });

  const sgpa = totalCreditPoints / totalCredits;

  // Build Output
  let output = "";
  output += `<div class="sgpa-display">
    <div class="label">Overall SGPA:</div>
    <div class="value">${sgpa.toFixed(2)}</div>
  </div>`;

  output += `<h4 class="breakdown-title">Subject Breakdown:</h4>
  <div class="table-responsive">
  <table class="breakdown-table">
  <thead><tr>
  <th>Subject</th><th>Grade Point</th><th>Credits</th><th>Credit Points</th>
  </tr></thead><tbody>`;

  currentSubjects.forEach((subject) => {
    let gp = freshState.gradePoints[subject.id] || 0;
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

  document.getElementById("outputSection").innerHTML = output;
  document.getElementById("printContainer").style.display = "block";
  document
    .getElementById("outputSection")
    .scrollIntoView({ behavior: "smooth" });

  if (sgpa >= 9.0) triggerConfetti();
}

// ── Calculate CGPA from per-semester SGPA + credits ──
function calculateCGPA() {
  let totalCreditPoints = 0;
  let totalCredits = 0;
  let semestersEntered = 0;

  for (let sem = 1; sem <= 8; sem++) {
    const sgpaInput = document.getElementById("sgpa" + sem);
    const creditsInput = document.getElementById("credits" + sem);

    if (!sgpaInput || !creditsInput) continue;

    const sgpaValue = parseFloat(sgpaInput.value);
    const creditsValue = parseFloat(creditsInput.value);

    if (
      !isNaN(sgpaValue) &&
      !isNaN(creditsValue) &&
      sgpaValue > 0 &&
      creditsValue > 0
    ) {
      if (sgpaValue > 10) {
        document.getElementById("cgpaOutputSection").innerHTML =
          `<div class="placeholder-text"><h3 style="color: #ff6b6b;">SGPA for Semester ${sem} cannot exceed 10!</h3></div>`;
        return;
      }
      totalCreditPoints += sgpaValue * creditsValue;
      totalCredits += creditsValue;
      semestersEntered++;
    }
  }

  if (semestersEntered === 0) {
    document.getElementById("cgpaOutputSection").innerHTML =
      '<div class="placeholder-text"><h3 style="color: #ff6b6b;">Please enter data for at least one semester!</h3></div>';
    return;
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
    const sgpaInput = document.getElementById("sgpa" + s);
    const creditsInput = document.getElementById("credits" + s);
    if (!sgpaInput) continue;

    const sgpaValue = parseFloat(sgpaInput.value);
    const creditsValue = parseFloat(creditsInput.value);

    if (
      !isNaN(sgpaValue) &&
      !isNaN(creditsValue) &&
      sgpaValue > 0 &&
      creditsValue > 0
    ) {
      const cp = sgpaValue * creditsValue;
      output += `<tr><td>Semester ${s}</td><td>${sgpaValue.toFixed(2)}</td><td>${creditsValue}</td><td>${cp.toFixed(2)}</td></tr>`;
    }
  }

  output += `</tbody></table></div>`;
  output += `<div class="summary-box">
    <strong>Total Credit Points:</strong> ${totalCreditPoints.toFixed(2)} | 
    <strong>Total Credits:</strong> ${totalCredits} | 
    <strong>Semesters Included:</strong> ${semestersEntered} | 
    <strong>CGPA:</strong> ${cgpa.toFixed(2)}
  </div>`;

  output += `<div class="print-container"><button class="print-button" onclick="printOverallResult()">Print Result</button></div>`;

  document.getElementById("cgpaOutputSection").innerHTML = output;
  document
    .getElementById("cgpaOutputSection")
    .scrollIntoView({ behavior: "smooth" });

  if (cgpa >= 9.0) triggerConfetti();
}

// ══════════════════════════════════════════════════════════════
//  PERSISTENCE — Save / Load state to localStorage
// ══════════════════════════════════════════════════════════════

// Save the current selections and marks so the user can resume later
function saveState() {
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
    if (subject.hasOptions) {
      const el = document.getElementById("s" + subject.id + "-elective");
      if (el) marks.elective = el.value;
    }

    subject.fields.forEach((field) => {
      const el = document.getElementById("s" + subject.id + "-" + field.name);
      if (el) marks[field.name] = el.value;
    });

    const high = document.getElementById("s" + subject.id + "-highest");
    if (high) marks.highest = high.value;

    persistentData.marks[subject.id] = marks;
  });

  // Save CGPA
  for (let s = 1; s <= 8; s++) {
    const sgpa = document.getElementById("sgpa" + s);
    const cred = document.getElementById("credits" + s);
    if (sgpa && cred) {
      persistentData.cgpa[s] = { sgpa: sgpa.value, credits: cred.value };
    }
  }

  localStorage.setItem("cgpaCalcState", JSON.stringify(persistentData));
}

// On page load, restore previously saved dropdown selections
function loadState() {
  const saved = localStorage.getItem("cgpaCalcState");
  if (!saved) return;
  const data = JSON.parse(saved);

  // Restore CGPA
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

  // Restore the batch/branch/semester dropdowns
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

// After switching to the calculator screen, fill in any saved marks
function restoreMarksForCurrentSelection() {
  const saved = localStorage.getItem("cgpaCalcState");
  if (!saved) return;
  const data = JSON.parse(saved);

  // Check if saved data matches current selection
  const currentBatch = document.getElementById("batchSelect").value;
  const currentBranch = document.getElementById("branchSelect").value;
  const currentSemester = parseInt(
    document.getElementById("semesterSelect").value,
  );

  if (
    data.batch === currentBatch &&
    data.branch === currentBranch &&
    data.semester === currentSemester &&
    data.marks
  ) {
    Object.keys(data.marks).forEach((subId) => {
      const marks = data.marks[subId];
      if (marks) {
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
      }
    });
  }
}

// Auto-save whenever any input or dropdown changes (debounced)
function addAutoSaveListeners() {
  const inputs = document.querySelectorAll("input, select");
  const debouncedSave = debounce(saveState, 500);
  inputs.forEach((input) => {
    input.addEventListener("input", debouncedSave);
    input.addEventListener("change", debouncedSave);
  });
}

// ══════════════════════════════════════════════════════════════
//  APPS GRID TOGGLE — The "Your Apps" dropdown in the header
// ══════════════════════════════════════════════════════════════

function setupAppsToggle() {
  const appsToggle = document.getElementById("appsToggle");
  const appsDropdown = document.getElementById("appsDropdown");

  if (appsToggle && appsDropdown) {
    // Toggle dropdown
    appsToggle.addEventListener("click", (e) => {
      e.stopPropagation();
      const isExpanded = appsToggle.getAttribute("aria-expanded") === "true";
      appsToggle.setAttribute("aria-expanded", !isExpanded);
      appsToggle.classList.toggle("active");
      appsDropdown.classList.toggle("show");
    });

    // Close when clicking outside
    document.addEventListener("click", (e) => {
      if (!appsToggle.contains(e.target) && !appsDropdown.contains(e.target)) {
        appsToggle.classList.remove("active");
        appsToggle.setAttribute("aria-expanded", "false");
        appsDropdown.classList.remove("show");
      }
    });

    // Close on Escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && appsDropdown.classList.contains("show")) {
        appsToggle.classList.remove("active");
        appsToggle.setAttribute("aria-expanded", "false");
        appsDropdown.classList.remove("show");
      }
    });
  }
}

// ══════════════════════════════════════════════════════════════
//  INITIALIZATION — Runs once when the page finishes loading
// ══════════════════════════════════════════════════════════════

document.addEventListener("DOMContentLoaded", () => {
  loadState(); // Restore saved dropdown selections
  addAutoSaveListeners(); // Auto-save on any input change
  setupAppsToggle(); // Wire up the "Your Apps" dropdown
});
