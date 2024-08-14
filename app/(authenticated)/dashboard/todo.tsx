"use client";

import { useTransition } from "react";
import { InferSelectModel } from "drizzle-orm";
import * as schema from "@/db/schema";
import { removeTodo } from "./actions";

type Todo = InferSelectModel<typeof schema.todos>;

export function Todo({ item }: { item: Todo }) {
  const [_, startTransition] = useTransition();

  return (
    <li className="flex items-center justify-between rounded-md bg-neutral-800 p-6 text-white">
      <div className="flex w-full items-center space-x-3 ">
        <button
          className="p-1 text-3xl"
          onClick={() => alert("lol its a demo")}
        >
          ☑️
        </button>
        <span className="flex-1">{item.description}</span>
      </div>
      <button
        className="p-1 text-3xl"
        onClick={() => {
          startTransition(() => {
            removeTodo(item.id);
          });
        }}
      >
        &times;
      </button>
    </li>
  );
}
