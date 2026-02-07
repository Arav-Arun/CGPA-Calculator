/**
 * Calculation Logic
 */

import { getState, updateGradePoint } from "./state.js";
import { getGradePoint } from "./utils.js";

// Calculate pointer for a single subject
export function calculateSubject(subjectId) {
  const { currentSubjects } = getState();
  const subject = currentSubjects.find((s) => s.id === subjectId);
  if (!subject) return;

  const resultDiv = document.getElementById("result" + subjectId);

  // Get all field values and calculate total
  let total = 0;
  let allFilled = true;

  for (const field of subject.fields) {
    const inputId = "s" + subjectId + "-" + field.name;
    const inputElement = document.getElementById(inputId);
    const value = inputElement.value;

    if (value === "" || isNaN(parseFloat(value))) {
      allFilled = false;
      break;
    }

    const numValue = parseFloat(value);
    if (numValue < 0 || numValue > field.max) {
      allFilled = false;
      break;
    }

    total += numValue;
  }

  if (!allFilled) {
    resultDiv.innerHTML =
      "<strong style='color: #ff6b6b;'>Fill all fields correctly !</strong>";
    resultDiv.style.display = "block";
    updateGradePoint(subjectId, 0);
    return;
  }

  // Fetch highest marks
  const highestInput = document.getElementById("s" + subjectId + "-highest");
  let highest = parseFloat(highestInput.value);
  if (isNaN(highest) || highest === 0) {
    highest = subject.defaultHighest;
  }

  if (highest > subject.defaultHighest) {
    resultDiv.innerHTML =
      "<strong style='color: #ff6b6b;'>Highest marks cannot exceed " +
      subject.defaultHighest +
      " !</strong>";
    resultDiv.style.display = "block";
    updateGradePoint(subjectId, 0);
    return;
  }

  const percentage = (total / highest) * 100;
  const gradePoint = getGradePoint(percentage);

  updateGradePoint(subjectId, gradePoint);

  let resultHTML = "";
  resultHTML += `<strong>Total Marks:</strong> ${total.toFixed(2)}/${highest.toFixed(2)}<br>`;
  resultHTML += `<strong>Percentage:</strong> ${percentage.toFixed(2)}%<br>`;
  resultHTML += `<strong>Subject Pointer:</strong> ${gradePoint}`;

  resultDiv.innerHTML = resultHTML;
  resultDiv.style.display = "block";
}

// Update "Marks Needed in ESE" prediction
export function updatePrediction(subjectId) {
  const { currentSubjects } = getState();
  const subject = currentSubjects.find((s) => s.id === subjectId);
  if (!subject) return;

  // Check if subject has ESE
  const eseField = subject.fields.find((f) => f.name === "ese");
  if (!eseField) return;

  const predictionDiv = document.getElementById("prediction-" + subjectId);
  const eseInput = document.getElementById("s" + subjectId + "-ese");

  if (eseInput.value !== "") {
    predictionDiv.innerHTML = "";
    return;
  }

  // Calculate current total from other fields
  let currentTotal = 0;
  let anyFieldFilled = false;

  subject.fields.forEach((field) => {
    if (field.name !== "ese") {
      const inputId = "s" + subjectId + "-" + field.name;
      const el = document.getElementById(inputId);
      if (el && el.value !== "") {
        anyFieldFilled = true;
        const val = parseFloat(el.value);
        if (!isNaN(val)) {
          currentTotal += val;
        }
      }
    }
  });

  // If no other fields are filled, don't show prediction yet
  if (!anyFieldFilled) {
    predictionDiv.innerHTML = "";
    return;
  }

  const highestInput = document.getElementById("s" + subjectId + "-highest");
  let highest = parseFloat(highestInput.value);
  if (isNaN(highest) || highest === 0) {
    highest = subject.defaultHighest;
  }

  const requiredFor10 = 0.8 * highest;
  const requiredFor9 = 0.7 * highest;

  const needFor10 = Math.ceil(requiredFor10 - currentTotal);
  const needFor9 = Math.ceil(requiredFor9 - currentTotal);
  const eseMax = eseField.max;

  let predictionHTML = "";

  if (needFor10 <= eseMax) {
    if (needFor10 <= 0) {
      predictionHTML +=
        "<span class='predict-success'>Already secured 10 Pointer!</span>";
    } else {
      predictionHTML += `Need <strong>${needFor10}</strong>/${eseMax} in ESE for 10 Pt`;
    }
  } else {
    // Check if it is mathematically impossible even if we score full marks in remaining fields?
    // Actually, "not possible" logic depends on max remaining marks.
    // But currently we just check against ESE max.
    predictionHTML += "<span class='predict-fail'>10 Pt not possible</span>";
  }

  predictionHTML += " | ";

  if (needFor9 <= eseMax) {
    if (needFor9 <= 0) {
      predictionHTML +=
        "<span class='predict-success'>Already secured 9 Pointer!</span>";
    } else {
      predictionHTML += `Need <strong>${needFor9}</strong>/${eseMax} in ESE for 9 Pt`;
    }
  } else {
    predictionHTML += "<span class='predict-fail'>9 Pt not possible</span>";
  }

  predictionDiv.innerHTML = predictionHTML;
}

export function triggerConfetti() {
  const duration = 3 * 1000;
  const animationEnd = Date.now() + duration;
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

  function randomInRange(min, max) {
    return Math.random() * (max - min) + min;
  }

  const interval = setInterval(function () {
    const timeLeft = animationEnd - Date.now();
    if (timeLeft <= 0) {
      return clearInterval(interval);
    }
    const particleCount = 50 * (timeLeft / duration);
    if (window.confetti) {
      window.confetti(
        Object.assign({}, defaults, {
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        }),
      );
      window.confetti(
        Object.assign({}, defaults, {
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        }),
      );
    }
  }, 250);
}
