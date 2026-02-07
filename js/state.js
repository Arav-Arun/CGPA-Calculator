/**
 * State Management
 * Handles global state for selections and marks.
 */

// Initial State
let state = {
  selectedBranch: null,
  selectedSemester: null,
  selectedBatch: null,
  currentSubjects: [],
  gradePoints: {},
};

export const getState = () => state;

export const setState = (newState) => {
  state = { ...state, ...newState };
};

export const updateGradePoint = (subjectId, gp) => {
  state.gradePoints[subjectId] = gp;
};

export const resetState = () => {
  state = {
    selectedBranch: null,
    selectedSemester: null,
    selectedBatch: null,
    currentSubjects: [],
    gradePoints: {},
  };
};

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
