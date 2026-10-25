export type Status = "TODO" | "IN_PROGRESS" | "DONE";

export type FilterValue = Status | "All";

export type Role = "user" | "admin";

export type Todo = {
  id: number;
  title: string;
  status: Status;
  createdAt: string;
};

export const STATUS_LABELS: Record<Status, string> = {
  TODO: "To Do",
  IN_PROGRESS: "In Progress",
  DONE: "Done",
};
