"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Lock, Mail, AlertCircle } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError("Invalid email or password credentials.");
      } else {
        router.push("/admin/dashboard");
        router.refresh();
      }
    } catch {
      setError("An unexpected error occurred during login.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center p-6 bg-page">
      <div className="w-full max-w-md bg-surface border border-neutral-border rounded-lg p-8 shadow-sm">
        <div className="text-center mb-8">
          <span className="editorial-kicker">Staff Portal</span>
          <h1 className="font-serif text-2xl font-bold text-neutral-main mt-2">
            Money Wise Editorial CMS
          </h1>
          <p className="text-xs text-neutral-secondary mt-1">
            Sign in with authorized staff credentials to continue.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded text-xs text-red-600 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-main mb-1.5" htmlFor="email">
              Email Address
            </label>
            <div className="relative">
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="editor@oaucowrywise.org"
                className="w-full pl-10 pr-3 py-2 text-sm bg-surface border border-neutral-border rounded focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-neutral-main"
              />
              <Mail className="w-4 h-4 text-neutral-secondary absolute left-3 top-2.5" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-main mb-1.5" htmlFor="password">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
                className="w-full pl-10 pr-3 py-2 text-sm bg-surface border border-neutral-border rounded focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-neutral-main"
              />
              <Lock className="w-4 h-4 text-neutral-secondary absolute left-3 top-2.5" />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 px-4 text-sm font-semibold text-white bg-primary hover:bg-brand-dark rounded transition-colors disabled:opacity-60"
          >
            {isLoading ? "Signing in..." : "Sign In to CMS"}
          </button>
        </form>
      </div>
    </div>
  );
}
