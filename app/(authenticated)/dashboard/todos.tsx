import { getDatabaseClient } from "@/app/utils";

import { Todo } from "./todo";
import { type TodoItem } from "./actions";

export async function Todos() {
  const client = await getDatabaseClient();

  if (!client) {
    return <p>No such table `todos`</p>;
  }

  const result = await client.execute("SELECT * FROM todos");

  const rows = result.rows as unknown as Array<TodoItem>;

  if (!rows || rows.length === 0) return null;

  return rows.map((todo, index) => <Todo key={index} item={todo} />);
}
