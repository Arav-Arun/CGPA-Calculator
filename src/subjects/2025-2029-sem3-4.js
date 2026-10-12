// Semester 3 and 4 subject data for the 2025-2029 batch.
// Course names, credits, and assessment maxima follow the branch SVU-2025
// syllabus documents (semester schedules effective from 2026-2027).
// Source choices and component audit: docs/2025-2029-sem3-4-syllabus-audit.md.

const theory = (
  id,
  name,
  credits,
  { ia = 20, mse = 30, practical = 0, ese = 50, midSemName = "mse" } = {},
) => {
  const fields = [];
  if (ia) fields.push({ name: "ia", label: "Internal Assessment (IA)", max: ia });
  if (mse) {
    fields.push({
      name: midSemName,
      label: midSemName === "ise"
        ? "In-Semester Exam (ISE)"
        : mse === 60
          ? "Mid-Semester Exams (2 × 30)"
          : "Mid-Semester Exam (MSE)",
      max: mse,
    });
  }
  if (practical) {
    fields.push({ name: "practical", label: "Oral/Practical Exam (OR/PR)", max: practical });
  }
  if (ese) fields.push({ name: "ese", label: "End-Semester Exam (ESE)", max: ese });

  return {
    id,
    name,
    credits,
    fields,
    defaultHighest: fields.reduce((total, field) => total + field.max, 0),
  };
};

const lab = (id, name, credits, { ca = 50, practical = 0, caLabel = "Lab CA" } = {}) => {
  const fields = [{ name: "lab", label: caLabel, max: ca }];
  if (practical) {
    fields.push({ name: "practical", label: "Oral/Practical Exam (OR/PR)", max: practical });
  }
  return {
    id,
    name,
    credits,
    fields,
    defaultHighest: fields.reduce((total, field) => total + field.max, 0),
  };
};

// Theory and tutorial are separate credit-bearing grading heads, even when
// the syllabus prints their assessments together in a 125-mark course row.
const theoryWithTutorial = (id, name, options) => [
  theory(id, `${name} (Theory)`, 3, options),
  {
    id: `${id}-tutorial`,
    name: `${name} (Tutorial)`,
    credits: 1,
    fields: [{ name: "tutorial", label: "Tutorial CA", max: 25 }],
    defaultHighest: 25,
    legacyCombined: { subjectId: id, field: "tutorial" },
  },
];

const mdmTwoMse = (id, name) => theory(id, name, 3, { ia: 40, mse: 60, ese: 0 });

// Computer Engineering
export const semester3Subjects_COMP_2025 = [
  ...theoryWithTutorial(301, "Integral Transform and Vector Calculus"),
  theory(302, "Data Structures", 3),
  theory(303, "Database Management Systems", 3),
  theory(304, "Computer Organization and Architecture", 3),
  ...theoryWithTutorial(305, "Discrete Mathematics"),
  theory(306, "MDM Course 1", 3, { ese: 0 }),
  lab(307, "Data Structures Laboratory", 1),
  lab(308, "Database Management Systems Laboratory", 1),
  lab(309, "Web Development Laboratory", 1, { ca: 50, practical: 25, caLabel: "Lab/Tutorial CA" }),
];

export const semester4Subjects_COMP_2025 = [
  ...theoryWithTutorial(401, "Probability, Statistics and Optimization Techniques"),
  theory(402, "Analysis of Algorithms", 3),
  theory(403, "Operating Systems: Concepts & Design Principles", 3),
  theory(404, "Software Engineering", 2),
  ...theoryWithTutorial(405, "Theory of Automata"),
  theory(406, "MDM Course 2", 3),
  lab(407, "Analysis of Algorithms Laboratory", 1),
  lab(408, "Operating Systems: Concepts & Design Principles Laboratory", 1, { ca: 25, practical: 25 }),
  lab(409, "Software Engineering Laboratory", 1, { ca: 25, practical: 25 }),
  lab(410, "Full Stack Development", 1, { caLabel: "Lab/Tutorial CA" }),
  lab(411, "MDM Course 2 Laboratory", 1),
];

