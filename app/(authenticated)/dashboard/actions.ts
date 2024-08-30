"use server";

import { revalidatePath } from "next/cache";
import * as schema from "@/db/schema";
import { getDatabaseClient } from "@/app/utils";
import { eq, sql } from "drizzle-orm";

export type TodoItem = {
  id: number;
  description: string;
};

export const addTodo = async (formData: FormData) => {
  const client = await getDatabaseClient();

  const description = formData.get("description") as string;

  if (!client) return null;

  await client.insert(schema.todos).values({
    description,
  });

  revalidatePath("/dashboard");
};

export const removeTodo = async (id: number) => {
  const client = await getDatabaseClient();

  if (!client) return null;

  await client.delete(schema.todos).where(eq(schema.todos.id, id));

  revalidatePath("/dashboard");
};

export const toggleTodo = async (id: number) => {
  const client = await getDatabaseClient();

  if (!client) return null;

  await client
    .update(schema.todos)
    .set({ completed: sql`NOT completed` })
    .where(eq(schema.todos.id, id));

  revalidatePath("/dashboard");
};
