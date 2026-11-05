export function emailLayout(bodyHtml: string): string {
  return `
<!doctype html>
<html>
  <body style="margin:0;padding:0;background:#f4f4f5;font-family:Arial,Helvetica,sans-serif;color:#18181b;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:24px 0;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" style="max-width:560px;background:#ffffff;border-radius:8px;padding:32px;">
            <tr>
              <td>
                <p style="margin:0 0 16px;font-size:13px;letter-spacing:.04em;text-transform:uppercase;color:#71717a;">CI Request Tracker</p>
                ${bodyHtml}
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

export function button(href: string, label: string): string {
  return `<p style="margin:24px 0;"><a href="${href}" style="background:#2563eb;color:#ffffff;text-decoration:none;padding:10px 20px;border-radius:6px;font-size:14px;display:inline-block;">${label}</a></p>`;
}
