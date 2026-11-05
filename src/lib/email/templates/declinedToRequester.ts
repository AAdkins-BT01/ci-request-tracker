import { emailLayout, button } from "./layout";

export function declinedToRequester(params: {
  id: string;
  title: string;
  reason: string;
  appUrl: string;
}) {
  const subject = `Update on your request "${params.title}"`;
  const statusLink = `${params.appUrl}/r/${params.id}`;

  const html = emailLayout(`
    <h1 style="font-size:18px;margin:0 0 12px;">We can't move forward with this request</h1>
    <p style="margin:0 0 12px;">Your request "${params.title}" was reviewed, but we're not able to take it on right now. Here's why:</p>
    <p style="margin:0 0 16px;padding:12px 16px;background:#fef2f2;border-radius:6px;white-space:pre-wrap;">${params.reason}</p>
    <p style="margin:0;">If you have questions or want to discuss alternatives, reach out to the Continuous Improvement team directly.</p>
    ${button(statusLink, "View details")}
  `);

  const text = `Your request "${params.title}" was reviewed, but we're not able to take it on right now.

Reason: ${params.reason}

Details: ${statusLink}`;

  return { subject, html, text };
}
