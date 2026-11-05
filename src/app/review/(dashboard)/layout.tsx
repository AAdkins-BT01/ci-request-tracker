import Link from "next/link";
import { getSession } from "@/lib/auth/session";
import { ActingAsSelector } from "@/components/ActingAsSelector";
import { logout } from "./actions";

export default async function ReviewLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();

  return (
    <div className="min-h-full bg-zinc-50">
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto max-w-5xl px-4 py-3 flex items-center justify-between gap-4">
          <Link href="/review" className="font-semibold text-sm">
            CI Review Dashboard
          </Link>
          <div className="flex items-center gap-4">
            <ActingAsSelector current={session?.actingAs ?? null} />
            <form action={logout}>
              <button type="submit" className="text-sm text-zinc-500 hover:underline">
                Log out
              </button>
            </form>
          </div>
        </div>
      </header>
      <div className="mx-auto max-w-5xl px-4 py-8">{children}</div>
    </div>
  );
}
