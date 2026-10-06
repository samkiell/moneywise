import Link from "next/link";
import { Plus, FileText, Users, Mail, BarChart3 } from "lucide-react";
import { publicationService } from "@/lib/services/publication.service";
import { subscriberService } from "@/lib/services/subscriber.service";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  let publicationCount = 0;
  let subscriberCount = 0;

  try {
    const pubData = await publicationService.getPublished({ limit: 1 });
    publicationCount = pubData.total;
    const subData = await subscriberService.getAllSubscribers(1, 1);
    subscriberCount = subData.total;
  } catch (err) {
    console.warn("Unable to fetch dashboard metrics:", err);
  }

  return (
    <div className="p-8 space-y-8 max-w-7xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-neutral-border pb-6">
        <div>
          <span className="editorial-kicker">Overview</span>
          <h1 className="font-serif text-3xl font-bold text-neutral-main mt-1">Editorial Dashboard</h1>
          <p className="text-xs text-neutral-secondary mt-1">
            Manage Money Wise publications, editorial team members, newsletter subscribers, and insights.
          </p>
        </div>

        <Link
          href="/admin/publications/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-primary hover:bg-brand-dark rounded transition-colors self-start"
        >
          <Plus className="w-4 h-4" /> New Publication
        </Link>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-6 bg-surface border border-neutral-border rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-secondary">
              Published Stories & Tabloids
            </span>
            <FileText className="w-4 h-4 text-primary" />
          </div>
          <div className="mt-3 font-serif text-3xl font-bold text-neutral-main">
            {publicationCount}
          </div>
          <p className="text-[11px] text-neutral-secondary mt-1">Active published pieces</p>
        </div>

        <div className="p-6 bg-surface border border-neutral-border rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-secondary">
              Total Subscribers
            </span>
            <Mail className="w-4 h-4 text-primary" />
          </div>
          <div className="mt-3 font-serif text-3xl font-bold text-neutral-main">
            {subscriberCount}
          </div>
          <p className="text-[11px] text-neutral-secondary mt-1">Community newsletter audience</p>
        </div>

        <div className="p-6 bg-surface border border-neutral-border rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-secondary">
              Editorial Workflow
            </span>
            <Users className="w-4 h-4 text-primary" />
          </div>
          <div className="mt-3 text-sm font-semibold text-neutral-main">
            Draft &rarr; Review &rarr; Published
          </div>
          <p className="text-[11px] text-neutral-secondary mt-1">Managed through CMS desk</p>
        </div>

        <div className="p-6 bg-surface border border-neutral-border rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-secondary">
              First-Party Analytics
            </span>
            <BarChart3 className="w-4 h-4 text-primary" />
          </div>
          <div className="mt-3 text-sm font-semibold text-neutral-main">Privacy-Safe Engine</div>
          <p className="text-[11px] text-neutral-secondary mt-1">Internal aggregate metrics</p>
        </div>
      </div>

      {/* Quick Launchpad Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-surface border border-neutral-border rounded-lg p-6">
          <h2 className="font-serif text-lg font-bold text-neutral-main mb-3">Publications Desk</h2>
          <p className="text-xs text-neutral-secondary mb-4 leading-relaxed">
            Write, review, publish, and manage Stories and Tabloids for the OAU Cowrywise community.
          </p>
          <div className="flex gap-3">
            <Link
              href="/admin/publications"
              className="text-xs font-semibold text-primary hover:underline"
            >
              View all publications &rarr;
            </Link>
          </div>
        </div>

        <div className="bg-surface border border-neutral-border rounded-lg p-6">
          <h2 className="font-serif text-lg font-bold text-neutral-main mb-3">Audience & Team</h2>
          <p className="text-xs text-neutral-secondary mb-4 leading-relaxed">
            Maintain editorial masthead members and monitor incoming subscriber growth.
          </p>
          <div className="flex gap-4 text-xs font-semibold text-primary">
            <Link href="/admin/team" className="hover:underline">
              Manage Team &rarr;
            </Link>
            <Link href="/admin/subscribers" className="hover:underline">
              View Subscribers &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
