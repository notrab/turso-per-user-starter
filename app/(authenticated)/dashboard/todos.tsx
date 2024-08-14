import { getDatabaseClient } from "@/app/utils";

import { Todo } from "./todo";

export async function Todos() {
  const client = await getDatabaseClient();

  if (!client) {
    return <p>No such table `todos`</p>;
  }

  const todos = await client.query.todos.findMany();

  if (!todos || todos.length === 0) return null;

  return todos.map((todo, index) => (
    <Todo key={index} item={{ id: todo.id, description: todo.description }} />
  ));
}
