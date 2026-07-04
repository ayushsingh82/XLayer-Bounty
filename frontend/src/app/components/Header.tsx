"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";

const NAV = [
  { href: "/scan",        label: "Scan" },
  { href: "/dashboard",   label: "Dashboard" },
  { href: "/create-pool", label: "Create Pool" },
];

export function Header() {
  const path = usePathname();
  const active = (href: string) => path === href;
  const [open, setOpen] = useState(false);

  return (
    <header className="w-full sticky top-0 z-50 bg-white border-b border-[#e2e8f0]">
      <div className="wrap flex h-14 items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          onClick={() => setOpen(false)}
          className="flex items-center gap-2.5 flex-shrink-0"
          style={{ textDecoration: "none" }}
        >
          <Image src="/logo.png" alt="RetroFund" width={26} height={26} style={{ borderRadius: "4px" }} />
          <span style={{ fontSize: "1rem", fontWeight: 600, color: "#0f172a", letterSpacing: "-0.01em" }}>
            RetroFund
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden sm:flex items-center gap-1">
          {NAV.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              style={{
                padding: "0.375rem 0.75rem",
                borderRadius: "4px",
                fontSize: "0.875rem",
                fontWeight: 500,
                color: active(href) ? "#16a34a" : "#64748b",
                background: active(href) ? "#f0fdf4" : "transparent",
                textDecoration: "none",
                transition: "color 0.15s",
              }}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Mobile hamburger */}
        <button
          className="sm:hidden flex flex-col justify-center items-center gap-1.5 p-2"
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle menu"
          style={{ background: "none", border: "none", cursor: "pointer" }}
        >
          <span
            style={{
              display: "block", width: "20px", height: "2px", background: "#0f172a",
              transition: "transform 0.2s",
              transform: open ? "rotate(45deg) translate(3px, 3px)" : "none",
            }}
          />
          <span
            style={{
              display: "block", width: "20px", height: "2px", background: "#0f172a",
              opacity: open ? 0 : 1,
              transition: "opacity 0.15s",
            }}
          />
          <span
            style={{
              display: "block", width: "20px", height: "2px", background: "#0f172a",
              transition: "transform 0.2s",
              transform: open ? "rotate(-45deg) translate(3px, -3px)" : "none",
            }}
          />
        </button>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div
          className="sm:hidden bg-white border-t border-[#e2e8f0]"
          style={{ padding: "0.5rem 0 0.75rem" }}
        >
          {NAV.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              style={{
                display: "block",
                padding: "0.625rem 1.5rem",
                fontSize: "0.9375rem",
                fontWeight: active(href) ? 600 : 500,
                color: active(href) ? "#16a34a" : "#0f172a",
                textDecoration: "none",
                background: active(href) ? "#f0fdf4" : "transparent",
              }}
            >
              {label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
