"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { REVIEWERS, REVIEWER_LABELS } from "@/lib/auth/constants";
import { TYPE_LABELS, PRIORITY_LABELS, STATUS_LABELS } from "@/lib/utils";

const FILTER_KEYS = ["status", "type", "department", "owner", "priority"] as const;

export function FilterBar({ departments }: { departments: string[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function setParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    router.push(`${pathname}?${params.toString()}`);
  }

  function clearAll() {
    router.push(pathname);
  }

  const hasFilters = FILTER_KEYS.some((k) => searchParams.get(k));

  return (
    <div className="flex flex-wrap items-center gap-3 mb-4">
      <select
        value={searchParams.get("status") ?? ""}
        onChange={(e) => setParam("status", e.target.value)}
        className="rounded-md border border-zinc-300 px-2 py-1.5 text-sm bg-white"
      >
        <option value="">All statuses</option>
        {Object.entries(STATUS_LABELS).map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>

      <select
        value={searchParams.get("type") ?? ""}
        onChange={(e) => setParam("type", e.target.value)}
        className="rounded-md border border-zinc-300 px-2 py-1.5 text-sm bg-white"
      >
        <option value="">All types</option>
        {Object.entries(TYPE_LABELS).map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>

      <select
        value={searchParams.get("priority") ?? ""}
        onChange={(e) => setParam("priority", e.target.value)}
        className="rounded-md border border-zinc-300 px-2 py-1.5 text-sm bg-white"
      >
        <option value="">All priorities</option>
        {Object.entries(PRIORITY_LABELS).map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>

      <select
        value={searchParams.get("owner") ?? ""}
        onChange={(e) => setParam("owner", e.target.value)}
        className="rounded-md border border-zinc-300 px-2 py-1.5 text-sm bg-white"
      >
        <option value="">All owners</option>
        <option value="unassigned">Unassigned</option>
        {REVIEWERS.map((r) => (
          <option key={r} value={r}>
            {REVIEWER_LABELS[r]}
          </option>
        ))}
      </select>

      <select
        value={searchParams.get("department") ?? ""}
        onChange={(e) => setParam("department", e.target.value)}
        className="rounded-md border border-zinc-300 px-2 py-1.5 text-sm bg-white"
      >
        <option value="">All departments</option>
        {departments.map((d) => (
          <option key={d} value={d}>
            {d}
          </option>
        ))}
      </select>

      {hasFilters && (
        <button onClick={clearAll} className="text-sm text-blue-600 hover:underline">
          Clear filters
        </button>
      )}
    </div>
  );
}
