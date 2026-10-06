import { NewsletterForm } from "@/components/newsletter/NewsletterForm";
import { newsletterService } from "@/lib/services/newsletter.service";
import { INewsletter } from "@/types";
import { formatDate } from "@/lib/utils";
import { Mail, Archive } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Newsletter Archive & Subscription | Money Wise",
  description: "Subscribe to Money Wise editions and explore past community letters.",
};

export default async function NewsletterPage() {
  let archive: INewsletter[] = [];

  try {
    archive = await newsletterService.getSentArchive();
  } catch (err) {
    console.warn("Unable to fetch newsletter archive:", err);
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
      {/* Subscribe Section */}
      <div className="border border-neutral-border bg-surface p-8 sm:p-12 rounded-lg text-center shadow-sm">
        <Mail className="w-10 h-10 text-primary mx-auto mb-4" />
        <span className="editorial-kicker">Dispatches & Editions</span>
        <h1 className="editorial-title text-3xl sm:text-4xl text-neutral-main mt-2">
          Subscribe to Money Wise
        </h1>
        <p className="text-neutral-secondary text-sm mt-3 max-w-lg mx-auto leading-relaxed mb-8">
          Get direct community insights, publication digests, writing highlights, and financial guidance delivered straight to your inbox.
        </p>

        <NewsletterForm />
      </div>

      {/* Archive Section */}
      <div>
        <div className="border-b border-neutral-border pb-4 mb-8 flex items-center gap-2">
          <Archive className="w-5 h-5 text-neutral-secondary" />
          <h2 className="font-serif text-2xl font-bold text-neutral-main">Newsletter Archive</h2>
        </div>

        {archive.length === 0 ? (
          <div className="border border-neutral-border bg-surface rounded-lg p-8 text-center text-xs text-neutral-secondary">
            No published newsletter editions in the archive yet.
          </div>
        ) : (
          <div className="space-y-4">
            {archive.map((letter) => (
              <div
                key={letter._id}
                className="p-6 bg-surface border border-neutral-border rounded-lg flex flex-col sm:flex-row justify-between sm:items-center gap-4"
              >
                <div>
                  <h3 className="font-serif font-bold text-neutral-main text-lg">{letter.subject}</h3>
                  {letter.excerpt && (
                    <p className="text-xs text-neutral-secondary mt-1">{letter.excerpt}</p>
                  )}
                </div>
                <span className="text-xs text-neutral-secondary flex-shrink-0">
                  {formatDate(letter.sentAt)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