// Robotics and Artificial Intelligence
export const semester3Subjects_RAI_2025 = [
  ...theoryWithTutorial(301, "Calculus, Transforms and Optimization", { midSemName: "ise" }),
  theory(302, "Mechanics of Materials", 3, { midSemName: "ise" }),
  theory(303, "Data Structures and Algorithms", 3, { midSemName: "ise" }),
  theory(304, "Hydraulic and Pneumatic Systems", 2, { midSemName: "ise" }),
  theory(305, "Manufacturing Processes", 3, { midSemName: "ise" }),
  theory(306, "MDM Course 1", 3, { midSemName: "ise" }),
  lab(307, "Modelling and Simulation Laboratory", 1),
  lab(308, "Mechanics of Materials Laboratory", 1),
  lab(309, "Data Structures and Algorithms Laboratory", 1, { ca: 25, practical: 25 }),
  lab(310, "Hydraulic and Pneumatic Systems Laboratory", 1),
  lab(311, "Manufacturing Processes Laboratory", 1),
];

export const semester4Subjects_RAI_2025 = [
  theory(401, "Engineering Elements Design", 3, { midSemName: "ise" }),
  theory(402, "Mechanics of Machines", 3, { midSemName: "ise" }),
  theory(403, "Mechatronics", 3, { midSemName: "ise" }),
  theory(404, "Analog Electronics", 2, { midSemName: "ise" }),
  theory(405, "Introduction to Artificial Intelligence", 3, { midSemName: "ise" }),
  theory(406, "MDM Course 2 (Theory)", 3, { midSemName: "ise" }),
  {
    ...lab("406-lab", "MDM Course 2 Laboratory", 1),
    legacyCombined: { subjectId: 406, field: "tutorial" },
  },
  lab(407, "Engineering Elements Design Laboratory", 1),
  lab(408, "Mechanics of Machines Laboratory", 1),
  lab(409, "Mechatronics Laboratory", 1),
  lab(410, "Analog Electronics Laboratory", 1),
  lab(411, "Introduction to Artificial Intelligence Laboratory", 1),
  lab(412, "Python SQL Laboratory", 1, { ca: 25, practical: 25, caLabel: "Lab/Tutorial CA" }),
];

// Electronics and Telecommunication Engineering
export const semester3Subjects_EXTC_2025 = [
  ...theoryWithTutorial(301, "Mathematics for Communication Engineering"),
  theory(302, "Basic Electronic Circuits", 3),
  theory(303, "Data Structures and Algorithms", 3),
  theory(304, "Microprocessor and Microcontroller", 3),
  theory(305, "Electrical Networks", 3),
  mdmTwoMse(306, "Multidisciplinary Minor Course 1"),
  lab(307, "Digital Design with HDL Laboratory", 1),
  lab(308, "Basic Electronic Circuits Laboratory", 1),
  lab(309, "Data Structures and Algorithms Laboratory", 1, { ca: 25, practical: 25 }),
  lab(310, "Microprocessor and Microcontroller Laboratory", 1, { ca: 25, practical: 25 }),
];

export const semester4Subjects_EXTC_2025 = [
  theory(401, "Probability, Statistics and Optimization Techniques", 3),
  theory(402, "Analog Electronics", 3),
  theory(403, "Communication Systems", 3),
  ...theoryWithTutorial(404, "Signals and Systems"),
  theory(405, "Electromagnetic Field Theory", 3),
  mdmTwoMse(406, "Multidisciplinary Minor Course 2"),
  lab(407, "Probability, Statistics and Optimization Techniques Laboratory", 1),
  lab(408, "Analog Electronics Laboratory", 1, { ca: 25, practical: 25 }),
  lab(409, "Communication Systems Laboratory", 1),
  lab(410, "Advanced Microcontroller Laboratory", 1),
  lab(411, "Multidisciplinary Minor Laboratory", 1),
];

