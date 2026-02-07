/**
 * UI Manipulation Functions
 *
 * Handles everything visual:
 *   - Switching between the three screens (selection, calculator, CGPA)
 *   - Showing validation errors
 *   - Dynamically building subject cards from data
 *   - Modal open/close for the grading formula
 */

// ── Screen Switching (with a simple fade animation) ──

export function switchScreen(toScreenId, onComplete) {
  // The three possible screens
  const screens = [
    "selectionScreen",
    "calculatorScreen",
    "cgpaCalculatorScreen",
  ];

  // Find whichever screen is currently visible
  let currentScreenId = null;
  for (const id of screens) {
    const el = document.getElementById(id);
    if (el && el.style.display !== "none") {
      currentScreenId = id;
      break;
    }
  }

  // Helper: show the target screen with a fade-in
  const showTarget = () => {
    const toEl = document.getElementById(toScreenId);
    if (!toEl) return;

    // Selection screen uses flex to center, others use block
    if (toScreenId === "selectionScreen") {
      toEl.style.display = "flex";
    } else {
      toEl.style.display = "block";
    }
    toEl.classList.add("fade-in");

    // Remove the animation class after it finishes
    setTimeout(() => {
      toEl.classList.remove("fade-in");
    }, 400);
  };

  // If there's a visible screen, fade it out first, then show the new one
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
    // No current screen? Just show the target directly
    if (onComplete) onComplete();
    showTarget();
  }
}

// ── Error Messages ──

export function showError(message) {
  const errorDiv = document.getElementById("selectionError");
  if (!errorDiv) return;

  errorDiv.textContent = message;
  errorDiv.style.display = "block";

  // Auto-hide after 5 seconds
  setTimeout(function () {
    errorDiv.style.display = "none";
  }, 5000);
}

// ── Subject Card Rendering ──

/**
 * Build all subject cards and inject them into the grid.
 * Each card has input fields for component marks, a "highest marks" override,
 * a calculate button, and a result area.
 */
export function createSubjectCards(subjects) {
  const grid = document.getElementById("subjectsGrid");
  if (!grid) return;

  let fullHtml = "";
  subjects.forEach((subject) => {
    fullHtml += createOneSubjectCard(subject);
  });

  grid.innerHTML = fullHtml;
}

/**
 * Generate the HTML for a single subject card.
 * Called once per subject — all onClick handlers reference global (window) functions.
 */
function createOneSubjectCard(subject) {
  let html = "";

  // Card wrapper + header
  html += `<div class="subject-card">`;
  html += `<h3>${subject.name}</h3>`;

  // Elective dropdown (only for subjects with options, e.g. open electives)
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

  // Input fields for each mark component (ISE, MSE, ESE, TW, etc.)
  subject.fields.forEach((field) => {
    html += `<div class="input-group">`;
    html += `<label>${field.label} (out of ${field.max})</label>`;
    html += `<input type="number" `;
    html += `id="s${subject.id}-${field.name}" `;
    html += `min="0" max="${field.max}" step="1" `;
    html += `placeholder="Enter marks" `;
    html += `oninput="window.updatePrediction(${subject.id})" `;
    html += `>`;

    // Show "marks needed in ESE" prediction below the ESE field
    if (field.name === "ese") {
      html += `<div id="prediction-${subject.id}" class="prediction-text"></div>`;
    }

    html += `</div>`;
  });

  // "Highest Total Marks" — lets the user override the max (e.g. if topper scored less)
  html += `<div class="input-group">`;
  html += `<label>Highest Total Marks (Out of ${subject.defaultHighest})</label>`;
  html += `<input type="number" `;
  html += `id="s${subject.id}-highest" `;
  html += `min="0" max="${subject.defaultHighest}" step="1" `;
  html += `placeholder="Leave blank to assume ${subject.defaultHighest}" `;
  html += `oninput="window.updatePrediction(${subject.id})">`;
  html += `</div>`;

  // Calculate button + result area
  html += `<button class="calculate-subject-button" onclick="window.calculateSubject(${subject.id})">Calculate Subject Pointer</button>`;
  html += `<div class="subject-result" id="result${subject.id}"></div>`;
  html += `</div>`;

  return html;
}

// ── Formula Modal ──

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
