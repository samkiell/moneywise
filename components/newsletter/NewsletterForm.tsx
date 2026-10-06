"use client";

import { useActionState } from "react";
import { subscribeToNewsletter, SubscribeActionState } from "@/app/actions/subscriber.actions";
import { Mail, CheckCircle2, AlertCircle } from "lucide-react";

const initialState: SubscribeActionState = {};

export function NewsletterForm() {
  const [state, formAction, isPending] = useActionState(subscribeToNewsletter, initialState);

  return (
    <div className="w-full max-w-md mx-auto">
      {state.success ? (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-center gap-3 text-sm text-primary">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <p>{state.message}</p>
        </div>
      ) : (
        <form action={formAction} className="space-y-3">
          <div>
            <label htmlFor="newsletter-name" className="sr-only">
              Your Name (Optional)
            </label>
            <input
              id="newsletter-name"
              name="name"
              type="text"
              placeholder="Your Name (optional)"
              className="w-full px-4 py-2.5 text-sm bg-surface border border-neutral-border rounded focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-neutral-main placeholder:text-neutral-secondary"
            />
          </div>

          <div className="relative">
            <label htmlFor="newsletter-email" className="sr-only">
              Email Address
            </label>
            <input
              id="newsletter-email"
              name="email"
              type="email"
              required
              placeholder="Enter your email address"
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-surface border border-neutral-border rounded focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-neutral-main placeholder:text-neutral-secondary"
            />
            <Mail className="w-4 h-4 text-neutral-secondary absolute left-3.5 top-3" />
          </div>

          {state.error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded text-xs text-red-600 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{state.error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="w-full py-2.5 px-4 text-sm font-semibold text-white bg-primary hover:bg-brand-dark rounded transition-colors disabled:opacity-60"
          >
            {isPending ? "Subscribing..." : "Subscribe to Newsletter"}
          </button>
        </form>
      )}
    </div>
  );
}
