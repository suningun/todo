import { Menu, Search, Bell, Sun, Moon, LogOut } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";
import type { Theme } from "../theme";

type TopbarProps = {
  username: string;
  roleLabel: string;
  search: string;
  setSearch: Dispatch<SetStateAction<string>>;
  onOpenMenu: () => void;
  onLogout: () => void;
  theme: Theme;
  onToggleTheme: () => void;
};

function Topbar({
  username,
  roleLabel,
  search,
  setSearch,
  onOpenMenu,
  onLogout,
  theme,
  onToggleTheme,
}: TopbarProps) {
  return (
    <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-stone-200/80 bg-white/80 px-4 py-3.5 backdrop-blur-xl sm:px-6 lg:px-8 dark:border-white/5 dark:bg-[#0b0b0f]/80">
      <button
        type="button"
        onClick={onOpenMenu}
        aria-label="Open menu"
        className="rounded-xl p-2 text-stone-500 transition hover:bg-stone-100 hover:text-stone-900 md:hidden dark:text-white/60 dark:hover:bg-white/5 dark:hover:text-white"
      >
        <Menu className="h-5 w-5" />
      </button>

      <div className="relative w-full max-w-md">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400 dark:text-white/40" />
        <input
          type="text"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search..."
          aria-label="Search tasks"
          className="w-full rounded-2xl border border-stone-200 bg-stone-100 py-2.5 pl-10 pr-4 text-sm text-stone-800 outline-none transition placeholder:text-stone-400 focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-500/10 dark:border-white/5 dark:bg-white/[0.03] dark:text-white dark:placeholder:text-white/35 dark:focus:border-violet-500/50 dark:focus:bg-white/[0.05]"
        />
      </div>

      <div className="ml-auto flex items-center gap-1 sm:gap-2">
        <button
          type="button"
          aria-label="Notifications"
          className="hidden rounded-xl p-2 text-stone-500 transition hover:bg-stone-100 hover:text-stone-900 sm:block dark:text-white/50 dark:hover:bg-white/5 dark:hover:text-white"
        >
          <Bell className="h-5 w-5" />
        </button>

        <button
          type="button"
          onClick={onToggleTheme}
          aria-label={
            theme === "dark" ? "Switch to light theme" : "Switch to dark theme"
          }
          title={
            theme === "dark" ? "Switch to light theme" : "Switch to dark theme"
          }
          className="rounded-xl p-2 text-stone-500 transition hover:bg-stone-100 hover:text-stone-900 dark:text-white/50 dark:hover:bg-white/5 dark:hover:text-white"
        >
          {theme === "dark" ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
        </button>

        <div className="mx-1 hidden h-8 w-px bg-stone-200 sm:block dark:bg-white/10" />

        <div className="flex items-center gap-3">
          <div className="hidden text-right sm:block">
            <p className="text-sm font-semibold leading-tight text-stone-900 dark:text-white">
              {username}
            </p>
            <p className="text-[11px] font-medium uppercase tracking-wider text-stone-400 dark:text-white/40">
              {roleLabel}
            </p>
          </div>

          <div className="grid h-9 w-9 place-items-center rounded-full bg-violet-600 text-sm font-semibold text-white">
            {username.charAt(0).toUpperCase()}
          </div>
        </div>

        <button
          type="button"
          onClick={onLogout}
          aria-label="Sign out"
          className="ml-1 inline-flex items-center gap-2 rounded-xl border border-stone-200 px-2.5 py-2 text-sm font-medium text-stone-600 transition hover:bg-stone-100 hover:text-stone-900 sm:px-3.5 dark:border-white/10 dark:text-white/70 dark:hover:bg-white/5 dark:hover:text-white"
        >
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:inline">Sign out</span>
        </button>
      </div>
    </header>
  );
}

export default Topbar;
