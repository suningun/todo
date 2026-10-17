import { useEffect } from "react";
import { X } from "lucide-react";
import TodoForm from "./TodoForm";
import type { Dispatch, FormEvent, SetStateAction } from "react";
import type { Status } from "../types";

type TaskModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  setTitle: Dispatch<SetStateAction<string>>;
  status: Status;
  setStatus: Dispatch<SetStateAction<Status>>;
  priority: boolean;
  setPriority: Dispatch<SetStateAction<boolean>>;
  handleSubmit: (event: FormEvent<HTMLFormElement>) => void;
  editingId: number | null;
};

function TaskModal({ isOpen, onClose, ...formProps }: TaskModalProps) {
  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-stone-900/50 p-4 backdrop-blur-sm dark:bg-black/70"
    >
      <div
        onClick={(event) => event.stopPropagation()}
        className="relative w-full max-w-lg rounded-3xl border border-stone-200 bg-white p-6 shadow-2xl shadow-stone-900/10 dark:border-white/10 dark:bg-[#121217] dark:shadow-black/50"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 rounded-lg p-1.5 text-stone-400 transition hover:bg-stone-100 hover:text-stone-700 dark:text-white/40 dark:hover:bg-white/5 dark:hover:text-white"
        >
          <X className="h-4 w-4" />
        </button>

        <TodoForm {...formProps} cancelEdit={onClose} />
      </div>
    </div>
  );
}

export default TaskModal;
