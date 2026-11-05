import { notFound } from "next/navigation";
import { eq, asc } from "drizzle-orm";
import { db } from "@/lib/db";
import { requests, activityLog } from "@/lib/db/schema";
import { StatusBadge } from "@/components/StatusBadge";
import { Timeline } from "@/components/Timeline";
import { AcceptDeclineForm } from "@/components/AcceptDeclineForm";
import { ProgressUpdateForm } from "@/components/ProgressUpdateForm";
import { CompleteForm } from "@/components/CompleteForm";
import { REVIEWER_LABELS, type Reviewer } from "@/lib/auth/constants";
import { TYPE_LABELS, PRIORITY_LABELS, formatDate } from "@/lib/utils";

export default async function ReviewRequestDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [request] = await db.select().from(requests).where(eq(requests.id, id)).limit(1);
  if (!request) notFound();

  const entries = await db
    .select()
    .from(activityLog)
    .where(eq(activityLog.requestId, id))
    .orderBy(asc(activityLog.createdAt));

  const isActive = ["accepted", "in_progress", "blocked"].includes(request.status);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">{request.title}</h1>
          <p className="mt-1 text-sm text-zinc-500">
            {TYPE_LABELS[request.type]} · {request.department} ·{" "}
            {PRIORITY_LABELS[request.priority]} priority · from {request.requesterName} (
            {request.requesterEmail})
          </p>
        </div>
        <StatusBadge status={request.status} />
      </div>

      <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm space-y-4">
        <div>
          <p className="text-xs font-medium uppercase text-zinc-400 mb-1">Description</p>
          <p className="text-sm whitespace-pre-wrap">{request.description}</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div>
            <p className="text-xs font-medium uppercase text-zinc-400 mb-1">Needed by</p>
            <p className="text-sm">{request.neededBy ? formatDate(request.neededBy) : "—"}</p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase text-zinc-400 mb-1">Owner</p>
            <p className="text-sm">
              {request.owner ? REVIEWER_LABELS[request.owner as Reviewer] : "Unassigned"}
            </p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase text-zinc-400 mb-1">% Complete</p>
            <p className="text-sm">{request.percentComplete}%</p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase text-zinc-400 mb-1">Hours spent</p>
            <p className="text-sm">{request.totalHours}</p>
          </div>
        </div>

        {request.status === "declined" && request.declineReason && (
          <div className="rounded-md bg-red-50 px-4 py-3">
            <p className="text-xs font-medium uppercase text-red-500 mb-1">Decline reason</p>
            <p className="text-sm text-red-700 whitespace-pre-wrap">{request.declineReason}</p>
          </div>
        )}

        {request.status === "done" && request.locationNote && (
          <div className="rounded-md bg-green-50 px-4 py-3">
            <p className="text-xs font-medium uppercase text-green-600 mb-1">Where it lives</p>
            <p className="text-sm text-green-800 whitespace-pre-wrap">{request.locationNote}</p>
          </div>
        )}
      </div>

      {request.status === "submitted" && <AcceptDeclineForm id={id} />}

      {isActive && (
        <ProgressUpdateForm
          key={request.updatedAt.toISOString()}
          id={id}
          currentStatus={request.status}
          currentPercent={request.percentComplete}
        />
      )}

      {isActive && <CompleteForm id={id} />}

      <div>
        <h2 className="text-sm font-semibold mb-4">History</h2>
        <Timeline createdAt={request.createdAt} entries={entries} />
      </div>
    </div>
  );
}
