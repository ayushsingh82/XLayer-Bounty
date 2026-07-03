"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export function Header() {
  const path = usePathname();
  const linkClass = (href: string) =>
    `transition-colors hover:text-green-200 ${path === href ? "text-green-200 font-semibold" : ""}`;

  return (
    <header className="w-full border-b border-green-500/30 bg-black">
      <div className="h-14 md:h-16">
        <div className="section-container flex h-full min-h-[3.5rem] items-center justify-between py-2 md:min-h-16">
          <Link href="/" className="flex items-center gap-2 text-lg font-semibold tracking-tight text-[#86efac] md:text-xl hover:opacity-80">
            <Image src="/logo.png" alt="RetroFund Logo" width={36} height={36} className="rounded-sm" />
            <span>RetroFund</span>
          </Link>
          <nav className="flex items-center gap-4 text-sm font-medium text-green-300 md:gap-6">
            <Link href="/scan" className={linkClass("/scan")}>Scan Repo</Link>
            <Link href="/dashboard" className={linkClass("/dashboard")}>Dashboard</Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
