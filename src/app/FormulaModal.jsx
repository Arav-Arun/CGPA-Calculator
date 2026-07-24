const GRADE_TABLE = [
  ["80% and above", "10", "O (Outstanding)"],
  ["70% – 79%", "9", "A+ (Excellent)"],
  ["60% – 69%", "8", "A (Very Good)"],
  ["55% – 59%", "7", "B+ (Good)"],
  ["50% – 54%", "6", "B (Above Average)"],
  ["45% – 49%", "5", "C (Average)"],
  ["40% – 44%", "4", "P (Pass)"],
  ["Below 40%", "0", "F (Fail)"],
];

export default function FormulaModal({ open, onClose }) {
  if (!open) return null;

  return (
    <div
      className="modal-overlay show"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal-content">
        <button className="close-modal-button" onClick={onClose}>X</button>

        <h2>SGPA Calculation Guide</h2>

        <div className="modal-section">
          <h3>Grade Point Conversion Table:</h3>
          <table>
            <thead>
              <tr>
                <th>% Marks</th>
                <th>Grade Point</th>
                <th>Grade</th>
              </tr>
            </thead>
            <tbody>
              {GRADE_TABLE.map(([marks, point, grade]) => (
                <tr key={point}>
                  <td>{marks}</td>
                  <td><strong>{point}</strong></td>
                  <td>{grade}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="modal-section">
          <h3>Calculation Steps:</h3>

          <div className="calculation-step">
            <h4>For Theory Subjects (with IA, MSE, ESE):</h4>
            <code>Step 1: Total = IA + MSE + ESE</code>
            <p><strong>Example:</strong> 18 + 25 + 42 = 85 marks</p>
            <code>Step 2: Percentage = (Total / Highest Marks) × 100</code>
            <p><strong>Example:</strong> (85 / 100) × 100 = 85%</p>
            <code>Step 3: Grade Point = Based on percentage (see table)</code>
            <p><strong>Example:</strong> 85% = Grade Point 10</p>
          </div>

          <div className="calculation-step">
            <h4>For Tutorial/Lab Subjects (CA or Lab marks only):</h4>
            <code>Step 1: Total = CA or Lab marks</code>
            <p><strong>Example:</strong> 45 out of 50</p>
            <code>Step 2: Percentage = (Total / Highest Marks) × 100</code>
            <p><strong>Example:</strong> (45 / 50) × 100 = 90%</p>
            <code>Step 3: Grade Point = Based on percentage (see table)</code>
            <p><strong>Example:</strong> 90% = Grade Point 10</p>
          </div>

          <div className="calculation-step">
            <h4>Calculate Credit Points for Each Subject:</h4>
            <code>Credit Points = Grade Point × Subject Credits</code>
            <p><strong>Example:</strong> 10 × 4 = 40 credit points</p>
          </div>

          <div className="calculation-step highlight-step">
            <h4>Final Step: Calculate Overall SGPA</h4>
            <code>SGPA = Total Credit Points / Total Credits</code>
            <p><strong>Example:</strong> 200 / 22 = 9.09</p>
          </div>

          <div className="calculation-step highlight-step">
            <h4>Calculate Overall CGPA</h4>
            <code>CGPA = (SGPA1×Credits1 + SGPA2×Credits2 + ... + SGPA8×Credits8) / Total Credits</code>
            <p><strong>Example:</strong> (9.0×21 + 9.5×20 + 8.8×22 + 9.2×21) / 84 = 9.13</p>
          </div>
        </div>

        <div className="modal-section">
          <h3>Note:</h3>
          <ul className="important-notes">
            <li>You need at least 40% in each component to pass</li>
            <li>60% of total credits needed in First Year</li>
            <li>ESE and CA are separate passing heads for theory courses</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
