import { useEffect, useRef, useState } from "react";
import SubjectCard from "./SubjectCard.jsx";
import ResultBreakdown from "./ResultBreakdown.jsx";
import { calcSgpa } from "../lib/grading.js";
import { celebrate } from "../lib/confetti.js";

export default function SgpaScreen({ subjects, semester, breadcrumb, marks, onMarkChange, onChangeSelection, onGoCgpa }) {
  const [revealed, setRevealed] = useState({});
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const outputRef = useRef(null);

  useEffect(() => {
    if (result) outputRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [result]);

  const calculateOverall = () => {
    // Mirror the classic behaviour: revealing every card's result at once.
    setRevealed(Object.fromEntries(subjects.map((s) => [s.id, true])));

    const outcome = calcSgpa(subjects, marks, semester);
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
        <span>{breadcrumb}</span>
        <div className="breadcrumb-buttons">
          <button className="change-selection-button" onClick={onChangeSelection}>
            Change Selection
          </button>
          <button className="cgpa-calculator-button-small" onClick={onGoCgpa}>
            Calculate Overall CGPA
          </button>
        </div>
      </div>

      <div className="info-box">
        <p>1. Enter marks for each subject and click "Calculate Subject Pointer"</p>
        <p>2. Then click "Calculate Overall SGPA" to get overall SGPA</p>
      </div>

      <div className="subjects-grid">
        {subjects.map((subject) => (
          <SubjectCard
            key={subject.id}
            subject={subject}
            entry={marks[subject.id] ?? {}}
            revealed={!!revealed[subject.id]}
            onChange={(field, value) => onMarkChange(subject.id, field, value)}
            onCalculate={() => setRevealed((r) => ({ ...r, [subject.id]: true }))}
          />
        ))}
      </div>

      <div className="calculate-sgpa-container">
        <button className="calculate-sgpa-button" onClick={calculateOverall}>
          Calculate Overall SGPA
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="output-section" ref={outputRef}>
        {result ? (
          <ResultBreakdown report={result} />
        ) : (
          <div className="placeholder-text">
            <h3>Your overall SGPA will appear here</h3>
          </div>
        )}
      </div>
    </div>
  );
}
