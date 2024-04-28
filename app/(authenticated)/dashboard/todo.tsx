"use client";

import { useTransition } from "react";

import { removeTodo, type TodoItem } from "./actions";

export function Todo({ item }: { item: TodoItem }) {
  const [_, startTransition] = useTransition();

  return (
    <li className="flex items-center justify-between rounded-md bg-neutral-800 p-6 text-white">
      <div className="flex w-full items-center space-x-3 ">
        <button
          className="p-1 text-3xl"
          onClick={() => alert("Implement later")}
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
