// Subject data for Semester 1 (common for all branches - Batch 2025-2029)
export const semester1Subjects = [
  {
    id: 1,
    name: "Applied Mathematics – I (Theory)",
    credits: 3,
    fields: [
      { name: "ia", label: "Internal Assessment (IA)", max: 20 },
      { name: "mse", label: "Mid-Semester Exam (MSE)", max: 30 },
      { name: "ese", label: "End-Semester Exam (ESE)", max: 50 },
    ],
    defaultHighest: 100,
  },
  {
    id: 2,
    name: "Applied Mathematics – I (Tutorial)",
    credits: 1,
    fields: [{ name: "tutorial", label: "Tutorial CA", max: 25 }],
    defaultHighest: 25,
  },
  {
    id: 3,
    name: "Engineering Physics",
    credits: 2,
    fields: [
      { name: "ia", label: "Internal Assessment (IA)", max: 20 },
      { name: "mse", label: "Mid-Semester Exam (MSE)", max: 30 },
      { name: "ese", label: "End-Semester Exam (ESE)", max: 50 },
    ],
    defaultHighest: 100,
  },
  {
    id: 4,
    name: "Engineering Chemistry",
    credits: 2,
    fields: [
      { name: "ia", label: "Internal Assessment (IA)", max: 20 },
      { name: "mse", label: "Mid-Semester Exam (MSE)", max: 30 },
      { name: "ese", label: "End-Semester Exam (ESE)", max: 50 },
    ],
    defaultHighest: 100,
  },
  {
    id: 5,
    name: "Basic Electrical Engineering",
    credits: 2,
    fields: [
      { name: "ia", label: "Internal Assessment (IA)", max: 20 },
      { name: "mse", label: "Mid-Semester Exam (MSE)", max: 30 },
      { name: "ese", label: "End-Semester Exam (ESE)", max: 50 },
    ],
    defaultHighest: 100,
  },
  {
    id: 6,
    name: "Engineering Drawing",
    credits: 3,
    fields: [
      { name: "ia", label: "Internal Assessment (IA)", max: 20 },
      { name: "mse", label: "Mid-Semester Exam (MSE)", max: 30 },
      { name: "ese", label: "End-Semester Exam (ESE)", max: 50 },
    ],
    defaultHighest: 100,
  },
  {
    id: 7,
    name: "Biology for Engineers",
    credits: 2,
    fields: [{ name: "ca", label: "Continuous Assessment (CA)", max: 50 }],
    defaultHighest: 50,
  },
  {
    id: 8,
    name: "Structured Programming Methodology",
    credits: 3,
    fields: [
      { name: "lab", label: "Lab / Tutorial CA", max: 50 },
      { name: "practical", label: "Practical / Project / OR Exam", max: 50 },
    ],
    defaultHighest: 100,
  },
  {
    id: 9,
    name: "Applied Science Laboratory",
    credits: 1,
    fields: [{ name: "lab", label: "Lab Marks", max: 50 }],
    defaultHighest: 50,
  },
  {
    id: 10,
    name: "Basic Electrical Engineering Laboratory",
    credits: 1,
    fields: [{ name: "lab", label: "Lab Marks", max: 50 }],
    defaultHighest: 50,
  },
  {
    id: 11,
    name: "Engineering Drawing Laboratory",
    credits: 1,
    fields: [{ name: "lab", label: "Lab Marks", max: 50 }],
    defaultHighest: 50,
  },
  {
    id: 12,
    name: "Maker Space Laboratory – I",
    credits: 1,
    fields: [{ name: "lab", label: "Lab Marks", max: 50 }],
    defaultHighest: 50,
  },
];

