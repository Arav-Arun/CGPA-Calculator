import { BATCHES, BRANCHES, SEMESTERS } from "../subjects/index.js";

export default function Selection({ selection, onChange, onProceedSgpa, onProceedCgpa, error }) {
  return (
    <div className="selection-screen">
      <div className="selection-container">
        <h2>Select Your Batch, Branch and Semester</h2>

        <div className="selection-form">
          <div className="form-group">
            <label htmlFor="batchSelect">Batch</label>
            <select id="batchSelect" className="select-input" value={selection.batch} onChange={(e) => onChange("batch", e.target.value)}>
              <option value="">Select Batch</option>
              {BATCHES.map((batch) => (
                <option key={batch} value={batch}>{batch}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="branchSelect">Branch</label>
            <select id="branchSelect" className="select-input" value={selection.branch} onChange={(e) => onChange("branch", e.target.value)}>
              <option value="">Select Branch</option>
              {BRANCHES.map((branch) => (
                <option key={branch.id} value={branch.id}>{branch.label}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="semesterSelect">Semester</label>
            <select id="semesterSelect" className="select-input" value={selection.semester} onChange={(e) => onChange("semester", e.target.value)}>
              <option value="">Select Semester</option>
              {SEMESTERS.map((sem) => (
                <option key={sem} value={sem}>Semester {sem}</option>
              ))}
            </select>
          </div>

          <div className="selection-actions">
            <button className="proceed-button" onClick={onProceedSgpa}>Proceed to SGPA Calculator</button>
            <button className="cgpa-calculator-button" onClick={onProceedCgpa}>Calculate Overall CGPA</button>
          </div>

          {error && <div className="error-message">{error}</div>}
        </div>
      </div>
    </div>
  );
}