// Artificial Intelligence and Data Science
export const semester3Subjects_AIDS_2025 = [
  ...theoryWithTutorial(301, "Calculus, Linear Algebra and Discrete Mathematics"),
  theory(302, "Data Structures", 3),
  theory(303, "Database Management Systems", 3),
  theory(304, "Fundamentals of Data Science", 3),
  theory(305, "Fundamentals of Computer Organization and Architecture", 2),
  mdmTwoMse(306, "Multidisciplinary Minor Course 1"),
  lab(307, "Programming Laboratory", 2, { ca: 25, practical: 25, caLabel: "Lab/Tutorial CA" }),
  lab(308, "Data Structures Laboratory", 1),
  lab(309, "Database Management Systems Laboratory", 1),
  lab(310, "Fundamentals of Data Science Laboratory", 1),
];

export const semester4Subjects_AIDS_2025 = [
  ...theoryWithTutorial(401, "Statistics, Probability and Optimization Techniques"),
  theory(402, "Artificial Intelligence", 3),
  theory(403, "Analysis of Algorithms", 3),
  theory(404, "Operating Systems", 3),
  theory(405, "Computer Network and Information Security", 3),
  mdmTwoMse(406, "Multidisciplinary Minor Course 2"),
  lab(407, "Data Visualization Laboratory", 1, { ca: 25, practical: 25, caLabel: "Lab/Tutorial CA" }),
  lab(408, "Artificial Intelligence Laboratory", 1),
  lab(409, "Analysis of Algorithms Laboratory", 1),
  lab(410, "Operating Systems Laboratory", 1),
  lab(411, "Multidisciplinary Minor Course 2 Laboratory", 1),
];

// Mechanical Engineering
export const semester3Subjects_MECH_2025 = [
  ...theoryWithTutorial(301, "Mathematics for Mechanical Engineering - I"),
  theory(302, "Strength of Materials", 3),
  theory(303, "Material Science and Metallurgy", 3),
  theory(304, "Production Engineering - I", 3),
  theory(305, "Thermodynamics", 3),
  theory(306, "MDM Course 1", 3),
  lab(307, "Fundamentals of Data Structures", 1, { ca: 25, practical: 25, caLabel: "Lab/Tutorial CA" }),
  lab(308, "Heat Treatment and Material Testing Laboratory", 1),
  lab(309, "Production Engineering - I Laboratory", 1),
  lab(310, "Machine Shop Practice - I", 1),
];

export const semester4Subjects_MECH_2025 = [
  ...theoryWithTutorial(401, "Mathematics for Mechanical Engineering - II"),
  theory(402, "Theory of Machines-I", 3),
  theory(403, "Fluid Mechanics", 3),
  theory(404, "Production Engineering - II", 3),
  theory(405, "Heat and Mass Transfer", 3),
  theory(406, "MDM Course 2", 3),
  lab(407, "Theory of Machines-I Laboratory", 1, { ca: 25, practical: 25, caLabel: "Lab/Tutorial CA" }),
  lab(408, "Thermal and Fluids Laboratory", 1),
  lab(409, "Computer Aided Machine Drawing Laboratory", 1),
  lab(410, "Machine Shop Practice - II", 1),
  lab(411, "MDM Course 2 Laboratory", 1),
];

// Electronics Engineering (VLSI Design & Technology)
export const semester3Subjects_VLSI_2025 = [
  ...theoryWithTutorial(301, "Mathematics for Electronics Engineering-I"),
  theory(302, "System Design using FPGA", 3),
  theory(303, "Electronic Devices and Circuits", 3),
  theory(304, "Signals and Systems", 3),
  theory(305, "Electrical Networks and Analysis", 3),
  mdmTwoMse(306, "Multidisciplinary Minor Course 1"),
  lab(307, "Python Programming Laboratory", 2, { ca: 50, practical: 50, caLabel: "Lab/Tutorial CA" }),
  lab(308, "Data Structures Programming Laboratory", 1),
  lab(309, "Electronic Devices and Circuits Laboratory", 1, { ca: 25, practical: 25 }),
  lab(310, "Network, Signals and Systems Laboratory", 1),
  lab(311, "System Design using FPGA Laboratory", 1),
];

