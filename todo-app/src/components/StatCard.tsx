import type { ReactNode } from "react";

type StatCardProps = {
  title: string;
  value: number;
  icon: ReactNode;
  color: string;
  hint: string;
};

function StatCard({ title, value, icon, color, hint }: StatCardProps) {
  return (
    <div className="rounded-2xl border border-stone-200/80 bg-white p-4 dark:border-white/5 dark:bg-white/[0.02]">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium uppercase tracking-wider text-stone-400 dark:text-white/40">
          {title}
        </p>

        <div className={`grid h-9 w-9 place-items-center rounded-xl ${color}`}>
          {icon}
        </div>
      </div>

      <h3 className="mt-3 text-2xl font-bold tracking-tight text-stone-900 dark:text-white">
        {value}
      </h3>

      <p className="mt-1 text-xs text-stone-400 dark:text-white/35">{hint}</p>
    </div>
  );
}

export default StatCard;
