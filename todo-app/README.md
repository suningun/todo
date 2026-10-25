# TaskFlow

A minimalist, Notion-inspired task dashboard built with **React + TypeScript**
and connected to the **NestJS todo API** in `../todo-api`.

## Features

- **Email/password authentication** — sign up, sign in, and sign out.
- **Session restore** — a silent refresh on startup keeps a returning user
  signed in through the API's HttpOnly refresh cookie.
- **Bearer-protected todo CRUD** — create, read, update, and delete tasks for the
  signed-in user.
- **Kanban board** grouped into the API's three statuses: **To Do**,
  **In Progress**, and **Done**.
- **Search** tasks by title and **filter** by status (All / To Do / In Progress /
  Done).
- **Admin-only delete** — the delete action is hidden for regular users because
  the API restricts `DELETE /todos/:id` to admins.
- **Live statistics** — Total, In Progress, and Done counts.
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
- The NestJS API running at <http://localhost:3000>

### Configure

Copy `.env.example` to `.env.local` and fill in the values:

```bash
VITE_API_URL=http://localhost:3000
VITE_API_KEY=dev-secret
```

`VITE_API_KEY` must match the backend's `API_KEY`. The API's protected routes
require it in the `x-api-key` header in addition to the bearer token.

### Install and run

```bash
npm install
npm run dev
```

Open <http://localhost:5173>. The API's CORS configuration allows exactly this
origin with credentials enabled, so keep the dev server on port 5173.

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

## How auth works

- The **access token is kept in memory only** (`src/api/client.ts`) and is never
  written to `localStorage` or `sessionStorage`. A page reload loses it by
  design.
- On startup, `AuthProvider` calls `POST /auth/refresh`. The HttpOnly
  `refresh_token` cookie is sent automatically because every request uses
  `credentials: "include"`. A 401 there simply means "not logged in" — it is not
  shown as an error.
- Every request to `/todos` carries `Authorization: Bearer <accessToken>`.
  Signup, login, and refresh deliberately do not.
- A single response interceptor handles a 401 from any `/todos` call: it calls
  `POST /auth/refresh` once, updates the in-memory token, and retries the original
  request once. If the refresh also returns 401, the in-memory session is cleared
  and the login screen is shown. Concurrent 401s share one refresh request
  because the backend rotates the refresh cookie on every use.
- A 404 from `/todos/:id` is treated as "not found" with no extra messaging, and
  the delete action is hidden for non-admin users.

## How the data works

Each task follows the `Todo` type in `src/types.ts`:

```ts
export type Status = "TODO" | "IN_PROGRESS" | "DONE";

export type Todo = {
  id: number;
  title: string;
  status: Status;
  createdAt: string;
};
```

Status values are the API's `TODO` / `IN_PROGRESS` / `DONE` enum. The UI labels
them **To Do**, **In Progress**, and **Done**. `ownerId` is never sent: the
backend derives ownership from the JWT, and rejects requests that include
unexpected fields.

The running API also supports an optional `status` query parameter on
`GET /todos`; the app fetches the full list once and filters it client-side.

## Folder Structure

```
todo-app/
├─ public/
│  └─ favicon.svg            # App icon
├─ src/
│  ├─ api/
│  │  ├─ auth.ts             # Signup / login / logout calls
│  │  ├─ client.ts           # Fetch wrapper, in-memory token, 401 retry
│  │  └─ todos.ts            # Todo CRUD calls
│  ├─ auth/
│  │  ├─ AuthProvider.tsx    # Session bootstrap, sign in/up/out
│  │  └─ context.ts          # Auth context + useAuth hook
│  ├─ components/
│  │  ├─ AuthScreen.tsx      # Sign in / sign up form
│  │  ├─ KanbanBoard.tsx     # To Do / In Progress / Done columns
│  │  ├─ MiniCalendar.tsx    # Month calendar in the side panel
│  │  ├─ QuoteCard.tsx       # "Quote of the Day" card
│  │  ├─ Sidebar.tsx         # Navigation + account/profile section
│  │  ├─ StatCard.tsx        # Single statistic card
│  │  ├─ TaskCard.tsx        # One task card with its actions
│  │  ├─ TaskFilters.tsx     # Status tabs
│  │  ├─ TaskModal.tsx       # Modal wrapper for the task form
│  │  ├─ TodoForm.tsx        # Add / edit task form
│  │  └─ Topbar.tsx          # Search, user info, theme toggle, sign out
│  ├─ App.tsx                # Auth gate + dashboard
│  ├─ index.css              # Tailwind import + theme setup
│  ├─ main.tsx               # React entry point
│  ├─ theme.ts               # Light/dark theme helpers
│  ├─ types.ts               # Shared Status / FilterValue / Todo types
│  └─ vite-env.d.ts          # Vite type declarations
├─ .env.example
├─ eslint.config.js
├─ index.html
├─ package.json
├─ tsconfig.json
└─ vite.config.js
```

## License

This project is for learning purposes.
