import { createClient, type InValue, type Value } from "@libsql/client";

import type { DatabaseCredentials } from "./types";

// A SQL dump built over a plain libSQL connection, for providers with no
// export endpoint. The output matches sqlite3's .dump closely enough to load
// with `sqlite3 new.db < dump.sql`.
//
// The whole dump is built in memory, which is fine for the small
// per-user databases this starter is designed for.

const quoteIdentifier = (name: string) => `"${name.replace(/"/g, '""')}"`;

function sqlLiteral(value: Value | InValue): string {
  if (value === null || value === undefined) return "NULL";
  if (typeof value === "bigint") return value.toString();
  if (typeof value === "number") {
    if (!Number.isFinite(value)) return "NULL";
    // Keep REAL values REAL when they happen to be whole numbers.
    return Number.isInteger(value) ? `${value}.0` : String(value);
  }
  if (typeof value === "boolean") return value ? "1" : "0";
  if (value instanceof ArrayBuffer || ArrayBuffer.isView(value)) {
    const bytes =
      value instanceof ArrayBuffer
        ? new Uint8Array(value)
        : new Uint8Array(value.buffer, value.byteOffset, value.byteLength);
    return `X'${Buffer.from(bytes).toString("hex")}'`;
  }
  if (value instanceof Date) return `'${value.toISOString()}'`;
  return `'${String(value).replace(/'/g, "''")}'`;
}

export async function dumpDatabase(credentials: DatabaseCredentials): Promise<string> {
  // bigint keeps large integers exact, and lets integers and reals be told apart.
  const client = createClient({ ...credentials, intMode: "bigint" });

  try {
    const lines = ["PRAGMA foreign_keys=OFF;", "BEGIN TRANSACTION;"];

    const schema = await client.execute(
      "SELECT type, name, sql FROM sqlite_master WHERE sql IS NOT NULL ORDER BY rowid",
    );

    const objects = schema.rows.map((row) => ({
      type: String(row.type),
      name: String(row.name),
      sql: String(row.sql),
    }));

    // Tables and their rows first, then indexes, triggers and views that depend on them.
    for (const table of objects.filter((o) => o.type === "table")) {
      if (table.name.startsWith("sqlite_")) continue;

      lines.push(`${table.sql};`);

      const rows = await client.execute(`SELECT * FROM ${quoteIdentifier(table.name)}`);
      for (const row of rows.rows) {
        const values = Array.from({ length: rows.columns.length }, (_, i) =>
          sqlLiteral(row[i]),
        );
        lines.push(
          `INSERT INTO ${quoteIdentifier(table.name)} VALUES(${values.join(",")});`,
        );
      }
    }

    // AUTOINCREMENT counters, so restored tables keep issuing new IDs.
    if (objects.some((o) => o.name === "sqlite_sequence")) {
      const sequences = await client.execute("SELECT name, seq FROM sqlite_sequence");
      if (sequences.rows.length > 0) lines.push("DELETE FROM sqlite_sequence;");
      for (const row of sequences.rows) {
        lines.push(
          `INSERT INTO sqlite_sequence VALUES(${sqlLiteral(row.name)},${sqlLiteral(row.seq)});`,
        );
      }
    }

    for (const type of ["index", "trigger", "view"]) {
      for (const object of objects.filter((o) => o.type === type)) {
        lines.push(`${object.sql};`);
      }
    }

    lines.push("COMMIT;");
    return lines.join("\n") + "\n";
  } finally {
    client.close();
  }
}
