"use client";

import type {
  ButtonHTMLAttributes,
  InputHTMLAttributes,
  ReactNode,
} from "react";

export function AuthCard({
  title,
  children,
  footer,
}: {
  title: string;
  children: ReactNode;
  footer: ReactNode;
}) {
  return (
    <div className="w-full max-w-sm px-6">
      <div className="space-y-6 rounded bg-brunswick-green p-8 shadow-sm">
        <h1 className="text-2xl font-black tracking-tight text-white">
          {title}
        </h1>
        {children}
      </div>
      <p className="mt-6 text-center text-sm text-white/60">{footer}</p>
    </div>
  );
}

export function Field({
  label,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <label className="block space-y-1.5">
      <span className="text-sm text-white/80">{label}</span>
      <input
        {...props}
        className="w-full rounded border border-white/10 bg-rich-black/60 px-3 py-2 text-white outline-none placeholder:text-white/30 focus:border-aquamarine"
      />
    </label>
  );
}

export function Button({
  variant = "primary",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary";
}) {
  const styles =
    variant === "primary"
      ? "bg-aquamarine text-rich-black hover:bg-aquamarine/90"
      : "border border-white/10 text-white hover:bg-white/5";

  return (
    <button
      {...props}
      className={`w-full rounded px-4 py-2 font-semibold transition disabled:opacity-60 ${styles}`}
    />
  );
}

export function FormError({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <p role="alert" className="text-sm text-red-300">
      {message}
    </p>
  );
}
