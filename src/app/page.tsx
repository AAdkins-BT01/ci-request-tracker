import Link from "next/link";
import { RequestForm } from "@/components/RequestForm";

export default function HomePage() {
  return (
    <main className="min-h-full bg-zinc-50">
      <div className="mx-auto max-w-2xl px-4 py-12">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold">Request Continuous Improvement help</h1>
          <p className="mt-2 text-sm text-zinc-600">
            Need an analytical report, something automated, an SOP written, or anything else
            IT/support-related you can&apos;t do yourself? Submit it below and the CI team will
            follow up by email.
          </p>
        </div>

        <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
          <RequestForm />
        </div>

        <p className="mt-6 text-center text-sm text-zinc-500">
          Reviewing requests?{" "}
          <Link href="/review" className="text-blue-600 hover:underline">
            Go to the review dashboard
          </Link>
        </p>
      </div>
    </main>
  );
}
