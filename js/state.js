/**
 * State Management
 *
 * A simple in-memory store that holds all the data the app needs:
 *   - Which batch, branch, and semester the user picked
 *   - The list of subjects for that combination
 *   - Calculated grade points for each subject
 */

// The app-wide state object
let state = {
  selectedBranch: null,
  selectedSemester: null,
  selectedBatch: null,
  currentSubjects: [],
  gradePoints: {},
};

// Read the current state
export const getState = () => state;

// Merge new values into the state (shallow merge)
export const setState = (newState) => {
  state = { ...state, ...newState };
};

// Store the grade point for a specific subject
export const updateGradePoint = (subjectId, gp) => {
  state.gradePoints[subjectId] = gp;
};

// Clear everything back to defaults
export const resetState = () => {
  state = {
    selectedBranch: null,
    selectedSemester: null,
    selectedBatch: null,
    currentSubjects: [],
    gradePoints: {},
  };
};

// Individual setters for selections
export const setSelectedBatch = (batch) => {
  state.selectedBatch = batch;
};
export const setSelectedBranch = (branch) => {
  state.selectedBranch = branch;
};
export const setSelectedSemester = (sem) => {
  state.selectedSemester = sem;
};
export const setCurrentSubjects = (subjects) => {
  state.currentSubjects = subjects;
};
