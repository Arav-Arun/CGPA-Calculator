/** Renders a grading "report" (see lib/grading.js): headline + table + summary. */
export default function ResultBreakdown({ report }) {
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
            <tr>
              {columns.map((col) => (
                <th key={col}>{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((cells, i) => (
              <tr key={i}>
                {cells.map((cell, j) => (
                  <td key={j}>{cell}</td>
                ))}
              </tr>
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
