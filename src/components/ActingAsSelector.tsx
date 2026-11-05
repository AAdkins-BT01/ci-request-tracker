"use client";

import { useRef } from "react";
import { usePathname } from "next/navigation";
import { setActingAs } from "@/app/review/(dashboard)/actions";
import { REVIEWERS, REVIEWER_LABELS, type Reviewer } from "@/lib/auth/constants";

export function ActingAsSelector({ current }: { current: Reviewer | null }) {
  const pathname = usePathname();
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form ref={formRef} action={setActingAs} className="flex items-center gap-2">
      <input type="hidden" name="redirectTo" value={pathname} />
      <label htmlFor="actingAs" className="text-sm text-zinc-500">
        Acting as
      </label>
      <select
        id="actingAs"
        name="actingAs"
        defaultValue={current ?? ""}
        onChange={() => formRef.current?.requestSubmit()}
        className="rounded-md border border-zinc-300 px-2 py-1 text-sm bg-white"
      >
        <option value="" disabled>
          Select…
        </option>
        {REVIEWERS.map((r) => (
          <option key={r} value={r}>
            {REVIEWER_LABELS[r]}
          </option>
        ))}
      </select>
    </form>
  );
}
