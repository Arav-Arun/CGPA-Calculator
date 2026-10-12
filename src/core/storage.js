/**
 * localStorage persistence.
 *
 * Stored blob (unchanged from v1, so existing users keep their data):
 *   { batch, branch, semester, marks, cgpa }
 *   - marks: { [subjectId]: { field: value, ..., highest, elective } }
 *   - cgpa:  { "1": { sgpa, credits }, ... "8": { ... } }
 */

const KEY = "cgpaCalcState";
const LEGACY_KEY = "cgpaProfiles";
const SEMESTERS = 8;

export const emptyCgpa = () =>
  Array.from({ length: SEMESTERS }, () => ({ sgpa: "", credits: "" }));

/** Move saved marks from an old combined course into its separate grading heads. */
export function migrateSplitMarks(subjects, marks) {
  let migrated = marks;
  for (const subject of subjects) {
    const source = subject.legacyCombined;
    if (!source) continue;
    const entry = migrated[source.subjectId];
    if (!entry) continue;
    const hasCombinedField = Object.hasOwn(entry, source.field);
    const theory = subjects.find((head) => head.id === source.subjectId);
    const highest = Number(entry.highest);
    const hasCombinedHighest = !migrated[subject.id] && theory &&
      highest > theory.defaultHighest && highest <= theory.defaultHighest + subject.defaultHighest;
    if (!hasCombinedField && !hasCombinedHighest) continue;

    if (migrated === marks) migrated = { ...marks };
    const { [source.field]: componentMark, ...theoryMarks } = entry;
    migrated[source.subjectId] = { ...theoryMarks, highest: "" };
    if (hasCombinedField) {
      const componentField = subject.fields[0].name;
      migrated[subject.id] = {
        ...migrated[subject.id],
        [componentField]: migrated[subject.id]?.[componentField] ?? componentMark,
      };
    }
  }
  return migrated;
}

/** Read the raw blob, migrating the old multi-profile format. Never throws. */
function read() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw);

    const legacy = localStorage.getItem(LEGACY_KEY);
    if (legacy) {
      const parsed = JSON.parse(legacy);
      const active = parsed?.profiles?.[parsed.activeProfileId];
      if (active?.data) {
        localStorage.setItem(KEY, JSON.stringify(active.data));
        return active.data;
      }
    }
  } catch (error) {
    console.warn("Could not read saved data, starting fresh:", error);
  }
  return {};
}

/** Build the app's initial state from storage. */
export function loadState() {
  const data = read();
  const hasSelection = data.batch && data.branch && data.semester;
  const selection = hasSelection
    ? { batch: data.batch, branch: data.branch, semester: String(data.semester) }
    : { batch: "", branch: "", semester: "" };

  const cgpa = emptyCgpa();
  for (let s = 1; s <= SEMESTERS; s++) {
    if (data.cgpa?.[s]) {
      cgpa[s - 1] = { sgpa: data.cgpa[s].sgpa || "", credits: data.cgpa[s].credits || "" };
    }
  }

  return {
    selection,
    committed: hasSelection ? selection : null,
    marks: data.marks || {},
    cgpa,
  };
}

/**
 * Persist the parts of state worth keeping. Marks belong to whichever selection
 * is loaded in the calculator (`committed`), so both are written together.
 */
export function saveState({ committed, marks, cgpa }) {
  const data = {
    batch: committed?.batch ?? null,
    branch: committed?.branch ?? null,
    semester: committed ? Number(committed.semester) : null,
    marks: committed ? marks : {},
    cgpa: cgpa.reduce((acc, row, i) => ({ ...acc, [i + 1]: row }), {}),
  };
  try {
    localStorage.setItem(KEY, JSON.stringify(data));
  } catch (error) {
    console.warn("Could not save data:", error);
  }
}
