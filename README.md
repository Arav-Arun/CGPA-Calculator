# 🎓 KJSSE CGPA Calculator

![KJSCE CGPA Calculator Logo](./public/assets/banner.png)

A **minimal**, **intuitive**, and **responsive** web-based calculator built to help **KJSSE students** easily compute their **CGPA** and **SGPA** based on semester grades and credits.

---

## Features

- **Dynamic Subject Selection:** Automatically populates subjects based on selected Batch, Branch, and Semester.
- **SGPA Calculation:** Calculates Semester Grade Point Average based on marks and credits.
- **Overall CGPA Calculation:** Calculates Cumulative Grade Point Average across multiple semesters.
- **Mobile Optimized:** Fully responsive design that works seamlessly on all devices.
- **Modern UI:** Features a dark mode aesthetic with a subtle grid background and glassmorphism effects.
- **Privacy Focused:** All calculations are done locally in your browser. No data is sent to any server.

---

## Tech Stack

- **React 18** — component-based UI
- **Vite** — dev server and build tooling
- **canvas-confetti** — the 9+ pointer celebration 🎉

The app is a static single-page app: `vite build` emits plain HTML/CSS/JS to `dist/`, deployable anywhere (currently Vercel).

## Development

```bash
npm install      # install dependencies
npm run dev      # start the dev server (http://localhost:5173)
npm run build    # production build → dist/
npm run preview  # preview the production build locally
```

### Project structure

```
index.html            # Vite entry (SEO meta lives here)
public/               # static assets served as-is (icons, manifest, robots, sitemap)
src/
  main.jsx            # React entry point
  App.jsx             # screen routing, state, persistence
  components/         # SelectionScreen, SgpaScreen, SubjectCard, CgpaScreen, ...
  lib/                # grading.js (pure math), storage.js, confetti.js
  data/               # subject catalog + dropdown options
  styles/             # global CSS
```

### Adding a new batch or semester

1. Add a data file under `src/data/` (e.g. `batch-2026-2030.js`).
2. Import its subject arrays in `src/data/subjects.js`.
3. Add a matching entry to the `CATALOG` map there.

---

## Disclaimer :

This is a **personal project** by me.  
It is **not affiliated with KJSSE**, and results are **approximate** — intended for **reference and guidance only**.
