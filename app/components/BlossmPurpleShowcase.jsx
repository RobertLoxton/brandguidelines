export default function BlossmPurpleShowcase() {
  const palette = [
    { name: "Trendy DTC Purple", hex: "#9B6BA3" }, // lighter purple (mauve)
    { name: "Deep Plum", hex: "#3B164B" },
    { name: "Orchid", hex: "#C27AA3" },
    { name: "Lavender Haze", hex: "#EFE7FA" },
    { name: "Porcelain", hex: "#F6F1EC" },
    { name: "Ink Charcoal", hex: "#1F1F23" },
  ];

  return (
    <div className="min-h-screen w-full bg-[#F6F1EC] text-[#1F1F23]">
      {/* Top bar */}
      <header className="sticky top-0 z-10 backdrop-blur bg-white/60 border-b border-black/5">
        <div className="max-w-6xl mx-auto flex items-center justify-between py-3 px-4">
          <div className="font-serif text-2xl tracking-tight">
            <span className="lowercase">blossm</span>
            <span className="ml-2 text-xs tracking-widest text-black/60">NUTRITION</span>
          </div>
          <nav className="hidden md:flex gap-6 text-sm">
            <a className="hover:opacity-70" href="#">Shop</a>
            <a className="hover:opacity-70" href="#">About</a>
            <a className="hover:opacity-70" href="#">Science</a>
            <a className="hover:opacity-70" href="#">Journal</a>
          </nav>
          <button className="rounded-full px-4 py-2 text-white" style={{ backgroundColor: "#9B6BA3" }}>Shop Now</button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-10 grid gap-8">
        {/* Palette chips */}
        <section className="rounded-2xl border border-black/5 bg-white p-5">
          <h2 className="text-lg font-medium mb-4">Palette — Trendy DTC Purple</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {palette.map((c) => (
              <div key={c.hex} className="rounded-xl overflow-hidden border border-black/5">
                <div className="h-16" style={{ backgroundColor: c.hex }} />
                <div className="p-3 text-xs">
                  <div className="font-medium">{c.name}</div>
                  <div className="font-mono text-black/60">{c.hex}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Example A — Dark Hero (full-bleed gradient) */}
        <section className="rounded-2xl overflow-hidden border border-black/5">
          <div
            className="p-10 md:p-16 text-white"
            style={{
              backgroundImage:
                "radial-gradient(1200px 600px at 20% 0%, #C27AA3 0%, rgba(194,122,163,0.15) 40%, transparent 60%), radial-gradient(900px 600px at 100% 50%, #9B6BA3 0%, #3B164B 70%)",
              backgroundColor: "#3B164B",
            }}
          >
            <div className="max-w-3xl">
              <p className="uppercase tracking-[0.25em] text-white/70 text-xs mb-4">For women 30+</p>
              <h1 className="text-4xl md:text-6xl leading-tight font-serif">Feel good in your own rhythm</h1>
              <p className="mt-4 text-white/85 max-w-xl">
                Science-led daily nutrition that supports hormonal balance, sleep, skin, and mood.
              </p>
              <div className="mt-8 flex gap-3">
                <a href="#" className="rounded-full px-6 py-3 text-sm font-medium bg-white text-[#3B164B] hover:opacity-90">Shop Balance</a>
                <a href="#" className="rounded-full px-6 py-3 text-sm font-medium border border-white/25 hover:bg-white/10">Learn more</a>
              </div>
            </div>

            {/* Product pedestal */}
            <div className="mt-10 md:mt-0 md:absolute md:right-10 md:top-28">
              <div className="relative w-72 h-72 md:w-96 md:h-96">
                <div className="absolute inset-0 rounded-3xl" style={{ background: "linear-gradient(180deg, #9B6BA3 0%, #3B164B 100%)" }} />
                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-64 h-6 rounded-full bg-black/40 blur-md" />
                <div className="absolute inset-8 rounded-2xl bg-white/10 backdrop-blur border border-white/20 flex items-center justify-center">
                  <div className="grid place-items-center gap-2">
                    {/* Simulated jar */}
                    <div className="w-24 h-28 rounded-xl" style={{ background: "linear-gradient(180deg, #8A4C90 0%, #3B164B 100%)" }} />
                    <div className="w-28 h-8 rounded-t-xl" style={{ backgroundColor: "#3B164B" }} />
                    <div className="text-xs text-center text-white/80">Balance — 60 caps</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Example B — Light Hero with accent purple */}
        <section className="rounded-2xl border border-black/5 bg-white p-10 md:p-14">
          <div className="grid md:grid-cols-2 items-center gap-10">
            <div>
              <h2 className="text-3xl md:text-5xl font-serif text-[#1F1F23]">Daily support for the next chapter</h2>
              <p className="mt-4 text-black/70 max-w-xl">Gentle, evidence‑informed formulas made for real life. Clean label, third‑party tested.</p>
              <div className="mt-8 flex gap-3">
                <a href="#" className="rounded-full px-6 py-3 text-sm font-medium text-white" style={{ backgroundColor: "#9B6BA3" }}>Shop Now</a>
                <a href="#" className="rounded-full px-6 py-3 text-sm font-medium border" style={{ borderColor: "#9B6BA3", color: "#9B6BA3" }}>Take quiz</a>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -inset-6 rounded-3xl opacity-70" style={{ background: "radial-gradient(600px 300px at 60% 40%, #EFE7FA 0%, transparent 60%), radial-gradient(400px 280px at 20% 80%, #C27AA3 0%, transparent 60%)" }} />
              <div className="relative rounded-2xl border border-black/5 bg-white p-6 grid grid-cols-4 gap-4">
                {[
                  { name: "Balance", color: "#9B6BA3" },
                  { name: "Glow", color: "#C27AA3" },
                  { name: "Calm", color: "#3B164B" },
                  { name: "Restore", color: "#8EA69C" },
                ].map((card) => (
                  <div key={card.name} className="rounded-xl border border-black/5 p-4 flex flex-col items-center">
                    <div className="w-14 h-16 rounded-md mb-3" style={{ backgroundColor: card.color }} />
                    <div className="text-sm font-medium">{card.name}</div>
                    <button className="mt-3 text-xs rounded-full px-3 py-1 text-white" style={{ backgroundColor: "#9B6BA3" }}>Shop</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Example C — PDP snippet */}
        <section className="rounded-2xl border border-black/5 bg-white p-8 md:p-12">
          <div className="grid md:grid-cols-2 gap-10 items-start">
            <div className="rounded-2xl p-6 border border-black/5 bg-[linear-gradient(180deg,#EFE7FA,white)]">
              <div className="w-56 h-64 mx-auto rounded-xl" style={{ background: "linear-gradient(180deg, #9B6BA3 0%, #3B164B 100%)" }} />
            </div>
            <div>
              <h3 className="text-2xl md:text-3xl font-serif">Blossm Balance</h3>
              <p className="mt-2 text-sm text-black/70">Supports hormonal balance, sleep quality, and calm mood. 60 capsules. Vegan. Third‑party tested.</p>
              <ul className="mt-4 grid gap-2 text-sm">
                <li>• Evidence‑informed doses</li>
                <li>• Clean label (no artificial colors)</li>
                <li>• Gentle on daily use</li>
              </ul>
              <div className="mt-6 flex items-center gap-3">
                <div className="text-2xl font-semibold">$39</div>
                <span className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: "#EFE7FA", color: "#9B6BA3" }}>Subscribe & Save 15%</span>
              </div>
              <div className="mt-6 flex gap-3">
                <button className="rounded-full px-6 py-3 text-sm font-medium text-white" style={{ backgroundColor: "#9B6BA3" }}>Add to Cart</button>
                <button className="rounded-full px-6 py-3 text-sm font-medium border" style={{ borderColor: "#9B6BA3", color: "#9B6BA3" }}>Learn More</button>
              </div>
            </div>
          </div>
        </section>

        {/* Example D — Editorial / Journal */}
        <section className="rounded-2xl overflow-hidden border border-black/5">
          <div className="p-10 text-white" style={{ background: "linear-gradient(120deg, #3B164B 0%, #9B6BA3 60%)" }}>
            <h3 className="text-3xl md:text-4xl font-serif">The Daily Blossm</h3>
            <p className="mt-2 max-w-2xl text-white/85">Advice, insights, and stories for women 30+. Rituals that fit real life—no hype.</p>
            <div className="mt-8 grid md:grid-cols-3 gap-6">
              {["How to support hormonal health", "A guide to vitamins for skin", "Sleep routines that actually help"].map((t, i) => (
                <article key={i} className="rounded-2xl bg-white text-[#1F1F23] p-5">
                  <div className="h-28 rounded-xl mb-4" style={{ background: i === 1 ? "linear-gradient(180deg,#EFE7FA,white)" : "linear-gradient(180deg,#C27AA3,#9B6BA3)" }} />
                  <h4 className="font-medium">{t}</h4>
                  <p className="mt-2 text-sm text-black/70">Short, practical tips grounded in gentle science.</p>
                  <a className="mt-3 inline-block text-sm" style={{ color: "#9B6BA3" }} href="#">Read more →</a>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Gradient recipes */}
        <section className="rounded-2xl border border-black/5 bg-white p-6">
          <h3 className="text-lg font-medium mb-3">Gradient recipes (copy/paste)</h3>
          <pre className="whitespace-pre-wrap text-xs bg-black/5 p-4 rounded-xl">{`
/* Dark hero */
background: radial-gradient(1200px 600px at 20% 0%, #C27AA3 0%, rgba(194,122,163,.15) 40%, transparent 60%),
            radial-gradient(900px 600px at 100% 50%, #9B6BA3 0%, #3B164B 70%);

/* Light accent */
background: radial-gradient(600px 300px at 60% 40%, #EFE7FA 0%, transparent 60%),
            radial-gradient(400px 280px at 20% 80%, #C27AA3 0%, transparent 60%);

/* Journal header */
background: linear-gradient(120deg, #3B164B 0%, #9B6BA3 60%);
`}</pre>
        </section>
      </main>

      <footer className="py-10 text-center text-xs text-black/60">© Blossm Nutrition</footer>
    </div>
  );
}
