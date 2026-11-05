import { STATUS_COLORS, STATUS_LABELS } from "@/lib/utils";

export function StatusBadge({ status }: { status: string }) {
  const color = STATUS_COLORS[status] ?? "bg-zinc-100 text-zinc-700";
  const label = STATUS_LABELS[status] ?? status;
  return (
    <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${color}`}>
      {label}
    </span>
  );
}
