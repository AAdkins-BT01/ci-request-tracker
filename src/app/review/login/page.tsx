import { LoginForm } from "@/components/LoginForm";

export default async function ReviewLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;

  return (
    <main className="min-h-full bg-zinc-50 flex items-center justify-center">
      <div className="w-full max-w-sm px-4 py-12">
        <h1 className="text-xl font-semibold mb-6 text-center">CI Review Access</h1>
        <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
          <LoginForm next={next} />
        </div>
      </div>
    </main>
  );
}
