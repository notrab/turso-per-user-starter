"use client";

import { useEffect, useRef, useState } from "react";

import type { UserMenuProps } from "../../types";
import { authClient } from "./client";

export function UserMenu({ links = [] }: UserMenuProps) {
  const { data } = authClient.useSession();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close when clicking outside or pressing Escape.
  useEffect(() => {
    if (!open) return;

    const onClick = (event: MouseEvent) => {
      if (!ref.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) =>
      event.key === "Escape" && setOpen(false);

    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const user = data?.user;
  const initial = (user?.name || user?.email || "?").charAt(0).toUpperCase();

  async function signOut() {
    await authClient.signOut();
    window.location.assign("/");
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Open user menu"
        onClick={() => setOpen((value) => !value)}
        className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-aquamarine font-bold text-rich-black"
      >
        {user?.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={user.image} alt="" className="h-full w-full object-cover" />
        ) : (
          initial
        )}
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 z-10 mt-2 w-60 overflow-hidden rounded border border-white/10 bg-brunswick-green shadow-lg"
        >
          {user && (
            <div className="border-b border-white/10 px-4 py-3">
              <p className="truncate text-sm font-semibold text-white">
                {user.name}
              </p>
              <p className="truncate text-xs text-white/60">{user.email}</p>
            </div>
          )}
          {links.map((link) => (
            <a
              key={link.href}
              role="menuitem"
              href={link.href}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-white hover:bg-white/5"
            >
              <span className="h-4 w-4 fill-current text-white/60">
                {link.icon}
              </span>
              {link.label}
            </a>
          ))}
          <button
            type="button"
            role="menuitem"
            onClick={signOut}
            className="w-full border-t border-white/10 px-4 py-2.5 text-left text-sm text-white hover:bg-white/5"
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}
