import { useEffect, useRef, useState } from "react";
import confetti from "canvas-confetti";

/** Rain confetti from both bottom corners for 3s. Fired when SGPA/CGPA ≥ 9. */
export function celebrate() {
  const duration = 3000;
  const end = Date.now() + duration;
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };
  const rand = (min, max) => Math.random() * (max - min) + min;

  const interval = setInterval(() => {
    const left = end - Date.now();
    if (left <= 0) return clearInterval(interval);
    const particleCount = 50 * (left / duration);
    confetti({ ...defaults, particleCount, origin: { x: rand(0.1, 0.3), y: Math.random() - 0.2 } });
    confetti({ ...defaults, particleCount, origin: { x: rand(0.7, 0.9), y: Math.random() - 0.2 } });
  }, 250);
}

/**
 * Shared result state for the SGPA & CGPA screens: holds the computed report or
 * an error, scrolls it into view, and fires confetti for a 9+.
 * `submit` takes the {ok, value, report, error} outcome from calcSgpa/calcCgpa.
 */
export function useResult() {
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const ref = useRef(null);

  useEffect(() => {
    if (result) ref.current?.scrollIntoView({ behavior: "smooth" });
  }, [result]);

  const submit = (outcome) => {
    if (!outcome.ok) return (setError(outcome.error), setResult(null));
    setError("");
    setResult(outcome.report);
    if (outcome.value >= 9.0) celebrate();
  };

  return { result, error, ref, submit };
}

/** The error banner + output section (placeholder until a report exists). */
export function Output({ result, error, outputRef, placeholder }) {
  return (
    <>
      {error && <div className="error-message">{error}</div>}
      <div className="output-section" ref={outputRef}>
        {result ? (
          <Breakdown report={result} />
        ) : (
          <div className="placeholder-text">
            <h3>{placeholder}</h3>
          </div>
        )}
      </div>
    </>
  );
}

/** The headline value + breakdown table + summary row of a report. */
function Breakdown({ report }) {
  const { label, value, title, columns, rows, summary } = report;
  return (
    <>
      <div className="sgpa-display">
        <div className="label">{label}</div>
        <div className="value">{value}</div>
      </div>

      <h4 className="breakdown-title">{title}</h4>
      <div className="table-responsive">
        <table className="breakdown-table">
          <thead>
            <tr>{columns.map((col) => <th key={col}>{col}</th>)}</tr>
          </thead>
          <tbody>
            {rows.map((cells, i) => (
              <tr key={i}>{cells.map((cell, j) => <td key={j}>{cell}</td>)}</tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="summary-box">
        {summary.map(([key, val], i) => (
          <span key={key}>
            <strong>{key}:</strong> {val}
            {i < summary.length - 1 ? " | " : ""}
          </span>
        ))}
      </div>
    </>
  );
}
