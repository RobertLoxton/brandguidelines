"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { HexColorPicker } from "react-colorful";

/* ---------- Color utils ---------- */
function hexToRgb(hex) {
  const n = hex.replace("#", "");
  const bigint = parseInt(n.length === 3 ? n.split("").map((c)=>c+c).join("") : n, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return { r, g, b };
}
function rgbToHex(r, g, b) {
  return ("#" + [r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("")).toUpperCase();
}
function rgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;
  if (max === min) { h = s = 0; }
  else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 1); break;
      case g: h = (b - r) / d + 2; break;
      default: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return { h: h * 360, s: s * 100, l: l * 100 };
}
function hslToRgb(h, s, l) {
  h /= 360; s /= 100; l /= 100;
  const hue2rgb = (p, q, t) => {
    if (t < 0) t += 1; if (t > 1) t -= 1;
    if (t < 1/6) return p + (q - p) * 6 * t;
    if (t < 1/2) return q;
    if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
    return p;
  };
  let r, g, b;
  if (s === 0) { r = g = b = l; }
  else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }
  return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) };
}
function adjust(hex, { dl = 0, ds = 0 }) {
  const { r, g, b } = hexToRgb(hex);
  const { h, s, l } = rgbToHsl(r, g, b);
  const { r: rr, g: rg, b: rb } = hslToRgb(
    h,
    Math.max(0, Math.min(100, s + ds)),
    Math.max(0, Math.min(100, l + dl))
  );
  return rgbToHex(rr, rg, rb);
}
const isValidHex = (v) => /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(v);

/* ---------- click-outside helper ---------- */
function useOnClickOutside(ref, handler) {
  useEffect(() => {
    const listener = (e) => {
      if (!ref.current || ref.current.contains(e.target)) return;
      handler(e);
    };
    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener, { passive: true });
    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler]);
}

