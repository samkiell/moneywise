import Link from "next/link";
import { Search } from "lucide-react";

export function Header() {
  return (
    <header className="border-b border-neutral-border bg-surface sticky top-0 z-40">
      {/* Top micro-bar with brand slogan */}
      <div className="bg-primary text-white text-xs py-1.5 px-4 text-center tracking-wider font-medium uppercase">
        We write to inform. We create to inspire. We publish to empower.
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex flex-col">
              <span className="font-serif text-3xl font-black tracking-tight text-neutral-main">
                MONEY <span className="text-primary">WISE</span>
              </span>
              <span className="text-[10px] uppercase tracking-widest text-neutral-secondary font-medium">
                OAU Cowrywise Magazine
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-neutral-secondary">
              <Link href="/stories" className="hover:text-primary transition-colors">
                Stories
              </Link>
              <Link href="/tabloids" className="hover:text-primary transition-colors">
                Tabloids
              </Link>
              <Link href="/about" className="hover:text-primary transition-colors">
                About
              </Link>
              <Link href="/team" className="hover:text-primary transition-colors">
                Meet the Team
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/search"
              aria-label="Search publications"
              className="p-2 text-neutral-secondary hover:text-primary transition-colors"
            >
              <Search className="w-5 h-5" />
            </Link>
            <Link
              href="/newsletter"
              className="hidden sm:inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-white bg-primary hover:bg-brand-dark rounded transition-colors"
            >
              Subscribe
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
