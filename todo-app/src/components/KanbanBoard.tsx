import { Plus } from "lucide-react";
import TaskCard from "./TaskCard";
import { STATUS_LABELS, type Status, type Todo } from "../types";

type KanbanBoardProps = {
  todos: Todo[];
  canDelete: boolean;
  onAdd: (status: Status) => void;
  onEdit: (todo: Todo) => void;
  onDelete: (id: number) => void;
  onStatusChange: (id: number, status: Status) => void;
};

type Column = {
  status: Status;
  dot: string;
  bar: string;
};

const columns: Column[] = [
  { status: "TODO", dot: "bg-amber-500", bar: "bg-amber-500" },
  { status: "IN_PROGRESS", dot: "bg-violet-500", bar: "bg-violet-500" },
  { status: "DONE", dot: "bg-emerald-500", bar: "bg-emerald-500" },
];

function KanbanBoard({
  todos,
  canDelete,
  onAdd,
  onEdit,
  onDelete,
  onStatusChange,
}: KanbanBoardProps) {
  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
      {columns.map((column) => {
        const columnTodos = todos.filter((todo) => todo.status === column.status);

        return (
          <section
            key={column.status}
            className="flex flex-col rounded-3xl border border-stone-200/80 bg-white p-4 dark:border-white/5 dark:bg-white/[0.02]"
          >
            <div className="flex items-center gap-2.5 px-1">
              <span className={`h-2.5 w-2.5 rounded-full ${column.dot}`} />
              <h3 className="text-sm font-semibold text-stone-900 dark:text-white">
                {STATUS_LABELS[column.status]}
              </h3>
              <span className="text-sm text-stone-400 dark:text-white/40">
                {columnTodos.length}
              </span>
            </div>

            <div className={`mt-3 h-0.5 rounded-full ${column.bar}`} />

            <div className="mt-4 flex flex-1 flex-col gap-3">
              <button
                type="button"
                onClick={() => onAdd(column.status)}
                className={`flex items-center justify-center gap-2 rounded-2xl border border-dashed border-stone-300 bg-stone-50 text-sm font-medium text-stone-500 transition hover:border-violet-400 hover:bg-white hover:text-stone-800 dark:border-white/10 dark:bg-white/[0.02] dark:text-white/45 dark:hover:border-violet-500/40 dark:hover:bg-white/[0.05] dark:hover:text-white ${
                  columnTodos.length === 0 ? "py-10" : "py-3.5"
                }`}
              >
                <Plus className="h-4 w-4" />
                Add Task
              </button>

              {columnTodos.map((todo) => (
                <TaskCard
                  key={todo.id}
                  todo={todo}
                  canDelete={canDelete}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onStatusChange={onStatusChange}
                />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}

export default KanbanBoard;
