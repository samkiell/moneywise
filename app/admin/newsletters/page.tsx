import { newsletterService } from "@/lib/services/newsletter.service";
import { INewsletter } from "@/types";
import { formatDate } from "@/lib/utils";
import { Send, Plus } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminNewslettersPage() {
  let newsletters: INewsletter[] = [];

  try {
    newsletters = await newsletterService.getAllNewsletters();
  } catch (err) {
    console.warn("Unable to fetch newsletters for admin:", err);
  }

  return (
    <div className="p-8 space-y-6 max-w-7xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-neutral-border pb-6">
        <div>
          <span className="editorial-kicker">Dispatches Desk</span>
          <h1 className="font-serif text-3xl font-bold text-neutral-main mt-1">Newsletters</h1>
          <p className="text-xs text-neutral-secondary mt-1">
            Compose, schedule, and view published editions of the community newsletter.
          </p>
        </div>

        <button
          type="button"
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-primary hover:bg-brand-dark rounded transition-colors self-start"
        >
          <Plus className="w-4 h-4" /> Create Newsletter
        </button>
      </div>

      <div className="bg-surface border border-neutral-border rounded-lg overflow-hidden">
        {newsletters.length === 0 ? (
          <div className="p-12 text-center text-sm text-neutral-secondary">
            <Send className="w-8 h-8 text-neutral-secondary mx-auto mb-3 opacity-60" />
            <p>No newsletters drafted or dispatched yet.</p>
            <p className="text-xs text-neutral-secondary mt-1">
              Drafted newsletters will appear here before dispatching to community subscribers.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 border-b border-neutral-border text-xs text-neutral-secondary uppercase tracking-wider font-semibold">
                <tr>
                  <th className="px-6 py-3">Subject</th>
                  <th className="px-6 py-3">Slug</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Sent Date</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-border">
                {newsletters.map((item) => (
                  <tr key={item._id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 font-medium text-neutral-main">{item.subject}</td>
                    <td className="px-6 py-4 text-xs font-mono text-neutral-secondary">{item.slug}</td>
                    <td className="px-6 py-4">
                      <span className="inline-block px-2 py-0.5 text-[11px] font-semibold uppercase rounded bg-blue-50 text-primary">
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-neutral-secondary">
                      {formatDate(item.sentAt)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-xs font-medium text-primary hover:underline">
                        Edit
                      </button>
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
