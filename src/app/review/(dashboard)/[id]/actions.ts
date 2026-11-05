"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { eq, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { requests, activityLog } from "@/lib/db/schema";
import { getSession } from "@/lib/auth/session";
import { sendAcceptedEmail, sendDeclinedEmail, sendCompletedEmail } from "@/lib/email/send";
import { REVIEWER_LABELS, isReviewer, type Reviewer } from "@/lib/auth/constants";
import { STATUS_LABELS, clamp } from "@/lib/utils";

export type ActionState = { error?: string };

const NO_ACTING_AS_ERROR = "Select who you are (top right) before taking this action.";

async function requireActingAs(): Promise<Reviewer | null> {
  const session = await getSession();
  if (!session) redirect("/review/login");
  return session.actingAs;
}

function revalidateRequest(id: string) {
  revalidatePath(`/review/${id}`);
  revalidatePath("/review");
  revalidatePath(`/r/${id}`);
}

export async function acceptRequest(
  id: string,
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const actingAs = await requireActingAs();
  if (!actingAs) return { error: NO_ACTING_AS_ERROR };

  const owner = formData.get("owner");
  if (typeof owner !== "string" || !isReviewer(owner)) {
    return { error: "Choose an owner to assign this to." };
  }

  try {
    const updated = await db.transaction(async (tx) => {
      const [row] = await tx
        .update(requests)
        .set({ status: "accepted", owner, acceptedAt: new Date(), updatedAt: new Date() })
        .where(eq(requests.id, id))
        .returning();
      await tx.insert(activityLog).values({
        requestId: id,
        author: actingAs,
        statusChange: `Accepted — assigned to ${REVIEWER_LABELS[owner]}`,
        visibleToRequester: true,
      });
      return row;
    });
    await sendAcceptedEmail(updated);
  } catch (err) {
    console.error("[acceptRequest] failed:", err);
    return { error: "Something went wrong. Please try again." };
  }

  revalidateRequest(id);
  return {};
}

export async function declineRequest(
  id: string,
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const actingAs = await requireActingAs();
  if (!actingAs) return { error: NO_ACTING_AS_ERROR };

  const reason = formData.get("reason");
  if (typeof reason !== "string" || !reason.trim()) {
    return { error: "A reason is required to decline a request." };
  }

  try {
    const updated = await db.transaction(async (tx) => {
      const [row] = await tx
        .update(requests)
        .set({ status: "declined", declineReason: reason.trim(), updatedAt: new Date() })
        .where(eq(requests.id, id))
        .returning();
      await tx.insert(activityLog).values({
        requestId: id,
        author: actingAs,
        statusChange: "Declined",
        visibleToRequester: true,
      });
      return row;
    });
    await sendDeclinedEmail(updated);
  } catch (err) {
    console.error("[declineRequest] failed:", err);
    return { error: "Something went wrong. Please try again." };
  }

  revalidateRequest(id);
  return {};
}

const ACTIVE_STATUSES = ["accepted", "in_progress", "blocked"];

export async function addProgressUpdate(
  id: string,
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const actingAs = await requireActingAs();
  if (!actingAs) return { error: NO_ACTING_AS_ERROR };

  const statusRaw = formData.get("status");
  const percentRaw = formData.get("percentComplete");
  const hoursRaw = formData.get("hoursDelta");
  const noteRaw = formData.get("note");
  const internal = formData.get("internal") === "on";

  const status = typeof statusRaw === "string" && statusRaw ? statusRaw : null;
  if (status && !ACTIVE_STATUSES.includes(status)) {
    return { error: "Invalid status." };
  }

  let percent: number | null = null;
  if (typeof percentRaw === "string" && percentRaw !== "") {
    const n = Number(percentRaw);
    if (Number.isNaN(n)) return { error: "% complete must be a number." };
    percent = clamp(Math.round(n), 0, 100);
  }

  let hoursDelta: number | null = null;
  if (typeof hoursRaw === "string" && hoursRaw !== "") {
    const n = Number(hoursRaw);
    if (Number.isNaN(n) || n < 0) return { error: "Hours must be a positive number." };
    hoursDelta = n;
  }

  const note = typeof noteRaw === "string" ? noteRaw.trim() : "";

  try {
    await db.transaction(async (tx) => {
      const [current] = await tx.select().from(requests).where(eq(requests.id, id)).limit(1);
      if (!current) throw new Error("Request not found");

      const updates: Partial<typeof requests.$inferInsert> = { updatedAt: new Date() };
      let statusChangeText: string | null = null;
      if (status && status !== current.status) {
        updates.status = status as typeof current.status;
        statusChangeText = `${STATUS_LABELS[current.status]} → ${STATUS_LABELS[status]}`;
      }
      if (percent !== null) updates.percentComplete = percent;
      if (hoursDelta !== null) {
        updates.totalHours = sql`${requests.totalHours} + ${hoursDelta}` as unknown as string;
      }

      await tx.update(requests).set(updates).where(eq(requests.id, id));

      if (note || hoursDelta !== null || statusChangeText) {
        await tx.insert(activityLog).values({
          requestId: id,
          author: actingAs,
          note: note || null,
          hoursDelta: hoursDelta !== null ? hoursDelta.toString() : null,
          statusChange: statusChangeText,
          visibleToRequester: !internal,
        });
      }
    });
  } catch (err) {
    console.error("[addProgressUpdate] failed:", err);
    return { error: "Something went wrong. Please try again." };
  }

  revalidateRequest(id);
  return {};
}

export async function completeRequest(
  id: string,
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const actingAs = await requireActingAs();
  if (!actingAs) return { error: NO_ACTING_AS_ERROR };

  const locationNote = formData.get("locationNote");
  if (typeof locationNote !== "string" || !locationNote.trim()) {
    return { error: "Add where this lives before marking it done." };
  }

  try {
    const updated = await db.transaction(async (tx) => {
      const [row] = await tx
        .update(requests)
        .set({
          status: "done",
          completedAt: new Date(),
          locationNote: locationNote.trim(),
          percentComplete: 100,
          updatedAt: new Date(),
        })
        .where(eq(requests.id, id))
        .returning();
      await tx.insert(activityLog).values({
        requestId: id,
        author: actingAs,
        statusChange: "Marked Done",
        visibleToRequester: true,
      });
      return row;
    });
    await sendCompletedEmail(updated);
  } catch (err) {
    console.error("[completeRequest] failed:", err);
    return { error: "Something went wrong. Please try again." };
  }

  revalidateRequest(id);
  return {};
}
