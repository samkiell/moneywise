import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-surface border-t border-neutral-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <span className="font-serif text-2xl font-bold tracking-tight text-neutral-main">
              MONEY <span className="text-primary">WISE</span>
            </span>
            <p className="mt-3 text-sm text-neutral-secondary max-w-sm leading-relaxed">
              The official magazine of the Writing Team of the OAU Cowrywise Community. Promoting financial literacy, creative storytelling, and community empowerment.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-main">Publications</h4>
            <ul className="mt-3 space-y-2 text-sm text-neutral-secondary">
              <li>
                <Link href="/stories" className="hover:text-primary transition-colors">Stories</Link>
              </li>
              <li>
                <Link href="/tabloids" className="hover:text-primary transition-colors">Tabloids</Link>
              </li>
              <li>
                <Link href="/newsletter" className="hover:text-primary transition-colors">Newsletter Archive</Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-main">Community</h4>
            <ul className="mt-3 space-y-2 text-sm text-neutral-secondary">
              <li>
                <Link href="/about" className="hover:text-primary transition-colors">About Money Wise</Link>
              </li>
              <li>
                <Link href="/team" className="hover:text-primary transition-colors">Meet the Team</Link>
              </li>
              <li>
                <Link href="/admin/login" className="hover:text-primary transition-colors">Staff Portal</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-neutral-border flex flex-col sm:flex-row justify-between items-center text-xs text-neutral-secondary">
          <p>&copy; {new Date().getFullYear()} OAU Cowrywise Community. All rights reserved.</p>
          <p className="mt-2 sm:mt-0">
            Built by{" "}
            <a
              href="https://samkiel.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-neutral-main hover:text-primary transition-colors underline"
            >
              samkiel
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
