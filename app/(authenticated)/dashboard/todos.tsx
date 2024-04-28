import { getDatabaseClient } from "@/app/utils";

import { Todo } from "./todo";

export async function Todos() {
  const client = await getDatabaseClient();

  if (!client) {
    return <p>No such table `todos`</p>;
  }

  const { rows } = await client.execute("SELECT * FROM todos");

  if (!rows || rows.length === 0) return null;

  return rows.map((todo, index) => <Todo key={index} item={todo} />);
}
