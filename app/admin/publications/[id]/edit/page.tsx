import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { publicationService } from "@/lib/services/publication.service";
import { PublicationForm } from "@/components/admin/PublicationForm";

export const dynamic = "force-dynamic";

interface EditPublicationProps {
  params: Promise<{ id: string }>;
}

export default async function EditPublicationPage({ params }: EditPublicationProps) {
  const { id } = await params;
  let publication = null;

  try {
    publication = await publicationService.getById(id);
  } catch (err) {
    console.warn("Unable to fetch publication for editing:", err);
  }

  if (!publication) {
    return (
      <div className="p-8 max-w-xl mx-auto text-center">
        <h1 className="font-serif text-2xl font-bold text-neutral-main">Publication Not Found</h1>
        <p className="text-xs text-neutral-secondary mt-2">
          The requested publication ID could not be loaded from the database.
        </p>
        <Link
          href="/admin/publications"
          className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Return to Publications Desk
        </Link>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6 max-w-7xl">
      <div className="border-b border-neutral-border pb-6">
        <span className="editorial-kicker">Editorial Editing</span>
        <h1 className="font-serif text-3xl font-bold text-neutral-main mt-1">Edit Publication</h1>
        <p className="text-xs text-neutral-secondary mt-1">
          Update content, workflow state, or metadata for &ldquo;{publication.title}&rdquo;.
        </p>
      </div>

      <PublicationForm initialData={publication} isEditing={true} />
    </div>
  );
}