/* ---------- Component ---------- */
export default function BlossmPurpleShowcaseInteractive() {
  const builtInPresets = [
    { name: "Mauve", primary: "#9B6BA3", accent: "#C27AA3", deep: "#3B164B" },
    { name: "Lilac", primary: "#A679E8", accent: "#EFE7FA", deep: "#3B164B" },
    { name: "Grape", primary: "#6E2E7A", accent: "#A679E8", deep: "#3B164B" },
    { name: "Rose",  primary: "#B86B82", accent: "#F6DCE6", deep: "#3B164B" },
  ];

  const [primary, setPrimary] = useState("#9B6BA3");
  const [accent, setAccent]   = useState("#C27AA3");
  const [deep, setDeep]       = useState("#3B164B");
  const neutralBg = "#F6F1EC";
  const text = "#1F1F23";

  const [customPresets, setCustomPresets] = useState([]);
  const [presetName, setPresetName] = useState("");

  // Load/save from localStorage
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("blossm.presets") || "[]");
      if (Array.isArray(saved)) setCustomPresets(saved);
      const last = JSON.parse(localStorage.getItem("blossm.last") || "null");
      if (last && last.primary && last.accent && last.deep) {
        setPrimary(last.primary); setAccent(last.accent); setDeep(last.deep);
      }
    } catch {}
  }, []);
  useEffect(() => {
    try { localStorage.setItem("blossm.presets", JSON.stringify(customPresets)); } catch {}
  }, [customPresets]);
  useEffect(() => {
    try { localStorage.setItem("blossm.last", JSON.stringify({ primary, accent, deep })); } catch {}
  }, [primary, accent, deep]);

  // Derived shades
  const shades = useMemo(() => ({
    primary600: adjust(primary, { dl: -8 }),
    primary700: adjust(primary, { dl: -16 }),
    primary300: adjust(primary, { dl: +8 }),
    accent300:  adjust(accent,  { dl: +12 }),
    accent700:  adjust(accent,  { dl: -12 }),
  }), [primary, accent]);

  const cssVars = {
    "--primary": primary,
    "--primary-600": shades.primary600,
    "--primary-700": shades.primary700,
    "--primary-300": shades.primary300,
    "--accent": accent,
    "--accent-300": shades.accent300,
    "--accent-700": shades.accent700,
    "--deep": deep,
    "--bg": neutralBg,
    "--text": text,
  };

  /* ---- Custom, drag-friendly color field ---- */
  function ColorField({ id, label, value, onChange }) {
    const [open, setOpen] = useState(false);
    const [draft, setDraft] = useState(value);
    const popRef = useRef(null);
    useOnClickOutside(popRef, () => setOpen(false));

    useEffect(() => { setDraft(value); }, [value]);

    const onHexInput = (v) => {
      let val = v.startsWith("#") ? v : "#" + v;
      val = val.toUpperCase();
      setDraft(val);
      if (isValidHex(val)) onChange(val);
    };

    return (
      <div className="relative flex items-center gap-3 text-sm">
        <label htmlFor={id} className="w-20 text-black/70">{label}</label>

        {/* Swatch opens persistent picker */}
        <button
          type="button"
          aria-label={`${label} color`}
          onClick={() => setOpen(o => !o)}
          className="w-10 h-10 rounded-md border border-black/10"
          style={{ backgroundColor: value }}
        />

        {/* Hex input */}
        <input
          value={draft}
          onChange={(e)=>onHexInput(e.target.value)}
          className="flex-1 px-2 py-2 border rounded-md text-sm font-mono"
        />

        {/* Popover with drag-friendly picker; stays open until outside click or Done */}
        {open && (
          <div
            ref={popRef}
            className="absolute z-50 top-12 left-20 bg-white border border-black/10 rounded-xl shadow-xl p-3 w-[260px]"
          >
            <HexColorPicker
              color={draft}
              onChange={(c) => {
                const v = c.toUpperCase();
                setDraft(v);
                onChange(v); // live update while dragging
              }}
            />
            <div className="mt-3 flex items-center gap-2">
              <input
                value={draft}
                onChange={(e)=>onHexInput(e.target.value)}
                className="flex-1 px-2 py-2 border rounded-md text-sm font-mono"
              />
              <button
                type="button"
                onClick={()=>setOpen(false)}
                className="px-3 py-2 text-xs rounded-md border border-black/10 hover:bg-black/5"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  const applyPreset = (p) => {
    setPrimary(p.primary); setAccent(p.accent); setDeep(p.deep || "#3B164B");
  };
  const savePreset = () => {
    const name = presetName.trim();
    if (!name) return alert("Give your preset a name.");
    if (!isValidHex(primary) || !isValidHex(accent) || !isValidHex(deep)) {
      return alert("Please use valid HEX colors like #9B6BA3 or #ABC.");
    }
    const next = { name, primary, accent, deep };
    setCustomPresets((prev) => {
      const filtered = prev.filter((x) => x.name.toLowerCase() !== name.toLowerCase());
      return [...filtered, next];
    });
    setPresetName("");
  };
  const removePreset = (name) => setCustomPresets((p) => p.filter((x) => x.name !== name));

  return (
    <div className="min-h-screen w-full" style={{ backgroundColor: "var(--bg)", color: "var(--text)", ...cssVars }}>
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
          <button className="rounded-full px-4 py-2 text-white" style={{ backgroundColor: "var(--primary)" }}>Shop Now</button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 grid gap-8">
        {/* Controls */}
        <section className="rounded-2xl border border-black/5 bg-white p-5">
          <h2 className="text-lg font-medium mb-3">Theme colors</h2>
          <div className="grid md:grid-cols-2 gap-3">
            <ColorField id="c-primary" label="Primary" value={primary} onChange={setPrimary} />
            <ColorField id="c-accent"  label="Accent"  value={accent}  onChange={setAccent} />
            <ColorField id="c-deep"    label="Deep"    value={deep}    onChange={setDeep} />
          </div>

          {/* Save current as preset */}
          <div className="mt-5 flex flex-wrap items-center gap-2">
            <input
              value={presetName}
              onChange={(e)=>setPresetName(e.target.value)}
              placeholder="Preset name (e.g. Dusty Lavender)"
              className="min-w-[220px] px-3 py-2 border rounded-md text-sm"
            />
            <button onClick={savePreset} className="rounded-full px-4 py-2 text-sm text-white" style={{ backgroundColor: "var(--primary)" }}>
              Save preset
            </button>
          </div>

          {/* Presets list */}
          <div className="mt-5">
            <div className="text-sm mb-2 text-black/70">Presets</div>
            <div className="flex flex-wrap gap-2">
              {[...builtInPresets, ...customPresets].map((p) => (
                <div key={p.name} className="flex items-center gap-2 rounded-full border border-black/10 px-3 py-2 bg-white">
                  <button onClick={()=>applyPreset(p)} className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded" style={{ backgroundColor: p.primary }} />
                    <span className="w-4 h-4 rounded" style={{ backgroundColor: p.accent }} />
                    <span className="w-4 h-4 rounded" style={{ backgroundColor: p.deep || "#3B164B" }} />
                    <span className="text-xs">{p.name}</span>
                  </button>
                  {customPresets.some(cp => cp.name === p.name) && (
                    <button aria-label="Remove preset" onClick={()=>removePreset(p.name)} className="text-xs px-2 py-0.5 rounded hover:bg-black/5">✕</button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Palette chips (live) */}
        <section className="rounded-2xl border border-black/5 bg-white p-5">
          <h2 className="text-lg font-medium mb-4">Live Palette</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {[
              {name:"Primary",hex:primary},
              {name:"Primary 600",hex:shades.primary600},
              {name:"Primary 700",hex:shades.primary700},
              {name:"Accent",hex:accent},
              {name:"Accent 300",hex:shades.accent300},
              {name:"Deep",hex:deep}
            ].map((c)=> (
              <div key={c.name} className="rounded-xl overflow-hidden border border-black/5">
                <div className="h-16" style={{ backgroundColor: c.hex }} />
                <div className="p-3 text-xs">
                  <div className="font-medium">{c.name}</div>
                  <div className="font-mono text-black/60">{c.hex}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Example A — Dark Hero */}
        <section className="rounded-2xl overflow-hidden border border-black/5">
          <div
            className="p-10 md:p-16 text-white relative"
            style={{
              backgroundImage:
                `radial-gradient(1200px 600px at 20% 0%, var(--accent) 0%, rgba(0,0,0,0) 40%), radial-gradient(900px 600px at 100% 50%, var(--primary) 0%, var(--deep) 70%)`,
              backgroundColor: "var(--deep)",
            }}
          >
            <div className="max-w-3xl">
              <p className="uppercase tracking-[0.25em] text-white/70 text-xs mb-4">For women 30+</p>
              <h1 className="text-4xl md:text-6xl leading-tight font-serif">Feel good in your own rhythm</h1>
              <p className="mt-4 text-white/85 max-w-xl">Science-led daily nutrition that supports hormonal balance, sleep, skin, and mood.</p>
              <div className="mt-8 flex gap-3">
                <a href="#" className="rounded-full px-6 py-3 text-sm font-medium bg-white" style={{ color: "var(--deep)" }}>Shop Balance</a>
                <a href="#" className="rounded-full px-6 py-3 text-sm font-medium border border-white/25 hover:bg-white/10">Learn more</a>
              </div>
            </div>
          </div>
        </section>

        {/* Example B — Light Hero */}
        <section className="rounded-2xl border border-black/5 bg-white p-10 md:p-14">
          <div className="grid md:grid-cols-2 items-center gap-10">
            <div>
              <h2 className="text-3xl md:text-5xl font-serif" style={{ color: "var(--text)" }}>Daily support for the next chapter</h2>
              <p className="mt-4 text-black/70 max-w-xl">Gentle, evidence-informed formulas made for real life. Clean label, third-party tested.</p>
              <div className="mt-8 flex gap-3">
                <a href="#" className="rounded-full px-6 py-3 text-sm font-medium text-white" style={{ backgroundColor: "var(--primary)" }}>Shop Now</a>
                <a href="#" className="rounded-full px-6 py-3 text-sm font-medium border" style={{ borderColor: "var(--primary)", color: "var(--primary)" }}>Take quiz</a>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -inset-6 rounded-3xl opacity-70" style={{ background: `radial-gradient(600px 300px at 60% 40%, #EFE7FA 0%, transparent 60%), radial-gradient(400px 280px at 20% 80%, var(--accent) 0%, transparent 60%)` }} />
              <div className="relative rounded-2xl border border-black/5 bg-white p-6 grid grid-cols-4 gap-4">
                {[
                  { name: "Balance", color: "var(--primary)" },
                  { name: "Glow",    color: "var(--accent)" },
                  { name: "Calm",    color: "var(--deep)" },
                  { name: "Restore", color: "#8EA69C" },
                ].map((card) => (
                  <div key={card.name} className="rounded-xl border border-black/5 p-4 flex flex-col items-center">
                    <div className="w-14 h-16 rounded-md mb-3" style={{ background: card.color }} />
                    <div className="text-sm font-medium">{card.name}</div>
                    <button className="mt-3 text-xs rounded-full px-3 py-1 text-white" style={{ backgroundColor: "var(--primary)" }}>Shop</button>
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
              <div className="w-56 h-64 mx-auto rounded-xl" style={{ background: "linear-gradient(180deg, var(--primary) 0%, var(--deep) 100%)" }} />
            </div>
            <div>
              <h3 className="text-2xl md:text-3xl font-serif">Blossm Balance</h3>
              <p className="mt-2 text-sm text-black/70">Supports hormonal balance, sleep quality, and calm mood. 60 capsules. Vegan. Third-party tested.</p>
              <ul className="mt-4 grid gap-2 text-sm">
                <li>• Evidence-informed doses</li>
                <li>• Clean label (no artificial colors)</li>
                <li>• Gentle on daily use</li>
              </ul>
              <div className="mt-6 flex items-center gap-3">
                <div className="text-2xl font-semibold">$39</div>
                <span className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: "#EFE7FA", color: "var(--primary)" }}>Subscribe & Save 15%</span>
              </div>
              <div className="mt-6 flex gap-3">
                <button className="rounded-full px-6 py-3 text-sm font-medium text-white" style={{ backgroundColor: "var(--primary)" }}>Add to Cart</button>
                <button className="rounded-full px-6 py-3 text-sm font-medium border" style={{ borderColor: "var(--primary)", color: "var(--primary)" }}>Learn More</button>
              </div>
            </div>
          </div>
        </section>

        {/* Example D — Editorial / Journal */}
        <section className="rounded-2xl overflow-hidden border border-black/5">
          <div className="p-10 text-white" style={{ background: "linear-gradient(120deg, var(--deep) 0%, var(--primary) 60%)" }}>
            <h3 className="text-3xl md:text-4xl font-serif">The Daily Blossm</h3>
            <p className="mt-2 max-w-2xl text-white/85">Advice, insights, and stories for women 30+. Rituals that fit real life—no hype.</p>
            <div className="mt-8 grid md:grid-cols-3 gap-6">
              {["How to support hormonal health", "A guide to vitamins for skin", "Sleep routines that actually help"].map((t, i) => (
                <article key={i} className="rounded-2xl bg-white" style={{ color: "var(--text)" }}>
                  <div className="h-28 rounded-xl mb-4" style={{ background: i === 1 ? "linear-gradient(180deg,#EFE7FA,white)" : "linear-gradient(180deg, var(--accent), var(--primary))" }} />
                  <div className="p-5">
                    <h4 className="font-medium">{t}</h4>
                    <p className="mt-2 text-sm text-black/70">Short, practical tips grounded in gentle science.</p>
                    <a className="mt-3 inline-block text-sm" style={{ color: "var(--primary)" }} href="#">Read more →</a>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Gradient recipes (live) */}
        <section className="rounded-2xl border border-black/5 bg-white p-6">
          <h3 className="text-lg font-medium mb-3">Gradient recipes (live)</h3>
          <pre className="whitespace-pre-wrap text-xs bg-black/5 p-4 rounded-xl">{`/* Dark hero */
background: radial-gradient(1200px 600px at 20% 0%, ${accent} 0%, rgba(0,0,0,.0) 40%),
            radial-gradient(900px 600px at 100% 50%, ${primary} 0%, ${deep} 70%);

/* Light accent */
background: radial-gradient(600px 300px at 60% 40%, #EFE7FA 0%, transparent 60%),
            radial-gradient(400px 280px at 20% 80%, ${accent} 0%, transparent 60%);

/* Journal header */
background: linear-gradient(120deg, ${deep} 0%, ${primary} 60%);`}</pre>
        </section>
      </main>

      <footer className="py-10 text-center text-xs text-black/60">© Blossm Nutrition</footer>
    </div>
  );
}
