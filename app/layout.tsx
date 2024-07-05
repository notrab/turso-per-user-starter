import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";

import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Turso Platforms Starter",
  description: "Database per user starter with Turso, Clerk, and SQLite",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`bg-neutral-900 overscroll-none ${inter.className}`}>
          {children}

          <div className="text-center">
            <a
              href="https://github.com/notrab/turso-platforms-starter"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-[#4FF8D2] transition"
            >
              Get the code
            </a>
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
