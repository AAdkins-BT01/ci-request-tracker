"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { acceptRequest, declineRequest, type ActionState } from "@/app/review/(dashboard)/[id]/actions";
import { REVIEWERS, REVIEWER_LABELS } from "@/lib/auth/constants";

const initialState: ActionState = {};

function SubmitButton({ label, className }: { label: string; className: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className={className}>
      {pending ? "Saving…" : label}
    </button>
  );
}

export function AcceptDeclineForm({ id }: { id: string }) {
  const [acceptState, acceptAction] = useActionState(acceptRequest.bind(null, id), initialState);
  const [declineState, declineAction] = useActionState(declineRequest.bind(null, id), initialState);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <form action={acceptAction} className="rounded-lg border border-zinc-200 bg-white p-4 space-y-3">
        <h3 className="text-sm font-semibold">Accept</h3>
        {acceptState?.error && <p className="text-sm text-red-600">{acceptState.error}</p>}
        <select
          name="owner"
          required
          defaultValue=""
          className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm bg-white"
        >
          <option value="" disabled>
            Assign to…
          </option>
          {REVIEWERS.map((r) => (
            <option key={r} value={r}>
              {REVIEWER_LABELS[r]}
            </option>
          ))}
        </select>
        <SubmitButton
          label="Accept"
          className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm text-white font-medium hover:bg-blue-700 disabled:opacity-50"
        />
      </form>

      <form action={declineAction} className="rounded-lg border border-zinc-200 bg-white p-4 space-y-3">
        <h3 className="text-sm font-semibold">Decline</h3>
        {declineState?.error && <p className="text-sm text-red-600">{declineState.error}</p>}
        <textarea
          name="reason"
          required
          rows={2}
          placeholder="Reason the requester will see"
          className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
        />
        <SubmitButton
          label="Decline"
          className="w-full rounded-md bg-red-600 px-4 py-2 text-sm text-white font-medium hover:bg-red-700 disabled:opacity-50"
        />
      </form>
    </div>
  );
}
