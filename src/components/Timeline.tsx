import { REVIEWER_LABELS, type Reviewer } from "@/lib/auth/constants";
import { formatDateTime } from "@/lib/utils";
import type { ActivityLogEntry } from "@/lib/db/schema";

type Props = {
  createdAt: Date;
  entries: ActivityLogEntry[];
};

export function Timeline({ createdAt, entries }: Props) {
  return (
    <ol className="space-y-4">
      <li className="border-l-2 border-zinc-200 pl-4">
        <p className="text-xs text-zinc-400">{formatDateTime(createdAt)}</p>
        <p className="text-sm">Request submitted</p>
      </li>
      {entries.map((entry) => (
        <li key={entry.id} className="border-l-2 border-zinc-200 pl-4">
          <p className="text-xs text-zinc-400">
            {formatDateTime(entry.createdAt)} · {REVIEWER_LABELS[entry.author as Reviewer]}
          </p>
          {entry.statusChange && (
            <p className="text-sm font-medium">{entry.statusChange}</p>
          )}
          {entry.note && <p className="text-sm whitespace-pre-wrap">{entry.note}</p>}
          {entry.hoursDelta && (
            <p className="text-sm text-zinc-500">+{entry.hoursDelta} hours logged</p>
          )}
        </li>
      ))}
    </ol>
  );
}
