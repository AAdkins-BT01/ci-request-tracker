"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { createRequest, type ActionState } from "@/app/actions";

const initialState: ActionState = {};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-md bg-blue-600 px-4 py-2 text-white font-medium hover:bg-blue-700 disabled:opacity-50"
    >
      {pending ? "Submitting…" : "Submit request"}
    </button>
  );
}

export function RequestForm() {
  const [state, formAction] = useActionState(createRequest, initialState);

  return (
    <form action={formAction} className="space-y-5">
      {state?.error && (
        <p className="rounded-md bg-red-50 px-4 py-2 text-sm text-red-700">{state.error}</p>
      )}

      <div>
        <label htmlFor="title" className="block text-sm font-medium mb-1">
          Title
        </label>
        <input
          id="title"
          name="title"
          required
          maxLength={200}
          className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
          placeholder="Short summary of what you need"
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium mb-1">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          required
          rows={5}
          maxLength={5000}
          className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
          placeholder="What do you need, and why? The more detail the better."
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="type" className="block text-sm font-medium mb-1">
            Request type
          </label>
          <select
            id="type"
            name="type"
            defaultValue="other"
            className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm bg-white"
          >
            <option value="report">Analytical Report</option>
            <option value="automation">Automation</option>
            <option value="sop">SOP</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label htmlFor="priority" className="block text-sm font-medium mb-1">
            Priority
          </label>
          <select
            id="priority"
            name="priority"
            defaultValue="medium"
            className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm bg-white"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="neededBy" className="block text-sm font-medium mb-1">
            Needed by <span className="text-zinc-400 font-normal">(optional)</span>
          </label>
          <input
            id="neededBy"
            name="neededBy"
            type="date"
            className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label htmlFor="department" className="block text-sm font-medium mb-1">
            Department / team
          </label>
          <input
            id="department"
            name="department"
            required
            maxLength={200}
            className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
            placeholder="e.g. Sales, Warehouse, Finance"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="requesterName" className="block text-sm font-medium mb-1">
            Your name
          </label>
          <input
            id="requesterName"
            name="requesterName"
            required
            maxLength={200}
            className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label htmlFor="requesterEmail" className="block text-sm font-medium mb-1">
            Your email
          </label>
          <input
            id="requesterEmail"
            name="requesterEmail"
            type="email"
            required
            className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
          />
        </div>
      </div>

      <SubmitButton />
    </form>
  );
}
