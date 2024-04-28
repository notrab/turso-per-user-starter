"use server";

import { revalidatePath } from "next/cache";

import { getDatabaseClient, getDumpUrl } from "@/app/utils";

export type TodoItem = {
  id: number;
  description: string;
};

export const addTodo = async (formData: FormData) => {
  const client = await getDatabaseClient();

  const description = formData.get("description") as string;

  if (!client) return null;

  await client.execute({
    sql: "INSERT INTO todos (description) VALUES (?)",
    args: [description],
  });

  revalidatePath("/dashboard");
};

export const removeTodo = async (id: number) => {
  const client = await getDatabaseClient();

  if (!client) return null;

  await client.execute({
    sql: "DELETE FROM todos WHERE id = ?",
    args: [id],
  });

  revalidatePath("/dashboard");
};
