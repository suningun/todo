import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const weekDays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

function MiniCalendar() {
  const today = new Date();
  const [viewDate, setViewDate] = useState(
    () => new Date(today.getFullYear(), today.getMonth(), 1),
  );

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const monthLabel = viewDate.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const firstWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: (number | null)[] = [
    ...Array.from({ length: firstWeekday }, () => null),
    ...Array.from({ length: daysInMonth }, (_, index) => index + 1),
  ];

  function changeMonth(offset: number) {
    setViewDate(
      (current) => new Date(current.getFullYear(), current.getMonth() + offset, 1),
    );
  }

  return (
    <div className="rounded-3xl border border-stone-200/80 bg-white p-5 dark:border-white/5 dark:bg-white/[0.02]">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => changeMonth(-1)}
          aria-label="Previous month"
          className="rounded-lg p-1.5 text-stone-500 transition hover:bg-stone-100 hover:text-stone-900 dark:text-white/50 dark:hover:bg-white/5 dark:hover:text-white"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        <p className="text-sm font-semibold text-stone-900 dark:text-white">
          {monthLabel}
        </p>

        <button
          type="button"
          onClick={() => changeMonth(1)}
          aria-label="Next month"
          className="rounded-lg p-1.5 text-stone-500 transition hover:bg-stone-100 hover:text-stone-900 dark:text-white/50 dark:hover:bg-white/5 dark:hover:text-white"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-4 grid grid-cols-7 gap-y-1 text-center">
        {weekDays.map((day) => (
          <span
            key={day}
            className="text-[11px] font-medium uppercase tracking-wide text-stone-400 dark:text-white/35"
          >
            {day}
          </span>
        ))}

        {cells.map((day, index) => {
          const isToday =
            day !== null &&
            day === today.getDate() &&
            month === today.getMonth() &&
            year === today.getFullYear();

          return (
            <span key={index} className="flex items-center justify-center py-1">
              {day !== null && (
                <span
                  className={`grid h-7 w-7 place-items-center rounded-full text-xs ${
                    isToday
                      ? "bg-violet-600 font-semibold text-white"
                      : "text-stone-600 dark:text-white/60"
                  }`}
                >
                  {day}
                </span>
              )}
            </span>
          );
        })}
      </div>
    </div>
  );
}

export default MiniCalendar;
