import { emailLayout, button } from "./layout";
import { REVIEWER_LABELS, type Reviewer } from "@/lib/auth/constants";

export function acceptedToRequester(params: {
  id: string;
  title: string;
  owner: Reviewer | null;
  appUrl: string;
}) {
  const subject = `Your request "${params.title}" has been accepted`;
  const statusLink = `${params.appUrl}/r/${params.id}`;
  const ownerLabel = params.owner ? REVIEWER_LABELS[params.owner] : "the CI team";

  const html = emailLayout(`
    <h1 style="font-size:18px;margin:0 0 12px;">Good news — your request was accepted</h1>
    <p style="margin:0 0 12px;">"${params.title}" has been accepted and is now being worked on by <strong>${ownerLabel}</strong>.</p>
    <p style="margin:0;">You can check on progress anytime using the link below.</p>
    ${button(statusLink, "View status")}
  `);

  const text = `Your request "${params.title}" has been accepted and is now being worked on by ${ownerLabel}.

Check progress: ${statusLink}`;

  return { subject, html, text };
}
