import { CalendarDays, ChevronDown, Pencil, Trash2 } from "lucide-react";
import { STATUS_LABELS, type Status, type Todo } from "../types";

type TaskCardProps = {
  todo: Todo;
  canDelete: boolean;
  onEdit: (todo: Todo) => void;
  onDelete: (id: number) => void;
  onStatusChange: (id: number, status: Status) => void;
};

const statusMeta: Record<Status, { dot: string; text: string }> = {
  TODO: {
    dot: "bg-amber-500 dark:bg-amber-400",
    text: "text-amber-600 dark:text-amber-300",
  },
  IN_PROGRESS: {
    dot: "bg-violet-500 dark:bg-violet-400",
    text: "text-violet-600 dark:text-violet-300",
  },
  DONE: {
    dot: "bg-emerald-500 dark:bg-emerald-400",
    text: "text-emerald-600 dark:text-emerald-300",
  },
};

const statuses: Status[] = ["TODO", "IN_PROGRESS", "DONE"];

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
  canDelete,
  onEdit,
  onDelete,
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
            {statuses.map((status) => (
              <option
                key={status}
                value={status}
                className="bg-white text-stone-700 dark:bg-[#141419] dark:text-white"
              >
                {STATUS_LABELS[status]}
              </option>
            ))}
          </select>

          <span
            className={`pointer-events-none absolute left-2.5 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full ${meta.dot}`}
          />
          <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3 w-3 -translate-y-1/2 opacity-60" />
        </div>
      </div>

      <h4
        className={`mt-3 text-sm font-semibold leading-relaxed ${
          todo.status === "DONE"
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
            onClick={() => onEdit(todo)}
            aria-label="Edit task"
            className="rounded-lg p-1.5 text-stone-400 transition hover:bg-stone-200 hover:text-stone-900 dark:text-white/40 dark:hover:bg-white/10 dark:hover:text-white"
          >
            <Pencil className="h-4 w-4" />
          </button>

          {canDelete && (
            <button
              type="button"
              onClick={() => onDelete(todo.id)}
              aria-label="Delete task"
              className="rounded-lg p-1.5 text-stone-400 transition hover:bg-rose-100 hover:text-rose-600 dark:text-white/40 dark:hover:bg-rose-500/15 dark:hover:text-rose-300"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

export default TaskCard;
