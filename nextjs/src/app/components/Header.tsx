"use client";

import Link from "next/link";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export function Header() {
  return (
    <header className="h-14 w-full border-b border-white/15 bg-[#09090b] md:h-16">
      <div className="section-container flex h-full min-h-[3.5rem] items-center justify-between py-2 md:min-h-16">
        <Link
          href="/"
          className="text-lg font-semibold tracking-tight text-white md:text-xl hover:opacity-80"
        >
          <span className="text-accent-green">X</span>Layer
        </Link>
        <nav className="flex items-center gap-6 text-sm font-medium text-white/80">
          <Link href="/dashboard" className="transition-colors hover:text-white">
            Dashboard
          </Link>
          <a href="#about" className="transition-colors hover:text-white">
            About
          </a>
          <ConnectButton />
        </nav>
      </div>
    </header>
  );
}

