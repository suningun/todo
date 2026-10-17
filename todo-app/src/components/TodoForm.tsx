import { Plus, ChevronDown } from "lucide-react";
import type { Dispatch, FormEvent, SetStateAction } from "react";
import type { Status } from "../types";

type TodoFormProps = {
  title: string;
  setTitle: Dispatch<SetStateAction<string>>;
  status: Status;
  setStatus: Dispatch<SetStateAction<Status>>;
  priority: boolean;
  setPriority: Dispatch<SetStateAction<boolean>>;
  handleSubmit: (event: FormEvent<HTMLFormElement>) => void;
  editingId: number | null;
  cancelEdit: () => void;
};

function TodoForm({
  title,
  setTitle,
  status,
  setStatus,
  priority,
  setPriority,
  handleSubmit,
  editingId,
  cancelEdit,
}: TodoFormProps) {
  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <h2 className="text-lg font-semibold tracking-tight text-stone-900 dark:text-white">
          {editingId !== null ? "Edit task" : "New task"}
        </h2>
        <p className="mt-1 text-sm text-stone-500 dark:text-white/40">
          {editingId !== null
            ? "Update your task details below."
            : "Add a task to your board."}
        </p>
      </div>

      <div>
        <label
          htmlFor="task-title"
          className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-stone-500 dark:text-white/40"
        >
          Task title
        </label>

        <input
          id="task-title"
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="e.g. Finish my assignment"
          required
          className="w-full rounded-xl border border-stone-200 bg-stone-50 px-3.5 py-2.5 text-sm text-stone-800 outline-none transition placeholder:text-stone-400 focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-500/10 dark:border-white/10 dark:bg-white/[0.03] dark:text-white dark:placeholder:text-white/30 dark:focus:border-violet-500/60"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor="task-status"
            className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-stone-500 dark:text-white/40"
          >
            Status
          </label>

          <div className="relative">
            <select
              id="task-status"
              value={status}
              onChange={(event) => setStatus(event.target.value as Status)}
              className="w-full cursor-pointer appearance-none rounded-xl border border-stone-200 bg-white py-2.5 pl-3.5 pr-9 text-sm text-stone-800 outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-500/10 dark:border-white/10 dark:bg-[#16161c] dark:text-white dark:focus:border-violet-500/60"
            >
              <option value="To Do">To Do</option>
              <option value="In Progress">In Progress</option>
              <option value="Done">Done</option>
            </select>

            <ChevronDown
              aria-hidden="true"
              className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400 dark:text-white/40"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="task-priority"
            className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-stone-500 dark:text-white/40"
          >
            Priority
          </label>

          <div className="relative">
            <select
              id="task-priority"
              value={priority ? "true" : "false"}
              onChange={(event) => setPriority(event.target.value === "true")}
              className="w-full cursor-pointer appearance-none rounded-xl border border-stone-200 bg-white py-2.5 pl-3.5 pr-9 text-sm text-stone-800 outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-500/10 dark:border-white/10 dark:bg-[#16161c] dark:text-white dark:focus:border-violet-500/60"
            >
              <option value="false">Normal</option>
              <option value="true">High priority</option>
            </select>

            <ChevronDown
              aria-hidden="true"
              className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400 dark:text-white/40"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2.5 pt-1">
        <button
          type="submit"
          className="inline-flex items-center gap-1.5 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-500 focus:outline-none focus:ring-4 focus:ring-violet-500/20"
        >
          {editingId !== null ? (
            "Save changes"
          ) : (
            <>
              <Plus className="h-4 w-4" />
              Add task
            </>
          )}
        </button>

        <button
          type="button"
          onClick={cancelEdit}
          className="rounded-xl border border-stone-200 px-4 py-2.5 text-sm font-medium text-stone-600 transition hover:bg-stone-100 hover:text-stone-900 dark:border-white/10 dark:text-white/70 dark:hover:bg-white/5 dark:hover:text-white"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

export default TodoForm;
