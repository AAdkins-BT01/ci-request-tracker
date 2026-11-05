import Link from "next/link";
import { StatusBadge } from "@/components/StatusBadge";
import { REVIEWER_LABELS, type Reviewer } from "@/lib/auth/constants";
import { TYPE_LABELS, PRIORITY_LABELS, formatDate } from "@/lib/utils";
import type { Request } from "@/lib/db/schema";

export function RequestTable({ requests }: { requests: Request[] }) {
  if (requests.length === 0) {
    return <p className="text-sm text-zinc-500 py-8 text-center">No requests match these filters.</p>;
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-zinc-200 bg-white">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="border-b border-zinc-200 text-left text-xs uppercase text-zinc-400">
            <th className="px-4 py-3">Title</th>
            <th className="px-4 py-3">Type</th>
            <th className="px-4 py-3">Priority</th>
            <th className="px-4 py-3">Department</th>
            <th className="px-4 py-3">Owner</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Needed by</th>
            <th className="px-4 py-3">Submitted</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((r) => (
            <tr key={r.id} className="border-b border-zinc-100 last:border-0 hover:bg-zinc-50">
              <td className="px-4 py-3">
                <Link href={`/review/${r.id}`} className="font-medium text-blue-600 hover:underline">
                  {r.title}
                </Link>
                <p className="text-xs text-zinc-400">{r.requesterName}</p>
              </td>
              <td className="px-4 py-3">{TYPE_LABELS[r.type]}</td>
              <td className="px-4 py-3">{PRIORITY_LABELS[r.priority]}</td>
              <td className="px-4 py-3">{r.department}</td>
              <td className="px-4 py-3">{r.owner ? REVIEWER_LABELS[r.owner as Reviewer] : "—"}</td>
              <td className="px-4 py-3">
                <StatusBadge status={r.status} />
              </td>
              <td className="px-4 py-3">{r.neededBy ? formatDate(r.neededBy) : "—"}</td>
              <td className="px-4 py-3">{formatDate(r.createdAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
