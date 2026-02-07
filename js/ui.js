/**
 * UI Manipulation Functions
 */

// Animated screen switch
export function switchScreen(toScreenId, onComplete) {
  // Identify currently visible screen
  const screens = [
    "selectionScreen",
    "calculatorScreen",
    "cgpaCalculatorScreen",
  ];
  let currentScreenId = null;

  for (const id of screens) {
    const el = document.getElementById(id);
    if (el && el.style.display !== "none") {
      currentScreenId = id;
      break;
    }
  }

  // Helper to show the target
  const showTarget = () => {
    const toEl = document.getElementById(toScreenId);
    if (!toEl) return;

    if (toScreenId === "selectionScreen") {
      toEl.style.display = "flex";
    } else {
      toEl.style.display = "block";
    }
    toEl.classList.add("fade-in");

    // Clean up fade-in class
    setTimeout(() => {
      toEl.classList.remove("fade-in");
    }, 400);
  };

  if (currentScreenId) {
    const currentEl = document.getElementById(currentScreenId);
    currentEl.classList.add("fade-out");

    setTimeout(() => {
      currentEl.style.display = "none";
      currentEl.classList.remove("fade-out");
      if (onComplete) onComplete();
      showTarget();
    }, 300);
  } else {
    if (onComplete) onComplete();
    showTarget();
  }
}

// Show temporary error message
export function showError(message) {
  const errorDiv = document.getElementById("selectionError");
  if (!errorDiv) return;

  errorDiv.textContent = message;
  errorDiv.style.display = "block";

  // Hide after 5 seconds
  setTimeout(function () {
    errorDiv.style.display = "none";
  }, 5000);
}

// Render all subject cards to the grid
export function createSubjectCards(
  subjects,
  updatePredictionCallback,
  calculateSubjectCallback,
) {
  const grid = document.getElementById("subjectsGrid");
  if (!grid) return;

  let fullHtml = "";

  subjects.forEach((subject) => {
    fullHtml += createOneSubjectCard(subject);
  });

  grid.innerHTML = fullHtml;

  // Note: Since we are using onclick handlers in the HTML, they need to be globally accessible.
  // Or we attach listeners after creation.
  // The original code used `onclick="calculateSubject(id)"`.
  // To keep "onClick" working with modules, we need to attach functions to window
  // OR add event listeners dynamically.
  // Let's add listeners dynamically for cleaner code later, but for now, we'll keep the HTML structure
  // and ensure functions are globally available in main.js
}

function createOneSubjectCard(subject) {
  let html = "";

  // 1. Card Header
  html += `<div class="subject-card">`;
  html += `<h3>${subject.name}</h3>`;

  // 2. Elective Dropdown
  if (subject.hasOptions && subject.options) {
    html += `<div class="input-group">`;
    html += `<label>Select Elective Course</label>`;
    html += `<select id="s${subject.id}-elective" class="elective-dropdown">`;
    html += `<option value="">-- Choose Your Elective --</option>`;

    subject.options.forEach((option) => {
      html += `<option value="${option.value}">${option.label}</option>`;
    });

    html += `</select></div>`;
  }

  // 3. Mark Input Fields
  subject.fields.forEach((field) => {
    html += `<div class="input-group">`;
    html += `<label>${field.label} (out of ${field.max})</label>`;
    html += `<input type="number" `;
    html += `id="s${subject.id}-${field.name}" `;
    html += `min="0" max="${field.max}" step="1" `;
    html += `placeholder="Enter marks" `;
    // We will attach listeners later or assume global `updatePrediction`
    html += `oninput="window.updatePrediction(${subject.id})" `;
    html += `>`;

    if (field.name === "ese") {
      html += `<div id="prediction-${subject.id}" class="prediction-text"></div>`;
    }

    html += `</div>`;
  });

  // 4. Highest Marks Field
  html += `<div class="input-group">`;
  html += `<label>Highest Total Marks (Out of ${subject.defaultHighest})</label>`;
  html += `<input type="number" `;
  html += `id="s${subject.id}-highest" `;
  html += `min="0" max="${subject.defaultHighest}" step="1" `;
  html += `placeholder="Leave blank to assume ${subject.defaultHighest}" `;
  html += `oninput="window.updatePrediction(${subject.id})">`;
  html += `</div>`;

  // Calculate Button
  // Assuming global calculateSubject
  html += `<button class="calculate-subject-button" onclick="window.calculateSubject(${subject.id})">Calculate Subject Pointer</button>`;

  // Result Div
  html += `<div class="subject-result" id="result${subject.id}"></div>`;
  html += `</div>`;

  return html;
}

export function openFormulaModal() {
  const modal = document.getElementById("formulaModal");
  if (modal) modal.classList.add("show");
}

export function closeFormulaModal() {
  const modal = document.getElementById("formulaModal");
  if (modal) modal.classList.remove("show");
}

export function closeModalOnClickOutside(event) {
  if (event.target.id === "formulaModal") {
    closeFormulaModal();
  }
}
