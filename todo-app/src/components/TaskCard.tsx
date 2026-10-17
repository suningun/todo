import { CalendarDays, ChevronDown, Pencil, Star, Trash2 } from "lucide-react";
import type { Status, Todo } from "../types";

type TaskCardProps = {
  todo: Todo;
  onEdit: (todo: Todo) => void;
  onDelete: (id: number) => void;
  onTogglePriority: (id: number) => void;
  onStatusChange: (id: number, status: Status) => void;
};

const statusMeta: Record<Status, { dot: string; text: string }> = {
  "To Do": { dot: "bg-stone-400 dark:bg-white/40", text: "text-stone-600 dark:text-white/60" },
  "In Progress": { dot: "bg-violet-500 dark:bg-violet-400", text: "text-violet-600 dark:text-violet-300" },
  Done: { dot: "bg-emerald-500 dark:bg-emerald-400", text: "text-emerald-600 dark:text-emerald-300" },
};

function formatDate(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "No date";

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function TaskCard({
  todo,
  onEdit,
  onDelete,
  onTogglePriority,
  onStatusChange,
}: TaskCardProps) {
  const meta = statusMeta[todo.status];

  return (
    <article className="group rounded-2xl border border-stone-200 bg-stone-50 p-4 transition hover:border-stone-300 hover:bg-white dark:border-white/[0.06] dark:bg-[#141419] dark:hover:border-white/15 dark:hover:bg-[#17171d]">
      <div className="flex items-start justify-between gap-2">
        <div className="relative">
          <select
            value={todo.status}
            onChange={(event) =>
              onStatusChange(todo.id, event.target.value as Status)
            }
            aria-label="Change task status"
            className={`cursor-pointer appearance-none rounded-full border border-stone-200 bg-white py-1 pl-6 pr-7 text-[11px] font-semibold uppercase tracking-wider outline-none transition hover:bg-stone-100 focus:ring-4 focus:ring-violet-500/10 dark:border-white/10 dark:bg-white/[0.04] dark:hover:bg-white/[0.08] ${meta.text}`}
          >
            <option value="To Do" className="bg-white text-stone-700 dark:bg-[#141419] dark:text-white">
              To Do
            </option>
            <option value="In Progress" className="bg-white text-stone-700 dark:bg-[#141419] dark:text-white">
              In Progress
            </option>
            <option value="Done" className="bg-white text-stone-700 dark:bg-[#141419] dark:text-white">
              Completed
            </option>
          </select>

          <span
            className={`pointer-events-none absolute left-2.5 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full ${meta.dot}`}
          />
          <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3 w-3 -translate-y-1/2 opacity-60" />
        </div>

        {todo.priority && (
          <span className="shrink-0 rounded-full border border-rose-200 bg-rose-50 px-2.5 py-1 text-[11px] font-semibold text-rose-600 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-300">
            High Priority
          </span>
        )}
      </div>

      <h4
        className={`mt-3 text-sm font-semibold leading-relaxed ${
          todo.status === "Done"
            ? "text-stone-400 line-through dark:text-white/35"
            : "text-stone-800 dark:text-white/90"
        }`}
      >
        {todo.title}
      </h4>

      <div className="mt-4 flex items-center justify-between gap-2">
        <span className="inline-flex items-center gap-1.5 text-xs text-stone-400 dark:text-white/35">
          <CalendarDays className="h-3.5 w-3.5" />
          {formatDate(todo.createdAt)}
        </span>

        <div className="flex items-center gap-0.5 opacity-0 transition group-hover:opacity-100 focus-within:opacity-100 max-sm:opacity-100">
          <button
            type="button"
            onClick={() => onTogglePriority(todo.id)}
            aria-label={todo.priority ? "Remove priority" : "Mark as priority"}
            className="rounded-lg p-1.5 text-stone-400 transition hover:bg-stone-200 hover:text-amber-500 dark:text-white/40 dark:hover:bg-white/10 dark:hover:text-amber-300"
          >
            <Star
              className={`h-4 w-4 ${
                todo.priority ? "fill-amber-400 text-amber-400" : ""
              }`}
            />
          </button>

          <button
            type="button"
            onClick={() => onEdit(todo)}
            aria-label="Edit task"
            className="rounded-lg p-1.5 text-stone-400 transition hover:bg-stone-200 hover:text-stone-900 dark:text-white/40 dark:hover:bg-white/10 dark:hover:text-white"
          >
            <Pencil className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={() => onDelete(todo.id)}
            aria-label="Delete task"
            className="rounded-lg p-1.5 text-stone-400 transition hover:bg-rose-100 hover:text-rose-600 dark:text-white/40 dark:hover:bg-rose-500/15 dark:hover:text-rose-300"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </article>
  );
}

export default TaskCard;
