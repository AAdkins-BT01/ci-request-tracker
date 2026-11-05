"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { addProgressUpdate, type ActionState } from "@/app/review/(dashboard)/[id]/actions";

const initialState: ActionState = {};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white font-medium hover:bg-blue-700 disabled:opacity-50"
    >
      {pending ? "Saving…" : "Save update"}
    </button>
  );
}

export function ProgressUpdateForm({
  id,
  currentStatus,
  currentPercent,
}: {
  id: string;
  currentStatus: string;
  currentPercent: number;
}) {
  const [state, formAction] = useActionState(addProgressUpdate.bind(null, id), initialState);

  return (
    <form action={formAction} className="rounded-lg border border-zinc-200 bg-white p-4 space-y-3">
      <h3 className="text-sm font-semibold">Update progress</h3>
      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="block text-xs font-medium text-zinc-500 mb-1">Status</label>
          <select
            name="status"
            defaultValue={currentStatus}
            className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm bg-white"
          >
            <option value="accepted">Accepted</option>
            <option value="in_progress">In Progress</option>
            <option value="blocked">Blocked</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-zinc-500 mb-1">% complete</label>
          <input
            type="number"
            name="percentComplete"
            min={0}
            max={100}
            defaultValue={currentPercent}
            className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-zinc-500 mb-1">Add hours</label>
          <input
            type="number"
            name="hoursDelta"
            min={0}
            step={0.25}
            placeholder="0"
            className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-zinc-500 mb-1">Note</label>
        <textarea
          name="note"
          rows={2}
          placeholder="What's new since the last update?"
          className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
        />
      </div>

      <label className="flex items-center gap-2 text-xs text-zinc-500">
        <input type="checkbox" name="internal" className="rounded border-zinc-300" />
        Internal only (don&apos;t show the requester)
      </label>

      <SubmitButton />
    </form>
  );
}
