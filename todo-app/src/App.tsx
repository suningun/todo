import { useEffect, useState } from "react";
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
import { applyTheme, getInitialTheme, type Theme } from "./theme";
import { createTodo, deleteTodo, listTodos, updateTodo } from "./api/todos";
import type { FilterValue, PriorityFilter, Status, Todo } from "./types";

function App() {
  const [username] = useState("Suning");
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [status, setStatus] = useState<Status>("To Do");
  const [priority, setPriority] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterValue>("All");
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>("All");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  useEffect(() => {
    listTodos()
      .then(setTodos)
      .catch((err: unknown) => reportError(err, "Failed to load todos"));
  }, []);

  function reportError(err: unknown, fallback: string) {
    setError(err instanceof Error ? err.message : fallback);
  }

  function toggleTheme() {
    setTheme((current) => (current === "dark" ? "light" : "dark"));
  }

  function resetForm() {
    setTitle("");
    setStatus("To Do");
    setPriority(false);
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
    setPriority(todo.priority);
    setEditingId(todo.id);
    setIsFormOpen(true);
  }

  async function handleDelete(id: number) {
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

  async function togglePriority(id: number) {
    const current = todos.find((todo) => todo.id === id);
    if (!current) return;

    setError(null);

    try {
      const updated = await updateTodo(id, { priority: !current.priority });
      setTodos((items) =>
        items.map((todo) => (todo.id === id ? updated : todo)),
      );
    } catch (err) {
      reportError(err, "Failed to update priority");
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!title.trim()) return;

    setError(null);

    try {
      if (editingId !== null) {
        const updated = await updateTodo(editingId, {
          title: title.trim(),
          status,
          priority,
        });
        setTodos((current) =>
          current.map((todo) => (todo.id === editingId ? updated : todo)),
        );
      } else {
        const created = await createTodo({
          title: title.trim(),
          status,
          priority,
        });
        setTodos((current) => [...current, created]);
      }
    } catch (err) {
      reportError(err, "Failed to save todo");
      return;
    }

    closeForm();
  }

  const completed = todos.filter((todo) => todo.status === "Done").length;
  const inProgress = todos.filter((todo) => todo.status === "In Progress").length;

  const filteredTodos = todos.filter((todo) => {
    const matchesSearch = todo.title
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesStatus = filter === "All" || todo.status === filter;

    const matchesPriority =
      priorityFilter === "All" ||
      (priorityFilter === "High" ? todo.priority : !todo.priority);

    return matchesSearch && matchesStatus && matchesPriority;
  });

  return (
    <div className="min-h-screen bg-stone-100 text-stone-800 md:flex dark:bg-[#0b0b0f] dark:text-white">
      <Sidebar
        username={username}
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar
          username={username}
          search={search}
          setSearch={setSearch}
          onOpenMenu={() => setIsMenuOpen(true)}
          theme={theme}
          onToggleTheme={toggleTheme}
        />

        <main id="dashboard" className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
          {error && (
            <p className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300">
              {error}
            </p>
          )}

          <section className="mb-6">
            <h1 className="text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl dark:text-white">
              Welcome back, {username} <span aria-hidden="true">👋</span>
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
              color="bg-amber-100 text-amber-600 dark:bg-amber-500/15 dark:text-amber-300"
              hint="Currently being worked on"
            />
            <StatCard
              title="Completed"
              value={completed}
              icon={<CircleCheck className="h-[18px] w-[18px]" />}
              color="bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-300"
              hint="Tasks finished"
            />
          </section>

          <section className="mb-6">
            <TaskFilters
              filter={filter}
              setFilter={setFilter}
              priorityFilter={priorityFilter}
              setPriorityFilter={setPriorityFilter}
            />
          </section>

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
            <section id="tasks">
              <KanbanBoard
                todos={filteredTodos}
                onAdd={openCreate}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onTogglePriority={togglePriority}
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
        priority={priority}
        setPriority={setPriority}
        handleSubmit={handleSubmit}
        editingId={editingId}
      />
    </div>
  );
}

export default App;