export const semester4Subjects_VLSI_2025 = [
  ...theoryWithTutorial(401, "Mathematics for Electronics Engineering-II"),
  theory(402, "Computer Organization and Architecture", 3),
  theory(403, "Analog Circuit Design", 3),
  theory(404, "Microprocessor and Microcontroller", 3),
  theory(405, "Analog and Digital Communication", 3),
  mdmTwoMse(406, "Multidisciplinary Minor Course 2"),
  lab(407, "Introduction to Electronic Design Automation Laboratory", 1, { ca: 100 }),
  lab(408, "Analog and Digital Communication Laboratory", 1),
  lab(409, "Analog Circuit Design Laboratory", 1, { ca: 25, practical: 25 }),
  lab(410, "Microprocessor and Microcontroller Laboratory", 1, { ca: 25, practical: 25 }),
  lab(411, "Multidisciplinary Minor Laboratory", 1),
];

// Computer Science and Business Systems
export const semester3Subjects_CSBS_2025 = [
  ...theoryWithTutorial(301, "Statistical Methods and Probability"),
  theory(302, "Data Structures", 3),
  theory(303, "Computer Organization and Architecture", 3),
  theory(304, "Fundamentals of Economics", 3),
  ...theoryWithTutorial(305, "Discrete Mathematics"),
  mdmTwoMse(306, "Multidisciplinary Minor Course 1"),
  lab(307, "Python Programming Laboratory", 2, { ca: 50, practical: 50, caLabel: "Lab/Tutorial CA" }),
  lab(308, "Data Structures Laboratory", 1),
  lab(309, "Business Communication and Value Science", 1, { ca: 50, practical: 25, caLabel: "Lab/Tutorial CA" }),
];

export const semester4Subjects_CSBS_2025 = [
  theory(401, "Linear Algebra and Optimization", 3),
  theory(402, "Analysis of Algorithms", 3),
  theory(403, "Database Management Systems", 3),
  theory(404, "Fundamentals of Management and Business Strategy", 3),
  theory(405, "Object Oriented Software Engineering", 3),
  mdmTwoMse(406, "Multidisciplinary Minor Course 2"),
  lab(407, "Web Development Laboratory", 1, { ca: 50, practical: 25, caLabel: "Lab/Tutorial CA" }),
  lab(408, "Analysis of Algorithms Laboratory", 1),
  lab(409, "Database Management Systems Laboratory", 1),
  lab(410, "Linear Algebra and Optimization Laboratory", 1),
  lab(411, "Object Oriented Software Engineering Laboratory", 1, { ca: 25, practical: 25 }),
  lab(412, "Multidisciplinary Minor Laboratory", 1),
];

// Electronics and Computer Engineering (EXCP)
export const semester3Subjects_EXCP_2025 = [
  ...theoryWithTutorial(301, "Integral Transform and Vector Calculus"),
  theory(302, "Data Structures", 3),
  theory(303, "Analog Electronic Circuits", 3),
  theory(304, "Networks, Signals and Systems", 3),
  ...theoryWithTutorial(305, "Discrete Mathematics"),
  mdmTwoMse(306, "Multidisciplinary Minor Course 1"),
  lab(307, "Python Programming Lab", 2, { ca: 50, practical: 50, caLabel: "Lab/Tutorial CA" }),
  lab(308, "Data Structures Laboratory", 1),
  lab(309, "Analog Electronic Circuit Laboratory", 1, { ca: 25, practical: 25 }),
  lab(310, "Networks, Signals and Systems Laboratory", 1),
];

