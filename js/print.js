// Print Functionality
// Handles generating and printing SGPA and CGPA reports.

import { getState } from "./state.js";
import { branchNames as branches } from "./utils.js";

export function printResult() {
  const {
    selectedSemester,
    selectedBatch,
    selectedBranch,
    currentSubjects,
    gradePoints,
  } = getState();

  // Set Print Title
  const titleEl = document.getElementById("printTitleSGPA");
  if (titleEl)
    titleEl.textContent =
      "KJSCE / KJSSE Semester " + selectedSemester + " SGPA Report";

  // Set Student Details
  const batchEl = document.getElementById("printBatch");
  if (batchEl) batchEl.textContent = selectedBatch;

  const branchEl = document.getElementById("printBranch");
  if (branchEl) branchEl.textContent = branches[selectedBranch];

  const semEl = document.getElementById("printSemester");
  if (semEl) semEl.textContent = selectedSemester;

  const tbody = document.getElementById("printTableBody");
  tbody.innerHTML = "";

  let totalCreditPoints = 0;
  let totalCredits = 0;

  let i = 0;
  while (i < currentSubjects.length) {
    const subject = currentSubjects[i];
    let gp = gradePoints[subject.id];
    if (gp === undefined) gp = 0;
    const creditPoints = gp * subject.credits;

    totalCreditPoints += creditPoints;
    totalCredits += subject.credits;

    // Get marks breakdown string
    let marksBreakdown = [];
    let totalMarks = 0;

    // Note: This relies on DOM being populated.
    // Ideally we should read from state if possible, but DOM read is what original code did.
    // For print, reading from DOM inputs is fine since it's triggered by user action on the page.

    let j = 0;
    while (j < subject.fields.length) {
      const field = subject.fields[j];
      const inputId = "s" + subject.id + "-" + field.name;
      const inputEl = document.getElementById(inputId);
      const val = inputEl ? inputEl.value : "";

      marksBreakdown.push(field.label.split(" (")[0] + ": " + val);
      totalMarks += parseFloat(val) || 0;
      j++;
    }

    // Get highest marks
    const highestInput = document.getElementById("s" + subject.id + "-highest");
    let highest = highestInput
      ? parseFloat(highestInput.value)
      : subject.defaultHighest;
    if (isNaN(highest) || highest === 0) {
      highest = subject.defaultHighest;
    }

    let displayName = subject.name;
    // Check if it's an elective and get the specific selected name
    if (subject.hasOptions) {
      const electiveSelect = document.getElementById(
        "s" + subject.id + "-elective",
      );
      if (electiveSelect && electiveSelect.value) {
        const selectedOption = subject.options.find(
          (opt) => opt.value === electiveSelect.value,
        );
        if (selectedOption) {
          displayName = selectedOption.label;
        }
      }
    }

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${displayName}</td>
      <td>${marksBreakdown.join(", ")}</td>
      <td>${totalMarks.toFixed(0)} / ${highest}</td>
      <td>${subject.credits}</td>
      <td>${gp}</td>
      <td>${creditPoints.toFixed(0)}</td>
    `;
    tbody.appendChild(tr);
    i++;
  }

  // Calculate SGPA
  const sgpa = totalCredits > 0 ? totalCreditPoints / totalCredits : 0;

  // Footer
  const tfoot = document.getElementById("printTableFooter");
  tfoot.innerHTML = `
    <tr>
      <td colspan="3" style="text-align: right;">Total:</td>
      <td>${totalCredits}</td>
      <td>SGPA: ${sgpa.toFixed(2)}</td>
      <td>${totalCreditPoints.toFixed(0)}</td>
    </tr>
  `;

  const printArea = document.getElementById("printAreaSGPA");
  printArea.classList.add("printable");

  // Delay print to ensure DOM updates are rendered
  setTimeout(() => {
    window.print();
    setTimeout(() => {
      printArea.classList.remove("printable");
    }, 500);
  }, 500);
}

export function printOverallResult() {
  const tbody = document.getElementById("printOverallTableBody");
  tbody.innerHTML = "";

  let totalCreditPoints = 0;
  let totalCredits = 0;
  let semestersEntered = 0;

  let sem = 1;
  while (sem <= 8) {
    const sgpaInput = document.getElementById("sgpa" + sem);
    const creditsInput = document.getElementById("credits" + sem);

    if (!sgpaInput || !creditsInput) {
      sem++;
      continue;
    }

    const sgpaValue = parseFloat(sgpaInput.value);
    const creditsValue = parseFloat(creditsInput.value);

    if (
      !isNaN(sgpaValue) &&
      !isNaN(creditsValue) &&
      sgpaValue > 0 &&
      creditsValue > 0
    ) {
      const creditPoints = sgpaValue * creditsValue;
      totalCreditPoints += creditPoints;
      totalCredits += creditsValue;
      semestersEntered++;

      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>Semester ${sem}</td>
        <td>${sgpaValue.toFixed(2)}</td>
      `;
      tbody.appendChild(tr);
    }
    sem++;
  }

  if (semestersEntered === 0) {
    alert("Please calculate the CGPA first!");
    return;
  }

  const cgpa = totalCreditPoints / totalCredits;

  // Footer
  const tfoot = document.getElementById("printOverallTableFooter");
  tfoot.innerHTML = `
    <tr>
      <td style="text-align: right; font-weight: bold;">Final CGPA:</td>
      <td style="font-weight: bold;">${cgpa.toFixed(2)}</td>
    </tr>
  `;

  const printArea = document.getElementById("printAreaOverall");
  printArea.classList.add("printable");

  setTimeout(() => {
    window.print();
    setTimeout(() => {
      printArea.classList.remove("printable");
    }, 500);
  }, 500);
}
