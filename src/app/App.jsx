import { useEffect, useMemo, useState } from "react";
import Selection from "../screens/Selection.jsx";
import Sgpa from "../screens/Sgpa.jsx";
import Cgpa from "../screens/Cgpa.jsx";
import FormulaModal from "./FormulaModal.jsx";
import { getSubjects, branchFullName } from "../subjects/index.js";
import { loadState, saveState } from "../core/storage.js";

const EMPTY_SELECTION = { batch: "", branch: "", semester: "" };
const keyOf = (sel) => (sel ? `${sel.batch}|${sel.branch}|${sel.semester}` : null);

const initial = loadState();

export default function App() {
  const [screen, setScreen] = useState("selection");
  const [selection, setSelection] = useState(initial.selection);
  const [committed, setCommitted] = useState(initial.committed);
  const [marks, setMarks] = useState(initial.marks);
  const [cgpa, setCgpa] = useState(initial.cgpa);
  const [selectionError, setSelectionError] = useState("");
  const [showModal, setShowModal] = useState(false);

  // Subjects currently loaded in the SGPA calculator (marks belong to these).
  const subjects = useMemo(
    () => (committed ? getSubjects(committed.branch, Number(committed.semester), committed.batch) : null),
    [committed],
  );

  // Debounced auto-save: one write per burst of edits, from any screen.
  useEffect(() => {
    const id = setTimeout(() => saveState({ committed, marks, cgpa }), 500);
    return () => clearTimeout(id);
  }, [committed, marks, cgpa]);

  // The selection screen is a centered card; the calculators are full width.
  useEffect(() => {
    document.body.classList.toggle("body-centered", screen === "selection");
  }, [screen]);

  const updateSelection = (field, value) => {
    setSelection((prev) => ({ ...prev, [field]: value }));
    setSelectionError("");
  };

  const proceedToSgpa = () => {
    const { batch, branch, semester } = selection;
    if (!batch) return setSelectionError("Please select a batch");
    if (!branch) return setSelectionError("Please select a branch");
    if (!semester) return setSelectionError("Please select a semester");
    if (!getSubjects(branch, Number(semester), batch)) {
      return setSelectionError("Data for this combination is not available yet");
    }

    // Switching to a different combination starts its marks fresh.
    if (keyOf(selection) !== keyOf(committed)) setMarks({});
    setCommitted({ batch, branch, semester });
    setSelectionError("");
    setScreen("sgpa");
  };

  // Clears the live selection but keeps committed marks, so re-picking the same
  // combination restores them (subject IDs repeat across branches).
  const changeSelection = () => {
    setSelection(EMPTY_SELECTION);
    setSelectionError("");
    setScreen("selection");
  };

  const backToSgpa = () => {
    if (committed && getSubjects(committed.branch, Number(committed.semester), committed.batch)) {
      setScreen("sgpa");
    } else {
      changeSelection();
    }
  };

  const updateMark = (subjectId, field, value) =>
    setMarks((prev) => ({ ...prev, [subjectId]: { ...prev[subjectId], [field]: value } }));

  const updateCgpa = (index, field, value) =>
    setCgpa((prev) => prev.map((row, i) => (i === index ? { ...row, [field]: value } : row)));

  return (
    <>
      <div id="app-container" className={screen === "selection" ? "main-card" : ""}>
        <header className="banner">
          <h1>KJSSE CGPA Calculator</h1>
          <div className="header-actions">
            <button className="view-formula-button" onClick={() => setShowModal(true)}>View Formula</button>
          </div>
        </header>

        <main>
          {screen === "selection" && (
            <Selection
              selection={selection}
              onChange={updateSelection}
              onProceedSgpa={proceedToSgpa}
              onProceedCgpa={() => setScreen("cgpa")}
              error={selectionError}
            />
          )}

          {screen === "sgpa" && subjects && (
            <Sgpa
              subjects={subjects}
              semester={committed.semester}
              breadcrumb={`Batch ${committed.batch} | ${branchFullName(committed.branch)} | Semester ${committed.semester}`}
              marks={marks}
              onMarkChange={updateMark}
              onChangeSelection={changeSelection}
              onGoCgpa={() => setScreen("cgpa")}
            />
          )}

          {screen === "cgpa" && (
            <Cgpa
              cgpa={cgpa}
              onCgpaChange={updateCgpa}
              onBackToSelection={changeSelection}
              onBackToSgpa={backToSgpa}
            />
          )}
        </main>

        <footer>
          <p>
            Made with ❤️ by{" "}
            <a href="https://aravarun.xyz" style={{ textDecoration: "underline" }}>Arav Arun</a>
          </p>
        </footer>
      </div>

      <FormulaModal open={showModal} onClose={() => setShowModal(false)} />
    </>
  );
}
