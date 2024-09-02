"use client";

import { useRef } from "react";
import { useFormStatus } from "react-dom";

import { addTodo } from "./actions";

export function Form({ onSubmit }: { onSubmit: (formData: FormData) => void }) {
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (formData: FormData) => {
    await onSubmit(formData);
    formRef.current?.reset();
  };

  return (
    <form
      action={handleSubmit}
      className="flex items-center justify-between rounded bg-brunswick-green p-6 shadow-sm"
      ref={formRef}
    >
      <div className="flex w-full items-center space-x-3">
        <span className="p-1 text-3xl">☑️</span>
        <input
          id="description"
          name="description"
          placeholder="Insert new todo"
          className="w-full text-white bg-transparent placeholder:text-white/30 outline-none"
          required
          aria-label="Description of todo"
          type="text"
          autoFocus
        />
      </div>
      <Submit />
    </form>
  );
}

export function Submit() {
  const { pending } = useFormStatus();

  return (
    <button type="submit" aria-disabled={pending} className="sr-only">
      Add
    </button>
  );
}
