import { emailLayout, button } from "./layout";
import { TYPE_LABELS, PRIORITY_LABELS, formatDate } from "@/lib/utils";

export function newRequestToReviewers(params: {
  id: string;
  title: string;
  description: string;
  type: string;
  priority: string;
  department: string;
  neededBy: string | null;
  requesterName: string;
  requesterEmail: string;
  appUrl: string;
}) {
  const subject = `New CI request: ${params.title}`;
  const reviewLink = `${params.appUrl}/review/${params.id}`;

  const html = emailLayout(`
    <h1 style="font-size:18px;margin:0 0 12px;">New request: ${params.title}</h1>
    <p style="margin:0 0 4px;"><strong>From:</strong> ${params.requesterName} (${params.requesterEmail})</p>
    <p style="margin:0 0 4px;"><strong>Department:</strong> ${params.department}</p>
    <p style="margin:0 0 4px;"><strong>Type:</strong> ${TYPE_LABELS[params.type] ?? params.type}</p>
    <p style="margin:0 0 4px;"><strong>Priority:</strong> ${PRIORITY_LABELS[params.priority] ?? params.priority}</p>
    <p style="margin:0 0 4px;"><strong>Needed by:</strong> ${params.neededBy ? formatDate(params.neededBy) : "No date given"}</p>
    <p style="margin:16px 0 0;white-space:pre-wrap;">${params.description}</p>
    ${button(reviewLink, "Review this request")}
  `);

  const text = `New request: ${params.title}
From: ${params.requesterName} (${params.requesterEmail})
Department: ${params.department}
Type: ${TYPE_LABELS[params.type] ?? params.type}
Priority: ${PRIORITY_LABELS[params.priority] ?? params.priority}
Needed by: ${params.neededBy ? formatDate(params.neededBy) : "No date given"}

${params.description}

Review: ${reviewLink}`;

  return { subject, html, text };
}
