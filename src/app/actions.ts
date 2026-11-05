"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { requests } from "@/lib/db/schema";
import { sendNewRequestEmail } from "@/lib/email/send";

export type ActionState = { error?: string };

const createRequestSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(200),
  description: z.string().trim().min(1, "Description is required").max(5000),
  type: z.enum(["report", "automation", "sop", "other"]),
  priority: z.enum(["low", "medium", "high", "urgent"]),
  neededBy: z
    .string()
    .trim()
    .optional()
    .transform((v) => (v ? v : null)),
  department: z.string().trim().min(1, "Department is required").max(200),
  requesterName: z.string().trim().min(1, "Your name is required").max(200),
  requesterEmail: z.string().trim().email("Enter a valid email address"),
});

export async function createRequest(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = createRequestSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  let newId: string;
  try {
    const [row] = await db
      .insert(requests)
      .values({
        title: parsed.data.title,
        description: parsed.data.description,
        type: parsed.data.type,
        priority: parsed.data.priority,
        neededBy: parsed.data.neededBy,
        department: parsed.data.department,
        requesterName: parsed.data.requesterName,
        requesterEmail: parsed.data.requesterEmail,
      })
      .returning();
    newId = row.id;
    await sendNewRequestEmail(row);
  } catch (err) {
    console.error("[createRequest] failed:", err);
    // TEMP DEBUG — remove before considering this done
    return { error: `DEBUG: ${err instanceof Error ? err.message : String(err)}` };
  }

  redirect(`/r/${newId}`);
}
