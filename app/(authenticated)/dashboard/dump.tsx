import Link from "next/link";

export function Dump() {
  return (
    <a
      download
      href="/dump.sql"
      className="bg-[#4FF8D2] px-3 py-1.5 rounded text-sm font-medium"
    >
      Download my data
    </a>
  );
}
