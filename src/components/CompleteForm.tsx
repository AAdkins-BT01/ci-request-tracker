"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { completeRequest, type ActionState } from "@/app/review/(dashboard)/[id]/actions";

const initialState: ActionState = {};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-md bg-green-600 px-4 py-2 text-sm text-white font-medium hover:bg-green-700 disabled:opacity-50"
    >
      {pending ? "Saving…" : "Mark Done"}
    </button>
  );
}

export function CompleteForm({ id }: { id: string }) {
  const [state, formAction] = useActionState(completeRequest.bind(null, id), initialState);

  return (
    <form action={formAction} className="rounded-lg border border-green-200 bg-green-50 p-4 space-y-3">
      <h3 className="text-sm font-semibold">Mark complete</h3>
      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
      <div>
        <label className="block text-xs font-medium text-zinc-600 mb-1">Where it lives</label>
        <textarea
          name="locationNote"
          required
          rows={2}
          placeholder="e.g. Google Drive: https://drive.google.com/... or Claude project: X"
          className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
        />
      </div>
      <SubmitButton />
    </form>
  );
}
