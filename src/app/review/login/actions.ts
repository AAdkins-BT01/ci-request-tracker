"use server";

import { redirect } from "next/navigation";
import { setSession } from "@/lib/auth/session";
import { isReviewer } from "@/lib/auth/constants";

export type LoginState = { error?: string };

export async function login(_prevState: LoginState, formData: FormData): Promise<LoginState> {
  const password = formData.get("password");
  const actingAs = formData.get("actingAs");
  const next = formData.get("next");

  const expected = process.env.REVIEW_PASSWORD;
  if (!expected) {
    return { error: "Review access isn't configured yet. Set REVIEW_PASSWORD." };
  }

  if (typeof password !== "string" || password !== expected) {
    return { error: "Incorrect password." };
  }

  if (typeof actingAs !== "string" || !isReviewer(actingAs)) {
    return { error: "Select who you are." };
  }

  await setSession(actingAs);

  const target = typeof next === "string" && next.startsWith("/review") ? next : "/review";
  redirect(target);
}
