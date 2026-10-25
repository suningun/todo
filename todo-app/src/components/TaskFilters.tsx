import type { Dispatch, SetStateAction } from "react";
import { STATUS_LABELS, type FilterValue } from "../types";

type TaskFiltersProps = {
  filter: FilterValue;
  setFilter: Dispatch<SetStateAction<FilterValue>>;
};

const statusOptions: { value: FilterValue; label: string }[] = [
  { value: "All", label: "All" },
  { value: "TODO", label: STATUS_LABELS.TODO },
  { value: "IN_PROGRESS", label: STATUS_LABELS.IN_PROGRESS },
  { value: "DONE", label: STATUS_LABELS.DONE },
];

function TaskFilters({ filter, setFilter }: TaskFiltersProps) {
  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex flex-wrap items-center gap-1 rounded-2xl border border-stone-200/80 bg-white p-1 dark:border-white/5 dark:bg-white/[0.02]">
        {statusOptions.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => setFilter(option.value)}
            className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
              filter === option.value
                ? "bg-stone-900 text-white dark:bg-[#1b1b22] dark:text-white dark:ring-1 dark:ring-white/5"
                : "text-stone-500 hover:bg-stone-100 hover:text-stone-900 dark:text-white/50 dark:hover:bg-white/5 dark:hover:text-white"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default TaskFilters;
