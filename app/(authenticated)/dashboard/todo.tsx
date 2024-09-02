"use client";

import { useTransition } from "react";
import { InferSelectModel } from "drizzle-orm";

import * as schema from "@/db/schema";
import { removeTodo, toggleTodo } from "./actions";

type Todo = InferSelectModel<typeof schema.todos>;

export function Todo({
  item,
  onRemove,
  onToggle,
}: {
  item: Todo;
  onRemove: (id: number) => void;
  onToggle: (id: number) => void;
}) {
  const [_, startTransition] = useTransition();

  return (
    <li className="flex items-center justify-between rounded bg-white/5 p-6 text-white">
      <div className="flex w-full items-center space-x-3 ">
        <button
          className="p-1 text-3xl"
          onClick={() => {
            startTransition(() => {
              onToggle(item.id);
            });
          }}
        >
          {item.completed ? "✅" : "☑️"}
        </button>
        <span className="flex-1">{item.description}</span>
      </div>
      <button
        className="p-1 flex items-center justify-between transition hover:bg-white/10 rounded"
        onClick={() => {
          startTransition(() => {
            onRemove(item.id);
          });
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 18 18 6M6 6l12 12"
          />
        </svg>
      </button>
    </li>
  );
}
