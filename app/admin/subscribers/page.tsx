import { subscriberService } from "@/lib/services/subscriber.service";
import { ISubscriber } from "@/types";
import { formatDate } from "@/lib/utils";
import { Mail } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminSubscribersPage() {
  let subscribers: ISubscriber[] = [];
  let total = 0;

  try {
    const res = await subscriberService.getAllSubscribers(1, 50);
    subscribers = res.subscribers;
    total = res.total;
  } catch (err) {
    console.warn("Unable to fetch subscribers for admin:", err);
  }

  return (
    <div className="p-8 space-y-6 max-w-7xl">
      <div className="border-b border-neutral-border pb-6">
        <span className="editorial-kicker">Audience Desk</span>
        <h1 className="font-serif text-3xl font-bold text-neutral-main mt-1">Subscribers</h1>
        <p className="text-xs text-neutral-secondary mt-1">
          {total} total registered readers subscribed to the Money Wise community newsletter.
        </p>
      </div>

      <div className="bg-surface border border-neutral-border rounded-lg overflow-hidden">
        {subscribers.length === 0 ? (
          <div className="p-12 text-center text-sm text-neutral-secondary">
            <Mail className="w-8 h-8 text-neutral-secondary mx-auto mb-3 opacity-60" />
            <p>No newsletter subscribers found.</p>
            <p className="text-xs text-neutral-secondary mt-1">
              Subscribers will appear here when readers sign up through public forms.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 border-b border-neutral-border text-xs text-neutral-secondary uppercase tracking-wider font-semibold">
                <tr>
                  <th className="px-6 py-3">Email</th>
                  <th className="px-6 py-3">Name</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Subscribed Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-border">
                {subscribers.map((sub) => (
                  <tr key={sub._id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 font-medium text-neutral-main">{sub.email}</td>
                    <td className="px-6 py-4 text-neutral-secondary">{sub.name || "—"}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-2 py-0.5 text-[11px] font-semibold uppercase rounded ${
                          sub.status === "active" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
                        }`}
                      >
                        {sub.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-neutral-secondary">
                      {formatDate(sub.subscribedAt)}
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
