# prj-diff-ui

A React app for exploring project differences (PRJ011 vs PRJ012): summary stats, patient profile changes (field-level diff), narrative subjects, and patient list comparison. Built with Vite, TypeScript, and Tailwind CSS.

---

## Prerequisites

- **Node.js** 18+ (20+ recommended). Check: `node -v`
- **npm** (comes with Node). Check: `npm -v`

---

## Run locally

### 1. Clone and install

```bash
git clone https://github.com/vkonsult/prj-diff-ui.git
cd prj-diff-ui
npm install
```

### 2. Start the dev server

```bash
npm run dev
```

Then open **http://localhost:5173** in your browser. Vite may use a different port (e.g. 5174) if 5173 is in use; the terminal will show the URL.

### 3. Build for production

```bash
npm run build
```

Output goes to `dist/`. Preview the production build:

```bash
npm run preview
```

---

## Scripts

| Command           | Description                    |
|-------------------|--------------------------------|
| `npm run dev`     | Start Vite dev server (HMR)    |
| `npm run build`   | Type-check + production build   |
| `npm run preview` | Serve `dist/` locally          |
| `npm run lint`    | Run ESLint                     |

---

## Tech stack

- **React 19** + **TypeScript**
- **Vite 7** – dev server and build
- **Tailwind CSS 3** – styling (PostCSS + Autoprefixer)
- **lucide-react** – icons

---

## Project structure (for developers)

```
prj-diff-ui/
├── index.html              # Entry HTML
├── package.json
├── vite.config.ts          # Vite config
├── tailwind.config.js      # Tailwind content & theme
├── postcss.config.js       # PostCSS (Tailwind + Autoprefixer)
├── tsconfig.json           # TypeScript (references app + node configs)
├── tsconfig.app.json       # App TS config
├── tsconfig.node.json      # Node/Vite config TS
├── eslint.config.js        # ESLint
├── public/                 # Static assets
└── src/
    ├── main.tsx            # React mount + global CSS import
    ├── index.css            # Tailwind directives (@tailwind base/components/utilities)
    ├── App.tsx              # Root component (renders SubjectDiffApp)
    ├── App.css              # Unused / minimal
    ├── SubjectDiffApp.tsx   # Main app: state, tabs, layout
    ├── types.ts             # Shared types (ChangeType, SubjectRow, DiffCell, FilterParams)
    ├── constants.ts         # Mock data (SUBJECTS, SUMMARY, COLS, colors)
    ├── utils.ts             # Pure helpers (norm, isChanged, filterRows, computeDiff)
    └── components/
        ├── Header.tsx       # App header, breadcrumb, tabs (Summary / Diff / PatientList / Narrative)
        ├── SummaryTab.tsx   # Overall summary + top subjects table
        ├── DiffTab.tsx      # Filters, subject list, diff detail, column picker
        ├── NarrativeTab.tsx # Narrative difference view
        ├── PatientListTab.tsx # Patient list placeholder
        ├── Pill.tsx         # Change-type badge (Added/Removed/Modified/Unchanged)
        ├── SectionTitle.tsx # Section heading with icon
        ├── Switch.tsx       # Toggle control
        ├── DiffRow.tsx      # Single diff row (column, PRJ011, PRJ012) with cell highlights
        ├── Popover.tsx      # Modal overlay
        ├── ColumnPicker.tsx # Column selection popover
        ├── NarrativeIcon.tsx # FileText icon for subjects with narrative (opens Narrative tab)
        └── Footer.tsx       # Legend (Added / Modified / Removed)
```

- **State** lives in `SubjectDiffApp.tsx`; tabs and lists receive props and callbacks.
- **Data** is mock only (`constants.ts`); replace with API calls when wiring to a backend.
- **Styling** is Tailwind utility classes; no CSS modules. Theme colors (e.g. `NAVY`, `ORANGE`) are in `constants.ts`.

---

## Configuration notes

- **Tailwind**: Content paths in `tailwind.config.js` are `./index.html` and `./src/**/*.{js,ts,jsx,tsx}`. Add any new template paths there if you add HTML or new entry extensions.
- **TypeScript**: Strict mode via `tsconfig.app.json`. Path aliases can be added in `vite.config.ts` and `tsconfig.app.json` if you introduce `@/` or similar.
- **ESLint**: Current config targets React + TypeScript. To use type-aware rules, see the [TypeScript ESLint docs](https://typescript-eslint.io/) and extend with `tseslint.configs.recommendedTypeChecked` and a `parserOptions.project` pointing at your tsconfigs.

---

## Git

- Default branch: `main`
- Remote: `origin` → `https://github.com/vkonsult/prj-diff-ui.git`
- After making changes: `git add -A`, `git commit -m "..."`, then `git push` (ensure Git Credential Manager or GitHub CLI is set up for auth).

---

## Optional: run in Cursor/VS Code

1. Open the folder: **File → Open Folder** → `prj-diff-ui`
2. Use the integrated terminal (**Ctrl+`**) for `npm run dev`, `npm run build`, etc.
3. A workspace file `Patient Diff.code-workspace` is included if you use multi-root workspaces.
