"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export function Header() {
  const path = usePathname();
  const active = (href: string) => path === href;

  return (
    <header className="w-full sticky top-0 z-50 bg-white/90 backdrop-blur-sm border-b border-[#e2e8f0]">
      <div className="wrap flex h-14 items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
          <Image src="/logo.png" alt="RetroFund" width={26} height={26} className="rounded" />
          <span className="text-base font-semibold text-[#0f172a] tracking-tight">RetroFund</span>
        </Link>

        <nav className="flex items-center gap-1">
          {[
            { href: "/scan",        label: "Scan" },
            { href: "/dashboard",   label: "Dashboard" },
            { href: "/create-pool", label: "Create Pool" },
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                active(href)
                  ? "text-[#16a34a] bg-[#f0fdf4]"
                  : "text-[#64748b] hover:text-[#0f172a]"
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