// Semester 2 subjects for ALL branches - Batch 2025-2029
// Common subjects for all branches
export const semester2CommonSubjects = [
  {
    id: 201,
    name: "Applied Mathematics – II (Theory)",
    credits: 3,
    fields: [
      { name: "ia", label: "Internal Assessment (IA)", max: 20 },
      { name: "mse", label: "Mid-Semester Exam (MSE)", max: 30 },
      { name: "ese", label: "End-Semester Exam (ESE)", max: 50 },
    ],
    defaultHighest: 100,
  },
  {
    id: 211,
    name: "Applied Mathematics – II (Tutorial)",
    credits: 1,
    fields: [{ name: "tutorial", label: "Tutorial CA", max: 25 }],
    defaultHighest: 25,
  },
  {
    id: 203,
    name: "Digital Logic Design",
    credits: 3,
    fields: [
      { name: "ia", label: "Internal Assessment (IA)", max: 20 },
      { name: "mse", label: "Mid-Semester Exam (MSE)", max: 30 },
      { name: "ese", label: "End-Semester Exam (ESE)", max: 50 },
    ],
    defaultHighest: 100,
  },
  {
    id: 204,
    name: "Environmental Science",
    credits: 2,
    fields: [{ name: "ca", label: "Continuous Assessment (CA)", max: 50 }],
    defaultHighest: 50,
  },
  {
    id: 205,
    name: "Object-Oriented Programming Methodology",
    credits: 3,
    fields: [
      { name: "ca", label: "Continuous Assessment (CA)", max: 50 },
      { name: "practical", label: "Practical / OR Exam", max: 50 },
    ],
    defaultHighest: 100,
  },
  {
    id: 206,
    name: "Presentation and Communication Skills",
    credits: 2,
    fields: [{ name: "ca", label: "Continuous Assessment (CA)", max: 50 }],
    defaultHighest: 50,
  },
  {
    id: 207,
    name: "Applied Science Laboratory - II",
    credits: 1,
    fields: [{ name: "lab", label: "Lab CA", max: 50 }],
    defaultHighest: 50,
  },
  {
    id: 209,
    name: "Digital Logic Design Laboratory",
    credits: 1,
    fields: [{ name: "lab", label: "Lab CA", max: 50 }],
    defaultHighest: 50,
  },
  {
    id: 210,
    name: "Maker Space Laboratory – II",
    credits: 1,
    fields: [
      { name: "lab", label: "Lab CA", max: 50 },
      { name: "project", label: "Project Evaluation", max: 50 },
    ],
    defaultHighest: 100,
  },
];

// Branch-specific subject for Computer & Allied Programs
export const semester2Subject_ComputerAllied = {
  id: 202,
  name: "Applied Science for Computer & Allied Programs",
  credits: 3,
  fields: [
    { name: "ia", label: "Internal Assessment (IA)", max: 20 },
    { name: "mse", label: "Mid-Semester Exam (MSE)", max: 30 },
    { name: "ese", label: "End-Semester Exam (ESE)", max: 50 },
  ],
  defaultHighest: 100,
};

// Branch-specific subject for Electronics & Allied Programs
export const semester2Subject_ElectronicsAllied = {
  id: 202,
  name: "Applied Science for Electronics & Allied Programs",
  credits: 3,
  fields: [
    { name: "ia", label: "Internal Assessment (IA)", max: 20 },
    { name: "mse", label: "Mid-Semester Exam (MSE)", max: 30 },
    { name: "ese", label: "End-Semester Exam (ESE)", max: 50 },
  ],
  defaultHighest: 100,
};

// Branch-specific subjects for Mechanical & RAI Programs
export const semester2Subjects_MechRAI = [
  {
    id: 202,
    name: "Engineering Mechanics",
    credits: 3,
    fields: [
      { name: "ia", label: "Internal Assessment (IA)", max: 20 },
      { name: "mse", label: "Mid-Semester Exam (MSE)", max: 30 },
      { name: "ese", label: "End-Semester Exam (ESE)", max: 50 },
    ],
    defaultHighest: 100,
  },
  {
    id: 208,
    name: "Engineering Mechanics Laboratory",
    credits: 1,
    fields: [{ name: "lab", label: "Lab CA", max: 50 }],
    defaultHighest: 50,
  },
];
