import { Filter, ChevronDown } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";
import type { FilterValue, PriorityFilter } from "../types";

type TaskFiltersProps = {
  filter: FilterValue;
  setFilter: Dispatch<SetStateAction<FilterValue>>;
  priorityFilter: PriorityFilter;
  setPriorityFilter: Dispatch<SetStateAction<PriorityFilter>>;
};

const statusOptions: { value: FilterValue; label: string }[] = [
  { value: "All", label: "All Tasks" },
  { value: "To Do", label: "To Do" },
  { value: "In Progress", label: "In Progress" },
  { value: "Done", label: "Completed" },
];

const priorityOptions: { value: PriorityFilter; label: string }[] = [
  { value: "All", label: "All priorities" },
  { value: "High", label: "High priority" },
  { value: "Normal", label: "Normal" },
];

function TaskFilters({
  filter,
  setFilter,
  priorityFilter,
  setPriorityFilter,
}: TaskFiltersProps) {
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

      <div className="relative w-full sm:max-w-[220px]">
        <Filter className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400 dark:text-white/40" />

        <select
          value={priorityFilter}
          onChange={(event) =>
            setPriorityFilter(event.target.value as PriorityFilter)
          }
          aria-label="Filter by priority"
          className="w-full cursor-pointer appearance-none rounded-2xl border border-stone-200 bg-white py-2.5 pl-10 pr-9 text-sm text-stone-600 outline-none transition focus:border-violet-400 focus:ring-4 focus:ring-violet-500/10 dark:border-white/5 dark:bg-white/[0.02] dark:text-white/70 dark:focus:border-violet-500/50"
        >
          {priorityOptions.map((option) => (
            <option
              key={option.value}
              value={option.value}
              className="bg-white text-stone-700 dark:bg-[#141419] dark:text-white"
            >
              {option.label}
            </option>
          ))}
        </select>

        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400 dark:text-white/40" />
      </div>
    </div>
  );
}

export default TaskFilters;
