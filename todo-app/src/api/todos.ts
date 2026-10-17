import type { Status, Todo } from "../types";

const BASE_URL: string = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

export type NewTodo = {
  title: string;
  status: Status;
  priority: boolean;
};

export type TodoUpdate = Partial<NewTodo>;

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...init,
  });

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status} ${response.statusText}`);
  }

  const body = await response.text();
  return (body ? JSON.parse(body) : undefined) as T;
}

export function listTodos(): Promise<Todo[]> {
  return request<Todo[]>("/todos");
}

export function createTodo(todo: NewTodo): Promise<Todo> {
  return request<Todo>("/todos", {
    method: "POST",
    body: JSON.stringify(todo),
  });
}

export function updateTodo(id: number, todo: TodoUpdate): Promise<Todo> {
  return request<Todo>(`/todos/${id}`, {
    method: "PATCH",
    body: JSON.stringify(todo),
  });
}

export function deleteTodo(id: number): Promise<void> {
  return request<void>(`/todos/${id}`, { method: "DELETE" });
}
