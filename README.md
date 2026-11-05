# CI Request Tracker

A web app for the Continuous Improvement team (Anna, Mike, Keith) to intake, triage, and
track requests from employees — analytical reports, automation, SOPs, and other
IT/support-adjacent asks. See `BRIEF.md` for the full project brief.

## What's built

- Public request form at `/` — anyone can submit a request, no login required.
- Public status page at `/r/[id]` — the link emailed to requesters so they can check progress.
- Reviewer dashboard at `/review` (password-gated) — list, filter, and triage requests.
- Accept/decline, progress tracking (status/%/hours/notes), and completion flows with
  email notifications at each stage.

This has been built and verified end-to-end against a local test database. It is **not
yet deployed** — see below for what's needed to go live.

## Local development

```bash
npm install
npm run db:migrate   # applies the schema to DATABASE_URL
npm run dev
```

Copy `.env.example` to `.env.local` and fill in real values (see below) before running.

## Required accounts / setup before deploying

1. **Database — Neon** (free tier): create an account at [neon.tech](https://neon.tech),
   create a project, and copy the **pooled** connection string into `DATABASE_URL`.
2. **Email — Google Workspace App Password**: the app sends email through a Workspace
   mailbox via SMTP (not a third-party email service, since that would require DNS domain
   verification we don't have). Steps:
   - Make sure 2-Step Verification is turned on for the sending account (e.g.
     `anna@bellaterrade.com`).
   - Generate an App Password at [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords).
   - Set `GMAIL_USER` to that mailbox and `GMAIL_APP_PASSWORD` to the generated password.
   - **Risk:** if a Workspace admin policy blocks app passwords org-wide, this step will
     fail — ask your admin to allow it for this one account, or this won't be able to send mail.
3. **`REVIEW_PASSWORD`**: pick any password and share it with Mike and Keith directly
   (Slack/text, not email). This is the one shared password that gates `/review`.
4. **`SESSION_SECRET`**: generate with `openssl rand -hex 32`.
5. **GitHub + Vercel**: this project isn't pushed to GitHub yet. To deploy:
   - Create a GitHub repo (e.g. `ci-request-tracker`).
   - Push this code to it.
   - Create a free Vercel account at [vercel.com](https://vercel.com) (GitHub login works),
     import the repo — Vercel auto-detects Next.js.
   - In the Vercel project's Settings → Environment Variables, add every variable from
     `.env.example` with real values, including `APP_URL` set to the Vercel-assigned URL
     (or custom domain) once you know it.
   - Run `npm run db:migrate` once locally against the production `DATABASE_URL` to create
     the tables (don't auto-migrate on every deploy).

## Verifying it works

Run through this once locally and once more after deploying:

1. Submit a test request at `/` with an email you can check.
2. Confirm the CI team's new-request notification email arrives.
3. Log in at `/review/login`, pick "Acting as", accept the request with an owner (or
   decline with a reason).
4. Confirm the requester gets the corresponding email with a working `/r/[id]` link.
5. Add a progress note with hours and a % update; confirm hours accumulate rather than
   overwrite on a second update.
6. Mark it Done with a location note; confirm the requester's completion email contains
   that exact note.
7. Refresh everything in a new tab to confirm nothing was only held in memory.
