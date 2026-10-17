export type Status = "To Do" | "In Progress" | "Done";

export type FilterValue = Status | "All";

export type PriorityFilter = "All" | "High" | "Normal";

export type Todo = {
  id: number;
  title: string;
  status: Status;
  priority: boolean;
  createdAt: string;
};
