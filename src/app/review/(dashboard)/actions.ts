"use server";

import { redirect } from "next/navigation";
import { getSession, setSession } from "@/lib/auth/session";
import { isReviewer } from "@/lib/auth/constants";

export async function setActingAs(formData: FormData): Promise<void> {
  const session = await getSession();
  if (!session) redirect("/review/login");

  const actingAs = formData.get("actingAs");
  const redirectTo = formData.get("redirectTo");

  if (typeof actingAs === "string" && isReviewer(actingAs)) {
    await setSession(actingAs);
  }

  redirect(typeof redirectTo === "string" && redirectTo ? redirectTo : "/review");
}

export async function logout(): Promise<void> {
  const { clearSession } = await import("@/lib/auth/session");
  await clearSession();
  redirect("/review/login");
}
