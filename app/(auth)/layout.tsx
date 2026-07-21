import type { Metadata } from "next";
import Link from "next/link";
import { BUSINESS } from "@/lib/constants";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex flex-1 items-center justify-center bg-brand-50 px-6 py-16">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link href="/" className="font-display text-3xl tracking-wide text-foreground">
            {BUSINESS.name}
          </Link>
        </div>
        <div className="rounded-2xl border border-foreground/10 bg-white p-8 shadow-sm">
          {children}
        </div>
      </div>
    </main>
  );
}
