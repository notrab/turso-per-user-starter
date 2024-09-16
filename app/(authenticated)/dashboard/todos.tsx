import { getDatabaseClient } from "@/app/utils";
import { TodoList } from "./todo-list";

export async function Todos() {
  const client = await getDatabaseClient();

  if (!client) {
    return <p>Database not ready</p>;
  }

  const todos = await client.query.todos.findMany();

  return <TodoList initialTodos={todos || []} />;
}
