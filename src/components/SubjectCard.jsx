import { useMemo } from "react";
import { calcSubject, predictEse } from "../lib/grading.js";

/** One line of the "marks needed in ESE" hint. */
function Prediction({ part }) {
  if (part.kind === "fail")
    return <span className="predict-fail">{part.pointer} Pt not possible</span>;
  if (part.kind === "secured")
    return <span className="predict-success">Already secured {part.pointer} Pointer!</span>;
  return (
    <>
      Need <strong>{part.need}</strong>/{part.max} in ESE for {part.pointer} Pt
    </>
  );
}

export default function SubjectCard({ subject, entry, onChange, revealed, onCalculate }) {
  const result = useMemo(() => calcSubject(subject, entry), [subject, entry]);
  const prediction = useMemo(() => predictEse(subject, entry), [subject, entry]);

  return (
    <div className="subject-card">
      <h3>{subject.name}</h3>

      {subject.hasOptions && subject.options && (
        <div className="input-group">
          <label>Select Elective Course</label>
          <select
            className="elective-dropdown"
            value={entry.elective ?? ""}
            onChange={(e) => onChange("elective", e.target.value)}
          >
            <option value="">-- Choose Your Elective --</option>
            {subject.options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      )}

      {subject.fields.map((field) => (
        <div className="input-group" key={field.name}>
          <label>
            {field.label} (out of {field.max})
          </label>
          <input
            type="number"
            min="0"
            max={field.max}
            step="1"
            placeholder="Enter marks"
            value={entry[field.name] ?? ""}
            onChange={(e) => onChange(field.name, e.target.value)}
          />
          {field.name === "ese" && prediction && (
            <div className="prediction-text">
              <Prediction part={prediction.p10} /> | <Prediction part={prediction.p9} />
            </div>
          )}
        </div>
      ))}

      <div className="input-group">
        <label>Highest Total Marks (Out of {subject.defaultHighest})</label>
        <input
          type="number"
          min="0"
          max={subject.defaultHighest}
          step="1"
          placeholder={`Leave blank to assume ${subject.defaultHighest}`}
          value={entry.highest ?? ""}
          onChange={(e) => onChange("highest", e.target.value)}
        />
      </div>

      <button className="calculate-subject-button" onClick={onCalculate}>
        Calculate Subject Pointer
      </button>

      {revealed && (
        <div className="subject-result" style={{ display: "block" }}>
          {result.valid ? (
            <>
              <strong>Total Marks:</strong> {result.total.toFixed(2)}/{result.highest.toFixed(2)}
              <br />
              <strong>Percentage:</strong> {result.percentage.toFixed(2)}%
              <br />
              <strong>Subject Pointer:</strong> {result.gradePoint}
            </>
          ) : (
            <strong style={{ color: "#ff6b6b" }}>{result.error}</strong>
          )}
        </div>
      )}
    </div>
  );
}
