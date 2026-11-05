import { emailLayout, button } from "./layout";

export function completedToRequester(params: {
  id: string;
  title: string;
  locationNote: string;
  appUrl: string;
}) {
  const subject = `Your request "${params.title}" is complete`;
  const statusLink = `${params.appUrl}/r/${params.id}`;

  const html = emailLayout(`
    <h1 style="font-size:18px;margin:0 0 12px;">Your request is done!</h1>
    <p style="margin:0 0 16px;">"${params.title}" has been completed. Here's where it lives:</p>
    <p style="margin:0 0 16px;padding:12px 16px;background:#f0fdf4;border-radius:6px;white-space:pre-wrap;font-weight:bold;">${params.locationNote}</p>
    ${button(statusLink, "View full history")}
  `);

  const text = `Your request "${params.title}" has been completed.

Where it lives: ${params.locationNote}

Full history: ${statusLink}`;

  return { subject, html, text };
}
