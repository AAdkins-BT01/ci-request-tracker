# CI Request Tracker — Project Brief

## Purpose
A web app for the Continuous Improvement function (Anna, Mike, Keith) to intake, triage, and track requests from employees for things they can't do themselves: analytical reports, automation, SOPs, or other IT/support-adjacent work.

## Who it's for
- **Requesters:** ~100 employees company-wide. No login required — they identify themselves by entering name/email on the form.
- **Reviewers/owners:** Anna, Mike, Keith. Share one login/access level (no need for separate accounts), but every action (approval, decline, assignment, notes) must record **which of the three did it**.

## Core workflow
1. **Submit:** Employee fills out a form with:
   - Title/description of the request
   - Request type (dropdown: Analytical Report / Automation / SOP / Other)
   - Priority/urgency (requester's suggestion)
   - Needed-by date
   - Department/team
   - Requester name + email
2. **Triage:** Anna/Mike/Keith see new requests and either:
   - **Accept** — optionally assign to one of the three as owner
   - **Decline** — must enter a reason, visible to the requester
3. **Track progress** (accepted requests only):
   - Status (e.g., Not Started / In Progress / Blocked / Done)
   - Free-text progress notes (timestamped, log-style — not overwritten)
   - Hours spent (running total, loggable incrementally)
   - % complete
   - Who's currently working it
4. **Complete:**
   - Mark as Done
   - Record a free-text "where it lives" field (e.g., a pasted Google Drive link, "Claude project: X", a file path, etc.) — no structured location picker, just a box.
5. **Notifications (email):**
   - Requester gets emailed when their request is Accepted, Declined (with reason), or Completed (with the "where it lives" info).
   - Anna/Mike/Keith get emailed when a new request comes in.

## Visibility
- Requesters can view the status of their own submitted requests (e.g., via a link or lookup by email) — no login needed.
- Anna/Mike/Keith see all requests, can filter/sort by status, type, department, owner, priority.

## What already exists
Nothing — there's no current system, spreadsheet, or process for this today. This replaces ad hoc email/verbal requests.

## Technical approach
- Web app with a shareable link, accessible to anyone in the company (no SSO/auth system needed for requesters).
- Simple shared-password or similar lightweight gate for the Anna/Mike/Keith review view (not full user accounts) — enough to track "who did what" without building real auth.
- Persistent database (so data survives and is queryable/reportable over time).
- Transactional email sending for the notifications above.
- Hosting: no infrastructure preference — pick a low-cost, low-maintenance stack.

## Constraints
- **Budget:** small, ~$5–20/month is fine (hosting + email + database).
- **Timeline:** as fast as possible — target a working version live within days, not weeks.

## Definition of done / how we'll check it
The project is done when Anna can, end-to-end, in a browser:
1. Open the public link and submit a test request as a fake employee.
2. Log in to the reviewer view as herself, see the new request, and Accept it with an assignee, or Decline it with a reason.
3. Confirm the test requester receives an email reflecting that decision.
4. On an accepted request, add a progress note, log hours, update % complete, and change status.
5. Mark it Done, add a "where it lives" note, and confirm the requester gets a completion email containing that note.
6. See all of the above reflected correctly when revisiting the request list (nothing lost on refresh).

## Out of scope (for this version)
- Mobile app (web app is fine on mobile browsers, no native app).
- Real SSO/company identity integration — lightweight shared access for reviewers is enough.
- Automatic creation of Google Drive folders/Claude projects — just a manual text/link field.
- Reporting/analytics dashboards beyond basic filtering/sorting of the request list.
- Reopening or appealing declined requests (can be added later if needed).
