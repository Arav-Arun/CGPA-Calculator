import { useEffect, useRef, useState } from "react";
import ResultBreakdown from "./ResultBreakdown.jsx";
import { calcCgpa } from "../lib/grading.js";
import { celebrate } from "../lib/confetti.js";

export default function CgpaScreen({ cgpa, onCgpaChange, onBackToSelection, onBackToSgpa }) {
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const outputRef = useRef(null);

  useEffect(() => {
    if (result) outputRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [result]);

  const calculate = () => {
    const outcome = calcCgpa(cgpa);
    if (!outcome.ok) {
      setError(outcome.error);
      setResult(null);
      return;
    }
    setError("");
    setResult(outcome.report);
    if (outcome.value >= 9.0) celebrate();
  };

  return (
    <div className="calculator-screen">
      <div className="breadcrumb">
        <span>Overall CGPA Calculator</span>
        <div className="breadcrumb-buttons">
          <button className="change-selection-button" onClick={onBackToSelection}>
            Back to Selection
          </button>
          <button className="change-selection-button" onClick={onBackToSgpa}>
            Back to SGPA
          </button>
        </div>
      </div>

      <div className="info-box">
        <p>Enter your SGPA and Credits for each semester to calculate your overall CGPA</p>
        <p>Leave semesters blank if you haven't completed them yet</p>
      </div>

      <div className="cgpa-grid">
        {cgpa.map((row, i) => (
          <div className="cgpa-card" key={i}>
            <h3>Semester {i + 1}</h3>
            <div className="input-group">
              <label>SGPA</label>
              <input
                type="number"
                min="0"
                max="10"
                step="0.01"
                placeholder="Enter SGPA"
                value={row.sgpa}
                onChange={(e) => onCgpaChange(i, "sgpa", e.target.value)}
              />
            </div>
            <div className="input-group">
              <label>Credits</label>
              <input
                type="number"
                min="0"
                step="1"
                placeholder="Enter Credits"
                value={row.credits}
                onChange={(e) => onCgpaChange(i, "credits", e.target.value)}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="calculate-sgpa-container">
        <button className="calculate-sgpa-button" onClick={calculate}>
          Calculate Overall CGPA
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="output-section" ref={outputRef}>
        {result ? (
          <ResultBreakdown report={result} />
        ) : (
          <div className="placeholder-text">
            <h3>Your overall CGPA will appear here</h3>
          </div>
        )}
      </div>
    </div>
  );
}
