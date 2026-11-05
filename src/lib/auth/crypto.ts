import { isReviewer } from "./constants";
import type { Reviewer } from "./constants";

export type SessionPayload = {
  authenticated: true;
  actingAs: Reviewer | null;
  iat: number;
};

function getSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret) throw new Error("SESSION_SECRET is not set");
  return secret;
}

function base64urlEncode(bytes: Uint8Array): string {
  let binary = "";
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64urlDecode(value: string): Uint8Array {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/");
  const binary = atob(padded.padEnd(padded.length + ((4 - (padded.length % 4)) % 4), "="));
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

async function getKey(): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  return crypto.subtle.importKey(
    "raw",
    encoder.encode(getSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );
}

export async function signSession(payload: SessionPayload): Promise<string> {
  const key = await getKey();
  const encoder = new TextEncoder();
  const payloadBytes = encoder.encode(JSON.stringify(payload));
  const payloadPart = base64urlEncode(payloadBytes);
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(payloadPart));
  const signaturePart = base64urlEncode(new Uint8Array(signature));
  return `${payloadPart}.${signaturePart}`;
}

export async function verifySessionToken(
  token: string | undefined,
): Promise<SessionPayload | null> {
  if (!token) return null;
  const [payloadPart, signaturePart] = token.split(".");
  if (!payloadPart || !signaturePart) return null;

  try {
    const key = await getKey();
    const encoder = new TextEncoder();
    const valid = await crypto.subtle.verify(
      "HMAC",
      key,
      base64urlDecode(signaturePart) as BufferSource,
      encoder.encode(payloadPart) as BufferSource,
    );
    if (!valid) return null;

    const payload = JSON.parse(new TextDecoder().decode(base64urlDecode(payloadPart)));
    if (
      payload &&
      payload.authenticated === true &&
      (payload.actingAs === null || isReviewer(payload.actingAs))
    ) {
      return payload as SessionPayload;
    }
    return null;
  } catch {
    return null;
  }
}

export const SESSION_COOKIE = "ci_review_session";
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 30; // 30 days
