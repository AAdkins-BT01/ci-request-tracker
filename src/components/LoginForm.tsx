"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { login, type LoginState } from "@/app/review/login/actions";
import { REVIEWERS, REVIEWER_LABELS } from "@/lib/auth/constants";

const initialState: LoginState = {};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-md bg-blue-600 px-4 py-2 text-white font-medium hover:bg-blue-700 disabled:opacity-50"
    >
      {pending ? "Signing in…" : "Sign in"}
    </button>
  );
}

export function LoginForm({ next }: { next?: string }) {
  const [state, formAction] = useActionState(login, initialState);

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="next" value={next ?? ""} />

      {state?.error && (
        <p className="rounded-md bg-red-50 px-4 py-2 text-sm text-red-700">{state.error}</p>
      )}

      <div>
        <label htmlFor="actingAs" className="block text-sm font-medium mb-1">
          Acting as
        </label>
        <select
          id="actingAs"
          name="actingAs"
          required
          defaultValue=""
          className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm bg-white"
        >
          <option value="" disabled>
            Select your name
          </option>
          {REVIEWERS.map((r) => (
            <option key={r} value={r}>
              {REVIEWER_LABELS[r]}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium mb-1">
          Shared password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
        />
      </div>

      <SubmitButton />
    </form>
  );
}
