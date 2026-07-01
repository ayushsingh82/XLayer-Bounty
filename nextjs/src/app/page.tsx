import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#09090b] text-white">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(192,192,192,0.22),_transparent_55%)]" />
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
        <div className="section-container relative z-10 pt-16 pb-12 text-center md:pt-24 md:pb-20">
          <h1 className="mx-auto max-w-4xl text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
            Build faster on <span className="text-accent-green">XLayer</span> with a clean
            <br />
            Next.js experience
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white/80 sm:mt-8 sm:text-xl">
            A lightweight landing shell inspired by your synthesis UI style. No heavy functionality,
            just a polished foundation you can extend.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Link href="/dashboard" className="btn-green px-5 py-2.5 text-sm font-semibold transition-colors">
              Open dashboard
            </Link>
            <Link href="#about" className="btn-black px-5 py-2.5 text-sm font-semibold transition-colors">
              Learn more
            </Link>
          </div>
        </div>
      </section>

      <section id="about" className="border-t border-white/10 bg-[#09090b] py-14">
        <div className="section-container text-center">
          <h2 className="text-2xl font-semibold tracking-tight text-white">Ready for your next build</h2>
          <p className="mt-3 text-white/70">
            This prototype follows the AutoBounty-style flow with original code on XLayer: create
            bounties, submit PR links, and view automated resolution status.
          </p>
        </div>
      </section>
    </div>
  );
}
