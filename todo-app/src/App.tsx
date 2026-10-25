import { useCallback, useEffect, useState } from "react";
import type { FormEvent } from "react";
import { ListTodo, Clock, CircleCheck } from "lucide-react";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import StatCard from "./components/StatCard";
import TaskFilters from "./components/TaskFilters";
import TaskModal from "./components/TaskModal";
import KanbanBoard from "./components/KanbanBoard";
import MiniCalendar from "./components/MiniCalendar";
import QuoteCard from "./components/QuoteCard";
import AuthScreen from "./components/AuthScreen";
import { useAuth } from "./auth/context";
import { ApiError } from "./api/client";
import {
  createTodo,
  deleteTodo,
  listAllTodos,
  updateTodo,
} from "./api/todos";
import { applyTheme, getInitialTheme, type Theme } from "./theme";
import type { FilterValue, Status, Todo } from "./types";

function describeError(err: unknown, fallback: string): string {
  if (err instanceof ApiError) {
    if (err.status === 401) {
      return "Your session expired. Please sign in again.";
    }

    if (err.status === 403) {
      return "Only admins can delete tasks.";
    }

    if (err.status === 404) {
      return "That task could not be found.";
    }

    return err.message || fallback;
  }

  return fallback;
}

function LoadingScreen() {
  return (
    <div className="grid min-h-screen place-items-center bg-stone-100 dark:bg-[#0b0b0f]">
      <div className="flex items-center gap-3 text-stone-500 dark:text-white/50">
        <span className="grid h-10 w-10 animate-pulse place-items-center rounded-2xl bg-violet-600 text-white">
          <ListTodo className="h-5 w-5" />
        </span>
        <span className="text-sm font-medium">Restoring your session…</span>
      </div>
    </div>
  );
}

type DashboardProps = {
  theme: Theme;
  onToggleTheme: () => void;
};

function Dashboard({ theme, onToggleTheme }: DashboardProps) {
  const { user, signOut } = useAuth();

  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [status, setStatus] = useState<Status>("TODO");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterValue>("All");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const reportError = useCallback((err: unknown, fallback: string) => {
    setError(describeError(err, fallback));
  }, []);

  useEffect(() => {
    let active = true;

    listAllTodos()
      .then((items) => {
        if (active) setTodos(items);
      })
      .catch((err: unknown) => {
        if (active) reportError(err, "Failed to load todos");
      });

    return () => {
      active = false;
    };
  }, [reportError]);

  const emailName = user?.email?.split("@")[0];
  const username = emailName ?? "Account";
  const roleLabel = user?.role === "admin" ? "Admin" : "Member";
  const isAdmin = user?.role === "admin";

  function resetForm() {
    setTitle("");
    setStatus("TODO");
    setEditingId(null);
  }

  function closeForm() {
    resetForm();
    setIsFormOpen(false);
  }

  function openCreate(nextStatus: Status) {
    resetForm();
    setStatus(nextStatus);
    setIsFormOpen(true);
  }

  function handleEdit(todo: Todo) {
    setTitle(todo.title);
    setStatus(todo.status);
    setEditingId(todo.id);
    setIsFormOpen(true);
  }

  async function handleDelete(id: number) {
    if (!isAdmin) return;

    setError(null);

    try {
      await deleteTodo(id);
      setTodos((current) => current.filter((todo) => todo.id !== id));
    } catch (err) {
      reportError(err, "Failed to delete todo");
      return;
    }

    if (editingId === id) closeForm();
  }

  async function handleStatusChange(id: number, newStatus: Status) {
    setError(null);

    try {
      const updated = await updateTodo(id, { status: newStatus });
      setTodos((current) =>
        current.map((todo) => (todo.id === id ? updated : todo)),
      );
    } catch (err) {
      reportError(err, "Failed to update status");
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedTitle = title.trim();
    if (!trimmedTitle) return;

    setError(null);

    try {
      if (editingId !== null) {
        const updated = await updateTodo(editingId, {
          title: trimmedTitle,
          status,
        });
        setTodos((current) =>
          current.map((todo) => (todo.id === editingId ? updated : todo)),
        );
      } else {
        const created = await createTodo({
          title: trimmedTitle,
          status,
        });
        setTodos((current) => [...current, created]);
      }
    } catch (err) {
      reportError(err, "Failed to save todo");
      return;
    }

    closeForm();
  }

  const done = todos.filter((todo) => todo.status === "DONE").length;
  const inProgress = todos.filter(
    (todo) => todo.status === "IN_PROGRESS",
  ).length;

  const filteredTodos = todos.filter((todo) => {
    const matchesSearch = todo.title
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesStatus = filter === "All" || todo.status === filter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-stone-100 text-stone-800 md:flex dark:bg-[#0b0b0f] dark:text-white">
      <Sidebar
        username={username}
        roleLabel={roleLabel}
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar
          username={username}
          roleLabel={roleLabel}
          search={search}
          setSearch={setSearch}
          onOpenMenu={() => setIsMenuOpen(true)}
          onLogout={() => void signOut()}
          theme={theme}
          onToggleTheme={onToggleTheme}
        />

        <main id="dashboard" className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
          {error && (
            <p className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300">
              {error}
            </p>
          )}

          <section className="mb-6">
            <h1 className="text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl dark:text-white">
              Welcome back{emailName ? `, ${emailName}` : ""}{" "}
              <span aria-hidden="true">👋</span>
            </h1>
            <p className="mt-2 text-sm text-stone-500 dark:text-white/50">
              How are you feeling today? Here is your task overview.
            </p>
          </section>

          {/* Live statistics */}
          <section className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <StatCard
              title="Total Tasks"
              value={todos.length}
              icon={<ListTodo className="h-[18px] w-[18px]" />}
              color="bg-violet-100 text-violet-600 dark:bg-violet-500/15 dark:text-violet-300"
              hint="Across all statuses"
            />
            <StatCard
              title="In Progress"
              value={inProgress}
              icon={<Clock className="h-[18px] w-[18px]" />}
              color="bg-violet-100 text-violet-600 dark:bg-violet-500/15 dark:text-violet-300"
              hint="Currently being worked on"
            />
            <StatCard
              title="Done"
              value={done}
              icon={<CircleCheck className="h-[18px] w-[18px]" />}
              color="bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-300"
              hint="Tasks finished"
            />
          </section>

          <section className="mb-6">
            <TaskFilters filter={filter} setFilter={setFilter} />
          </section>

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
            <section id="tasks">
              <KanbanBoard
                todos={filteredTodos}
                canDelete={isAdmin}
                onAdd={openCreate}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onStatusChange={handleStatusChange}
              />
            </section>

            <aside className="space-y-6">
              <MiniCalendar />
              <QuoteCard />
            </aside>
          </div>
        </main>
      </div>

      <TaskModal
        isOpen={isFormOpen}
        onClose={closeForm}
        title={title}
        setTitle={setTitle}
        status={status}
        setStatus={setStatus}
        handleSubmit={handleSubmit}
        editingId={editingId}
      />
    </div>
  );
}

function App() {
  const { status } = useAuth();
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  if (status === "loading") return <LoadingScreen />;
  if (status === "guest") return <AuthScreen />;

  return (
    <Dashboard
      theme={theme}
      onToggleTheme={() =>
        setTheme((current) => (current === "dark" ? "light" : "dark"))
      }
    />
  );
}

export default App;
