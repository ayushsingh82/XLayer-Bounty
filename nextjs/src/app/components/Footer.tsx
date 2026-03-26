"use client";

import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-green-500/30 bg-black">
      <div className="section-container flex h-11 items-center justify-between text-xs text-green-300">
        <span>XLayer-Bounty</span>
        <Link
          href="https://twitter.com"
          target="_blank"
          rel="noreferrer"
          aria-label="Twitter"
          className="inline-flex items-center justify-center rounded border border-green-600/70 px-2 py-1 transition-colors hover:border-green-400 hover:text-green-200"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true" className="h-3.5 w-3.5 fill-current">
            <path d="M18.901 1.154h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.636 7.584H.478l8.6-9.83L0 1.154h7.594l5.243 6.932 6.064-6.932Zm-1.292 19.488h2.04L6.486 3.244H4.298l13.311 17.398Z" />
          </svg>
        </Link>
      </div>
    </footer>
  );
}
