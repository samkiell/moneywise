import Link from "next/link";
import { Plus, Edit3 } from "lucide-react";
import { publicationService } from "@/lib/services/publication.service";
import { IPublication } from "@/types";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminPublicationsPage() {
  let publications: IPublication[] = [];

  try {
    const res = await publicationService.getPublished({ limit: 50 });
    publications = res.publications;
  } catch (err) {
    console.warn("Unable to fetch publications for admin:", err);
  }

  return (
    <div className="p-8 space-y-6 max-w-7xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-neutral-border pb-6">
        <div>
          <span className="editorial-kicker">Content Desk</span>
          <h1 className="font-serif text-3xl font-bold text-neutral-main mt-1">Publications</h1>
          <p className="text-xs text-neutral-secondary mt-1">
            Manage drafts, in-review submissions, and published Stories and Tabloids.
          </p>
        </div>

        <Link
          href="/admin/publications/new"
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-primary hover:bg-brand-dark rounded transition-colors self-start"
        >
          <Plus className="w-4 h-4" /> Create Publication
        </Link>
      </div>

      <div className="bg-surface border border-neutral-border rounded-lg overflow-hidden">
        {publications.length === 0 ? (
          <div className="p-12 text-center text-sm text-neutral-secondary">
            <p>No publications found.</p>
            <Link
              href="/admin/publications/new"
              className="mt-3 inline-block text-xs font-semibold text-primary hover:underline"
            >
              Write your first publication &rarr;
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 border-b border-neutral-border text-xs text-neutral-secondary uppercase tracking-wider font-semibold">
                <tr>
                  <th className="px-6 py-3">Title</th>
                  <th className="px-6 py-3">Type</th>
                  <th className="px-6 py-3">Category</th>
                  <th className="px-6 py-3">Author</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Date</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-border">
                {publications.map((pub) => (
                  <tr key={pub._id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 font-medium text-neutral-main">{pub.title}</td>
                    <td className="px-6 py-4 capitalize text-neutral-secondary">{pub.type}</td>
                    <td className="px-6 py-4 text-neutral-secondary">{pub.category}</td>
                    <td className="px-6 py-4 text-neutral-secondary">{pub.author}</td>
                    <td className="px-6 py-4">
                      <span className="inline-block px-2 py-0.5 text-[11px] font-semibold uppercase rounded bg-green-50 text-green-700">
                        {pub.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-neutral-secondary">
                      {formatDate(pub.publishedAt)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/admin/publications/${pub._id}/edit`}
                        className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                      >
                        <Edit3 className="w-3.5 h-3.5" /> Edit
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
