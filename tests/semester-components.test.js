import assert from "node:assert/strict";
import test from "node:test";
import { getSubjects } from "../src/subjects/index.js";
import { calcSubject, calcSgpa, predictEse } from "../src/core/gpa.js";
import { migrateSplitMarks } from "../src/core/storage.js";

// Credit and assessment totals from the semester schedules in the ten PDFs.
// Each list identifies courses with a separate 3-credit theory / 1-credit tutorial.
const schedules = {
  comp: {
    3: [23, 775, ["Integral Transform and Vector Calculus", "Discrete Mathematics"]],
    4: [24, 900, ["Probability, Statistics and Optimization Techniques", "Theory of Automata"]],
  },
  it: {
    3: [23, 825, ["Discrete and Applied Mathematics"]],
    4: [24, 800, ["Probability, Statistics and Optimization Techniques", "Information Theory and Coding"]],
  },
  aids: {
    3: [23, 825, ["Calculus, Linear Algebra and Discrete Mathematics"]],
    4: [24, 875, ["Statistics, Probability and Optimization Techniques"]],
  },
  csbs: {
    3: [24, 875, ["Statistical Methods and Probability", "Discrete Mathematics"]],
    4: [24, 925, []],
  },
  cce: {
    3: [23, 825, ["Discrete Mathematics and Graph Theory"]],
    4: [24, 875, ["Fundamentals of Signals and Systems"]],
  },
  ece: {
    3: [25, 900, ["Integral Transform and Vector Calculus", "Discrete Mathematics"]],
    4: [25, 950, ["Complex Analysis, Statistics and Optimization Techniques"]],
  },
  extc: {
    3: [23, 825, ["Mathematics for Communication Engineering"]],
    4: [24, 875, ["Signals and Systems"]],
  },
  vlsi: {
    3: [25, 925, ["Mathematics for Electronics Engineering-I"]],
    4: [24, 925, ["Mathematics for Electronics Engineering-II"]],
  },
  rai: {
    3: [23, 875, ["Calculus, Transforms and Optimization"]],
    4: [24, 950, []],
  },
  mech: {
    3: [23, 825, ["Mathematics for Mechanical Engineering - I"]],
    4: [24, 875, ["Mathematics for Mechanical Engineering - II"]],
  },
};

const maxMarks = (subject) =>
  Object.fromEntries(subject.fields.map(({ name, max }) => [name, String(max)]));

for (const [branch, semesters] of Object.entries(schedules)) {
  for (const [semester, [credits, marks, tutorialCourses]] of Object.entries(semesters)) {
    test(`${branch} semester ${semester}: credits, marks and independent tutorial heads match the PDF`, () => {
      const subjects = getSubjects(branch, Number(semester), "2025-2029");
      assert.ok(subjects);
      assert.equal(new Set(subjects.map(({ id }) => id)).size, subjects.length);
      assert.equal(subjects.reduce((sum, subject) => sum + subject.credits, 0), credits);
      assert.equal(subjects.reduce((sum, subject) => sum + subject.defaultHighest, 0), marks);
      assert.equal(subjects.filter(({ name }) => name.endsWith("(Tutorial)")).length, tutorialCourses.length);

      for (const subject of subjects) {
        assert.equal(subject.defaultHighest, subject.fields.reduce((sum, field) => sum + field.max, 0));
        assert.ok(!subject.fields.some(({ name }) => name === "tutorial") || subject.fields.length === 1);
      }
      for (const name of tutorialCourses) {
        const theory = subjects.find((subject) => subject.name === `${name} (Theory)`);
        const tutorial = subjects.find((subject) => subject.name === `${name} (Tutorial)`);
        assert.ok(theory, `${name} theory card is missing`);
        assert.ok(tutorial, `${name} tutorial card is missing`);
        assert.equal(theory.credits, 3);
        assert.equal(theory.defaultHighest, 100);
        assert.equal(tutorial.credits, 1);
        assert.equal(tutorial.defaultHighest, 25);
        // A failed tutorial remains failed even with perfect theory marks.
        assert.equal(calcSubject(theory, maxMarks(theory)).gradePoint, 10);
        assert.equal(calcSubject(tutorial, { tutorial: "9" }).gradePoint, 0);
        assert.equal(calcSubject(tutorial, { tutorial: "10" }).gradePoint, 4);
        assert.equal(calcSubject(tutorial, { tutorial: "26" }).valid, false);
      }

      const allMax = Object.fromEntries(subjects.map((subject) => [subject.id, maxMarks(subject)]));
      assert.equal(calcSgpa(subjects, allMax, semester).value, 10);
    });
  }
}

