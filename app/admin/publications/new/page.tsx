import { auth } from "@/lib/auth";
import { PublicationForm } from "@/components/admin/PublicationForm";

export const dynamic = "force-dynamic";

export default async function NewPublicationPage() {
  const session = await auth();
  const role = session?.user?.role ?? "editor";

  return (
    <div className="p-8 space-y-6 max-w-7xl">
      <div className="border-b border-neutral-border pb-6">
        <span className="editorial-kicker">Editorial Creation</span>
        <h1 className="font-serif text-3xl font-bold text-neutral-main mt-1">New Publication</h1>
        <p className="text-xs text-neutral-secondary mt-1">
          Draft a new story or tabloid for the Money Wise magazine.
        </p>
      </div>

      <PublicationForm role={role} />
    </div>
  );
}
