import { cookies } from "next/headers";
import {
  signSession,
  verifySessionToken,
  SESSION_COOKIE,
  SESSION_MAX_AGE_SECONDS,
  type SessionPayload,
} from "./crypto";
import { REVIEWERS, type Reviewer } from "./constants";

export { SESSION_COOKIE };
export type { SessionPayload };

/** Server Component / Server Action helper: read the current session from cookies(). */
export async function getSession(): Promise<SessionPayload | null> {
  const store = await cookies();
  return verifySessionToken(store.get(SESSION_COOKIE)?.value);
}

/** Server Action helper: set the session cookie (login, or changing "acting as"). */
export async function setSession(actingAs: Reviewer | null): Promise<void> {
  const token = await signSession({ authenticated: true, actingAs, iat: Date.now() });
  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_MAX_AGE_SECONDS,
    path: "/",
  });
}

export async function clearSession(): Promise<void> {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}

export { REVIEWERS };
export type { Reviewer };