test("ITVC and Discrete Mathematics weight their grades separately, including a failed head", () => {
  const subjects = getSubjects("comp", 3, "2025-2029");
  for (const name of ["Integral Transform and Vector Calculus", "Discrete Mathematics"]) {
    const theory = subjects.find((subject) => subject.name === `${name} (Theory)`);
    const tutorial = subjects.find((subject) => subject.name === `${name} (Tutorial)`);
    const pair = [theory, tutorial];
    const marks = {
      [theory.id]: { ia: "20", mse: "30", ese: "50" },
      [tutorial.id]: { tutorial: "9" },
    };
    assert.equal(calcSgpa(pair, marks, 3).value, 7.5);
    marks[theory.id].ese = "20"; // 70/100 -> 9 points, tutorial 25/25 -> 10 points.
    marks[tutorial.id].tutorial = "25";
    assert.equal(calcSgpa(pair, marks, 3).value, 9.25);
    marks[theory.id] = { ia: "0", mse: "0", ese: "39" };
    assert.equal(calcSubject(theory, marks[theory.id]).gradePoint, 0);
    assert.equal(calcSgpa(pair, marks, 3).value, 2.5);
    assert.deepEqual(predictEse(theory, { ia: "20", mse: "30", tutorial: "25" }), {
      p10: { kind: "need", need: 30, max: 50, pointer: 10 },
      p9: { kind: "need", need: 20, max: 50, pointer: 9 },
    });
    assert.equal(predictEse(tutorial, { tutorial: "20" }), null);
  }
});

test("RAI MDM separates its three theory credits from its one laboratory credit", () => {
  const subjects = getSubjects("rai", 4, "2025-2029");
  const theory = subjects.find(({ name }) => name === "MDM Course 2 (Theory)");
  const lab = subjects.find(({ name }) => name === "MDM Course 2 Laboratory");
  assert.equal(theory.credits, 3);
  assert.equal(theory.defaultHighest, 100);
  assert.equal(lab.credits, 1);
  assert.equal(lab.defaultHighest, 50);
  assert.equal(calcSgpa([theory, lab], {
    [theory.id]: maxMarks(theory), [lab.id]: { lab: "19" },
  }, 4).value, 7.5);
});

test("CCE uses the detailed credit assignments when the summary totals are inconsistent", () => {
  const subjects = getSubjects("cce", 4, "2025-2029");
  assert.equal(subjects.find(({ name }) => name === "Principles of Data Science").credits, 3);
  assert.equal(subjects.find(({ name }) => name === "Fundamentals of Signals and Systems (Theory)").credits, 3);
  assert.equal(subjects.find(({ name }) => name === "Fundamentals of Signals and Systems (Tutorial)").credits, 1);
});

test("saved combined marks move into separate cards without overwriting newer entries", () => {
  const subjects = getSubjects("comp", 3, "2025-2029");
  const saved = {
    301: { ia: "18", mse: "25", ese: "42", tutorial: "19", highest: "120" },
    305: { ia: "15", mse: "20", ese: "30", tutorial: "22", highest: "125" },
    "305-tutorial": { tutorial: "10", highest: "24" },
    302: { ia: "20" },
  };
  const migrated = migrateSplitMarks(subjects, saved);
  assert.deepEqual(migrated[301], { ia: "18", mse: "25", ese: "42", highest: "" });
  assert.deepEqual(migrated["301-tutorial"], { tutorial: "19" });
  assert.deepEqual(migrated["305-tutorial"], saved["305-tutorial"]);
  assert.equal(migrated[302], saved[302]);
  assert.equal(saved[301].tutorial, "19");
  assert.equal(saved[301].highest, "120");
  assert.equal(migrateSplitMarks(subjects, migrated), migrated);
});

test("migration also handles a saved combined highest with no tutorial mark entered yet", () => {
  const subjects = getSubjects("comp", 3, "2025-2029");
  const saved = { 301: { ia: "18", highest: "125" } };
  assert.deepEqual(migrateSplitMarks(subjects, saved), { 301: { ia: "18", highest: "" } });
  const empty = {};
  assert.equal(migrateSplitMarks(subjects, empty), empty);
});

test("RAI's saved combined lab mark is transferred to the laboratory field", () => {
  const subjects = getSubjects("rai", 4, "2025-2029");
  const saved = { 406: { ia: "18", ise: "25", ese: "42", tutorial: "35", highest: "150" } };
  const migrated = migrateSplitMarks(subjects, saved);
  assert.deepEqual(migrated[406], { ia: "18", ise: "25", ese: "42", highest: "" });
  assert.deepEqual(migrated["406-lab"], { lab: "35" });
});
