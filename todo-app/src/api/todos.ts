import { request } from "./client";
import type { Status, Todo } from "../types";

/**
 * `status` is optional on the API; omitting it returns every todo owned by the
 * signed-in user.
 */
export function listTodos(status?: Status): Promise<Todo[]> {
  const query = status ? `?status=${status.toLowerCase()}` : "";

  return request<Todo[]>(`/todos${query}`, { auth: true });
}

export function listAllTodos(): Promise<Todo[]> {
  return listTodos();
}

export function getTodo(id: number): Promise<Todo> {
  return request<Todo>(`/todos/${id}`, { auth: true });
}

export type NewTodo = {
  title: string;
  status: Status;
};

export type TodoUpdate = Partial<NewTodo>;

// The backend derives ownership from the bearer token and rejects any extra
// fields (ownerId/userId included), so only title/status are ever sent.
export function createTodo(todo: NewTodo): Promise<Todo> {
  return request<Todo>("/todos", {
    method: "POST",
    auth: true,
    body: todo,
  });
}

export function updateTodo(id: number, todo: TodoUpdate): Promise<Todo> {
  return request<Todo>(`/todos/${id}`, {
    method: "PATCH",
    auth: true,
    body: todo,
  });
}

export function deleteTodo(id: number): Promise<void> {
  return request<void>(`/todos/${id}`, {
    method: "DELETE",
    auth: true,
  });
}
