import { getTransporter, getFromAddress } from "./client";
import { newRequestToReviewers } from "./templates/newRequestToReviewers";
import { acceptedToRequester } from "./templates/acceptedToRequester";
import { declinedToRequester } from "./templates/declinedToRequester";
import { completedToRequester } from "./templates/completedToRequester";
import type { Reviewer } from "@/lib/auth/constants";
import type { Request } from "@/lib/db/schema";

function appUrl(): string {
  return process.env.APP_URL ?? "http://localhost:3000";
}

async function safeSend(to: string, built: { subject: string; html: string; text: string }) {
  try {
    const transporter = getTransporter();
    await transporter.sendMail({
      from: getFromAddress(),
      to,
      subject: built.subject,
      html: built.html,
      text: built.text,
    });
  } catch (err) {
    console.error(`[email] failed to send "${built.subject}" to ${to}:`, err);
  }
}

export async function sendNewRequestEmail(request: Request) {
  const recipients = (process.env.REVIEWER_NOTIFICATION_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim())
    .filter(Boolean);
  if (recipients.length === 0) {
    console.error("[email] REVIEWER_NOTIFICATION_EMAILS is not set, skipping notification");
    return;
  }

  const built = newRequestToReviewers({
    id: request.id,
    title: request.title,
    description: request.description,
    type: request.type,
    priority: request.priority,
    department: request.department,
    neededBy: request.neededBy,
    requesterName: request.requesterName,
    requesterEmail: request.requesterEmail,
    appUrl: appUrl(),
  });

  await Promise.all(recipients.map((to) => safeSend(to, built)));
}

export async function sendAcceptedEmail(request: Request) {
  const built = acceptedToRequester({
    id: request.id,
    title: request.title,
    owner: request.owner as Reviewer | null,
    appUrl: appUrl(),
  });
  await safeSend(request.requesterEmail, built);
}

export async function sendDeclinedEmail(request: Request) {
  const built = declinedToRequester({
    id: request.id,
    title: request.title,
    reason: request.declineReason ?? "",
    appUrl: appUrl(),
  });
  await safeSend(request.requesterEmail, built);
}

export async function sendCompletedEmail(request: Request) {
  const built = completedToRequester({
    id: request.id,
    title: request.title,
    locationNote: request.locationNote ?? "",
    appUrl: appUrl(),
  });
  await safeSend(request.requesterEmail, built);
}
