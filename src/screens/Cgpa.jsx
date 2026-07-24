import { calcCgpa } from "../core/gpa.js";
import { useResult, Output } from "./Result.jsx";

export default function Cgpa({ cgpa, onCgpaChange, onBackToSelection, onBackToSgpa }) {
  const { result, error, ref, submit } = useResult();
  const calculate = () => submit(calcCgpa(cgpa));

  return (
    <div className="calculator-screen">
      <div className="breadcrumb">
        <span>Overall CGPA Calculator</span>
        <div className="breadcrumb-buttons">
          <button className="change-selection-button" onClick={onBackToSelection}>Back to Selection</button>
          <button className="change-selection-button" onClick={onBackToSgpa}>Back to SGPA</button>
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
        <button className="calculate-sgpa-button" onClick={calculate}>Calculate Overall CGPA</button>
      </div>

      <Output result={result} error={error} outputRef={ref} placeholder="Your overall CGPA will appear here" />
    </div>
  );
}