export const semester4Subjects_EXCP_2025 = [
  ...theoryWithTutorial(401, "Complex Analysis, Statistics and Optimization Techniques"),
  theory(402, "Analysis of Algorithms", 3),
  theory(403, "Database Management Systems", 3),
  theory(404, "Microprocessor and Microcontroller", 3),
  theory(405, "Analog and Digital Communication", 3),
  mdmTwoMse(406, "Multidisciplinary Minor Course 2"),
  lab(407, "Web Development Laboratory", 1, { ca: 50, practical: 25, caLabel: "Lab/Tutorial CA" }),
  lab(408, "Analysis of Algorithms Laboratory", 1),
  lab(409, "Database Management Systems Laboratory", 1),
  lab(410, "Microprocessor and Microcontroller Laboratory", 1, { ca: 25, practical: 25 }),
  lab(411, "Analog and Digital Communication Laboratory", 1),
  lab(412, "Multidisciplinary Minor Course 2 Laboratory", 1),
];

// Information Technology
export const semester3Subjects_IT_2025 = [
  ...theoryWithTutorial(301, "Discrete and Applied Mathematics"),
  theory(302, "Data Structures", 3),
  theory(303, "Database Management Systems", 3),
  theory(304, "Data Communication and Networking", 3),
  theory(305, "Fundamentals of Computer Organization and Architecture", 2),
  mdmTwoMse(306, "Multidisciplinary Minor Course 1"),
  lab(307, "Programming Laboratory", 2, { ca: 25, practical: 25, caLabel: "Lab/Tutorial CA" }),
  lab(308, "Data Structures Laboratory", 1),
  lab(309, "Database Management Systems Laboratory", 1),
  lab(310, "Data Communication and Networking Laboratory", 1),
];

export const semester4Subjects_IT_2025 = [
  ...theoryWithTutorial(401, "Probability, Statistics and Optimization Techniques"),
  ...theoryWithTutorial(402, "Information Theory and Coding"),
  theory(403, "Analysis of Algorithms", 3),
  theory(404, "Fundamentals of Software Engineering", 3),
  mdmTwoMse(405, "Multidisciplinary Minor Course 2"),
  lab(406, "Competitive Programming Laboratory", 2, { caLabel: "Lab/Tutorial CA" }),
  lab(407, "Web Programming I Laboratory", 2, { ca: 25, practical: 25, caLabel: "Lab/Tutorial CA" }),
  lab(408, "Analysis of Algorithms Laboratory", 1),
  lab(409, "Fundamentals of Software Engineering Laboratory", 1),
  lab(410, "Multidisciplinary Minor Course 2 Laboratory", 1),
];

// Computer and Communication Engineering
export const semester3Subjects_CCE_2025 = [
  ...theoryWithTutorial(301, "Discrete Mathematics and Graph Theory"),
  theory(302, "Data Structures", 3),
  theory(303, "Electronic Circuits and Applications", 3),
  theory(304, "Microcontrollers and Interfacing", 3, { practical: 50, ese: 0 }),
  theory(305, "Database Management System", 3),
  mdmTwoMse(306, "Multidisciplinary Minor Course 1"),
  lab(307, "Database Management System Laboratory", 1),
  lab(308, "Data Structures Laboratory", 1),
  lab(309, "Electronic Circuits and Applications Laboratory", 1),
  lab(310, "Microcontrollers and Interfacing Laboratory", 1),
];

export const semester4Subjects_CCE_2025 = [
  // The summary's total-credit cells for these two courses are swapped.
  // Use TH-PR-TUT and the detailed course tables: Data Science 3, Signals 3+1.
  theory(401, "Principles of Data Science", 3),
  theory(402, "Analysis of Algorithms", 3),
  theory(403, "RF Fundamentals and Applications", 3),
  ...theoryWithTutorial(404, "Fundamentals of Signals and Systems"),
  theory(405, "Operating Systems", 3),
  mdmTwoMse(406, "Multidisciplinary Minor Course 2"),
  lab(407, "Principles of Data Science Laboratory", 1),
  lab(408, "Analysis of Algorithms Laboratory", 1),
  lab(409, "RF Fundamentals and Applications Laboratory", 1),
  lab(410, "Web Programming Laboratory", 1, { ca: 25, practical: 25, caLabel: "Lab/Tutorial CA" }),
  lab(411, "Multidisciplinary Minor Laboratory", 1),
];
