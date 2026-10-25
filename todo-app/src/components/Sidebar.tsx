import { Home, ListChecks, CircleCheck, Settings, X } from "lucide-react";
import type { LucideIcon } from "lucide-react";

type SidebarProps = {
  username: string;
  roleLabel: string;
  isOpen: boolean;
  onClose: () => void;
};

type SidebarLink = {
  label: string;
  icon: LucideIcon;
  href: string;
  active: boolean;
};

const links: SidebarLink[] = [
  { label: "Dashboard", icon: Home, href: "#dashboard", active: true },
  { label: "My Tasks", icon: ListChecks, href: "#tasks", active: false },
  { label: "Done", icon: CircleCheck, href: "#tasks", active: false },
  { label: "Settings", icon: Settings, href: "#settings", active: false },
];

function Sidebar({ username, roleLabel, isOpen, onClose }: SidebarProps) {
  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          aria-hidden="true"
          className="fixed inset-0 z-30 bg-stone-900/40 backdrop-blur-sm md:hidden dark:bg-black/60"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col overflow-hidden border-r border-stone-200/80 bg-white p-4 transition-transform duration-200 md:sticky md:top-0 md:h-screen md:translate-x-0 dark:border-white/5 dark:bg-[#0d0d12] ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Ambient glow */}
        <div className="pointer-events-none absolute -bottom-24 -left-16 h-64 w-64 rounded-full bg-violet-500/10 blur-3xl dark:bg-violet-600/20" />

        <div className="relative mb-8 flex items-center justify-between px-2 pt-2">
          <span className="bg-gradient-to-r from-violet-500 to-fuchsia-500 bg-clip-text text-xl font-bold tracking-tight text-transparent dark:from-violet-400 dark:to-fuchsia-400">
            TaskFlow
          </span>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="rounded-lg p-1.5 text-stone-400 transition hover:bg-stone-100 hover:text-stone-700 md:hidden dark:text-white/50 dark:hover:bg-white/5 dark:hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <nav className="relative flex flex-col gap-1">
          {links.map(({ label, icon: Icon, href, active }) => (
            <a
              key={label}
              href={href}
              onClick={onClose}
              className={`flex items-center gap-3 rounded-2xl px-3.5 py-2.5 text-sm font-medium transition ${
                active
                  ? "bg-violet-600 text-white shadow-lg shadow-violet-500/25 dark:shadow-violet-900/40"
                  : "text-stone-500 hover:bg-stone-100 hover:text-stone-900 dark:text-white/55 dark:hover:bg-white/5 dark:hover:text-white"
              }`}
            >
              <Icon className="h-[18px] w-[18px] shrink-0" />
              {label}
            </a>
          ))}
        </nav>

        {/* Account / profile section */}
        <div
          id="profile"
          className="relative mt-auto border-t border-stone-200/80 pt-4 dark:border-white/5"
        >
          <div className="flex items-center gap-3 rounded-2xl px-2 py-2">
            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-violet-600 text-sm font-semibold text-white">
              {username.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-stone-900 dark:text-white">
                {username}
              </p>
              <p className="truncate text-[11px] font-medium uppercase tracking-wider text-stone-400 dark:text-white/40">
                {roleLabel}
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
