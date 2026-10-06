import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="max-w-md mx-auto py-24 px-4 text-center">
      <span className="editorial-kicker">404</span>
      <h1 className="font-serif text-3xl font-bold text-neutral-main mt-2">Page Not Found</h1>
      <p className="text-sm text-neutral-secondary mt-3">
        The requested publication or page does not exist.
      </p>
      <div className="mt-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-primary hover:bg-brand-dark rounded transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Return to Homepage
        </Link>
      </div>
    </div>
  );
}
