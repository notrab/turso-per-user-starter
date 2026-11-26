"use client";

import { UserButton } from "@clerk/nextjs";

import type { UserMenuProps } from "../../types";

export function UserMenu({ links = [] }: UserMenuProps) {
  if (links.length === 0) return <UserButton />;

  return (
    <UserButton>
      <UserButton.MenuItems>
        {links.map((link) => (
          <UserButton.Link
            key={link.href}
            label={link.label}
            labelIcon={link.icon}
            href={link.href}
          />
        ))}
      </UserButton.MenuItems>
    </UserButton>
  );
}
