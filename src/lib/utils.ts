export const TYPE_LABELS: Record<string, string> = {
  report: "Analytical Report",
  automation: "Automation",
  sop: "SOP",
  other: "Other",
};

export const PRIORITY_LABELS: Record<string, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
  urgent: "Urgent",
};

export const STATUS_LABELS: Record<string, string> = {
  submitted: "Submitted",
  accepted: "Accepted",
  declined: "Declined",
  in_progress: "In Progress",
  blocked: "Blocked",
  done: "Done",
};

export const STATUS_COLORS: Record<string, string> = {
  submitted: "bg-slate-100 text-slate-700",
  accepted: "bg-blue-100 text-blue-700",
  declined: "bg-red-100 text-red-700",
  in_progress: "bg-amber-100 text-amber-700",
  blocked: "bg-orange-100 text-orange-800",
  done: "bg-green-100 text-green-700",
};

export function formatDate(value: string | Date | null | undefined): string {
  if (!value) return "—";
  const d = typeof value === "string" ? new Date(value) : value;
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatDateTime(value: string | Date | null | undefined): string {
  if (!value) return "—";
  const d = typeof value === "string" ? new Date(value) : value;
  return d.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}
