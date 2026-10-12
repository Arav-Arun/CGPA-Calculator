# 2025–2029 semester 3 and 4 syllabus audit

## How the course data is interpreted

The semester **Teaching and Credit Scheme** and **Evaluation Scheme** are the
primary sources. Some detailed course pages repeat older or inconsistent schemes.
Assessment maxima follow the semester evaluation tables when those pages conflict.
Credit assignments use the TH–PR–TUT components; inconsistent total cells are
checked against the detailed course tables and the semester credit total.

A theory course with a tutorial has **two grading heads**:

- Theory: 3 credits, IA 20 + MSE/ISE 30 + ESE 50 = 100 marks.
- Tutorial: 1 credit, Tutorial CA 25 marks.

Each head has its own card, grade point, highest-mark denominator and credit
contribution. The tutorial cannot raise the theory grade or compensate for a
failed theory head, and vice versa. This matches the existing semester 1/2 pattern.
The existing grade scale gives 0 points below 40% for each head independently.

RAI semester 4 MDM Course 2 is also separated into 3 theory credits (100 marks)
and 1 laboratory credit (Lab CA 50 marks).

The IT/AIDS programming lab courses that have both practical and tutorial credits
retain their joint Lab/Tutorial CA assessment. Their PDFs describe a shared lab
course assessment, without separate lab and tutorial mark allocations. Credits
are not split into invented assessment maxima.

## Theory/tutorial heads checked

| Branch | Semester 3 | Semester 4 |
| --- | --- | --- |
| Computer | Integral Transform and Vector Calculus; Discrete Mathematics | Probability, Statistics and Optimization Techniques; Theory of Automata |
| IT | Discrete and Applied Mathematics | Probability, Statistics and Optimization Techniques; Information Theory and Coding |
| AI & DS | Calculus, Linear Algebra and Discrete Mathematics | Statistics, Probability and Optimization Techniques |
| CSBS | Statistical Methods and Probability; Discrete Mathematics | None |
| CCE | Discrete Mathematics and Graph Theory | Fundamentals of Signals and Systems |
| Electronics & Computer (EXCP) | Integral Transform and Vector Calculus; Discrete Mathematics | Complex Analysis, Statistics and Optimization Techniques |
| EXTC | Mathematics for Communication Engineering | Signals and Systems |
| VLSI | Mathematics for Electronics Engineering-I | Mathematics for Electronics Engineering-II |
| RAI | Calculus, Transforms and Optimization | MDM theory/laboratory split described above |
| Mechanical | Mathematics for Mechanical Engineering-I | Mathematics for Mechanical Engineering-II |

This produces 23 separate tutorial heads and one additional RAI MDM laboratory
head. Combined course marks already saved in the calculator are migrated to the
new cards; combined highest-total overrides reset to the separate defaults.

## CCE credit correction

In semester 4, the summary total cells assign 4 credits to Data Science despite
TH–PR–TUT = 3–0–0, and 3 credits to Signals and Systems despite 3–0–1.
The detailed tables on PDF pages 37 and 46 explicitly assign 3 and 4 credits,
respectively. The calculator therefore uses Data Science 3, Signals theory 3,
Signals tutorial 1. The semester total remains 24 credits.

## Source files and semester totals

Page numbers below are physical PDF pages, counting the cover as page 1.
Marks exclude basket courses, whose individual choices and credits
are not specified in these semester tables.

| Branch | PDF | Semester schedule pages | Sem 3 credits / marks | Sem 4 credits / marks |
| --- | --- | --- | --- | --- |
| Computer | `V13_SYB Tech SVU R-2025_SemIIIandIV_without WK_CO_PO_MDM_Aug_11_2026.pdf` | 11–12 | 23 / 775 | 24 / 900 |
| IT | `SYIT_Syllabus SVU 2025.pdf` | 11, 13 | 23 / 825 | 24 / 800 |
| AI & DS | `SY AIDS Syllabus SVU-2025.pdf` | 11–12 | 23 / 825 | 24 / 875 |
| CSBS | `SY CSBS_SVU2025.pdf` | 9–12 | 24 / 875 | 24 / 925 |
| CCE | `27May26_SY B.Tech CCE SVU2025_withoutCO-PO mapping.pdf` | 12–13 | 23 / 825 | 24 / 875 |
| EXCP | `SY EXCP_SVU2025.pdf` | 9–12 | 25 / 900 | 25 / 950 |
| EXTC | `SY B.Tech EXTC SVU2025_without CO-PO mapping_Final.pdf` | 12–13 | 23 / 825 | 24 / 875 |
| VLSI | `SY VLSI_SVU2025.pdf` | 9–12 | 25 / 925 | 24 / 925 |
| RAI | `SYBTECH (RAI) SVU R-2025_R3_28.4.26.pdf` | 17–18 | 23 / 875 | 24 / 950 |
| Mechanical | `SY B.Tech_MECH (SVU 2025) Syllabus_28.04.2026.pdf` | 16–17 | 23 / 825 | 24 / 875 |

## Recheck

`node --test tests/semester-components.test.js` checks all 20 branch/semester
combinations, including credit totals, assessment totals, missing/duplicate heads,
separate failure boundaries, weighted SGPA, ESE predictions and saved-mark
migration. `npm run build` checks the production bundle.
