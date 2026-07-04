"use client";

export function Footer() {
  return (
    <footer className="border-t border-[#e2e8f0] mt-auto bg-white">
      <div className="wrap flex h-12 items-center justify-between">
        <span className="text-xs text-[#0f172a] font-medium">© 2026 RetroFund</span>
        <div className="flex items-center gap-3 text-xs text-[#0f172a] font-medium">
          <span>Kaspa</span><span className="text-[#94a3b8]">·</span>
          <span>Fetch.ai</span><span className="text-[#94a3b8]">·</span>
          <span>GCC</span>
        </div>
      </div>
    </footer>
  );
}
