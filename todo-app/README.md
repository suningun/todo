# TaskFlow

A minimalist, Notion-inspired task dashboard built with **React + TypeScript**. It
shows your tasks as a kanban board, lets you add, edit, and delete them, search
and filter, and track live statistics — all using **local React state only, with
no backend**.

## Features

- **Add tasks** with a **title**, a **status** (`To Do`, `In Progress`, or `Done`),
  and an optional **High priority** flag.
- **Kanban board** grouped into three columns: In Progress, To Do, Completed.
- **Full CRUD** — create, read, update, and delete tasks (see below).
- **Edit** any task, change its **status**, or toggle its **priority** at any time.
- **Search** tasks by title and **filter** by status and by priority.
- **Live statistics** — Total, In Progress, and Completed counts update instantly.
- **Username + account/profile section** — the signed-in user is shown in the top
  bar and in the sidebar profile section (avatar, username, and role).
- **Light / dark theme toggle** that is remembered between visits.
- **Mini calendar** and a rotating **Quote of the Day** in the side panel.
- **Responsive** layout with an off-canvas sidebar drawer on mobile.

## Tech Stack

| Tool | Purpose |
| --- | --- |
| [React 19](https://react.dev) | UI library |
| [TypeScript](https://www.typescriptlang.org) (strict) | Type-safe code |
| [Vite 8](https://vite.dev) | Dev server and build tool |
| [Tailwind CSS v4](https://tailwindcss.com) | Styling |
| [lucide-react](https://lucide.dev) | Icons |

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org) 20 or newer (includes `npm`)

### Install

```bash
npm install
```

### Run in development

```bash
npm run dev
```

Then open the printed URL (usually <http://localhost:5173>).

### Build and preview

```bash
npm run build     # type-checks, then builds to dist/
npm run preview    # serve the production build locally
```

### Other scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite dev server with hot reload |
| `npm run build` | Type-check (`tsc`) and build for production |
| `npm run preview` | Preview the production build |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Run TypeScript checks only (`tsc --noEmit`) |

## How the data works

Each task follows the `Todo` type in `src/types.ts`:

```ts
export type Status = "To Do" | "In Progress" | "Done";

export type Todo = {
  id: number;
  title: string;
  status: Status;
  priority: boolean;
  createdAt: string;
};
```

Every task therefore always has a **title** and a **status**, where the status is
one of `To Do`, `In Progress`, or `Done`.

### Full CRUD with local state (no backend)

All tasks live in a single `useState` array inside `src/App.tsx`. There is **no
server, database, or API** — the data resets when you refresh the page (only the
theme choice is saved to `localStorage`).

| Operation | How it works |
| --- | --- |
| **Create** | Click **Add Task** in a column, fill in the form, and submit — the task is appended to the list. |
| **Read** | The kanban board renders the tasks, grouped into their status columns. |
| **Update** | Click a card's edit icon to change its title/status/priority, or change status / toggle priority directly on the card. |
| **Delete** | Click a card's trash icon to remove the task. |

## Folder Structure

```
todo-app/
├─ public/
│  └─ favicon.svg            # App icon
├─ src/
│  ├─ components/
│  │  ├─ KanbanBoard.tsx     # Board with the three status columns
│  │  ├─ MiniCalendar.tsx    # Month calendar in the side panel
│  │  ├─ QuoteCard.tsx       # "Quote of the Day" card
│  │  ├─ Sidebar.tsx         # Navigation + account/profile section
│  │  ├─ StatCard.tsx        # Single statistic card
│  │  ├─ TaskCard.tsx        # One task card with its actions
│  │  ├─ TaskFilters.tsx     # Status tabs + priority filter
│  │  ├─ TaskModal.tsx       # Modal wrapper for the task form
│  │  ├─ TodoForm.tsx        # Add / edit task form
│  │  └─ Topbar.tsx          # Search, user info, theme toggle
│  ├─ App.tsx                # State, handlers, and page layout
│  ├─ index.css              # Tailwind import + theme setup
│  ├─ main.tsx               # React entry point
│  ├─ theme.ts               # Light/dark theme helpers
│  ├─ types.ts               # Shared Status / FilterValue / Todo types
│  └─ vite-env.d.ts          # Vite type declarations
├─ eslint.config.js
├─ index.html
├─ package.json
├─ tsconfig.json
└─ vite.config.js
```

## License

This project is for learning purposes.
