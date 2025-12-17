import React, { useEffect, useMemo, useState } from "react";
import { Head, Link } from "@inertiajs/react";
import GuestLayout from "@/Layouts/GuestLayout";

export default function PortfolioIndex({ tenant, items = [] }) {
  const brandName = tenant?.name || "Harbour Decor Rentals";

  /* -----------------------------
     FILTER STATE
  ------------------------------ */
  const categories = useMemo(() => {
    const map = new Map();
    items.forEach((i) => map.set(i.catKey, i.cat));
    return [{ key: "all", label: "All" }, ...Array.from(map, ([key, label]) => ({ key, label }))];
  }, [items]);

  const [activeKey, setActiveKey] = useState("all");

  const filteredItems = useMemo(() => {
    return activeKey === "all"
      ? items
      : items.filter((i) => i.catKey === activeKey);
  }, [items, activeKey]);

  /* -----------------------------
     HERO SLIDER (ONE IMAGE ONLY)
  ------------------------------ */
  const slides = useMemo(() => {
    return filteredItems.slice(0, 4); // max 4 images
  }, [filteredItems]);

  const [slideIndex, setSlideIndex] = useState(0);

  useEffect(() => {
    setSlideIndex(0); // reset when filter changes
  }, [activeKey]);

  useEffect(() => {
    if (slides.length <= 1) return;
    const t = setInterval(() => {
      setSlideIndex((i) => (i + 1) % slides.length);
    }, 4500);
    return () => clearInterval(t);
  }, [slides]);

  const hero = slides[slideIndex];

  /* -----------------------------
     COUNT HELPER
  ------------------------------ */
  const countFor = (key) =>
    key === "all" ? items.length : items.filter((i) => i.catKey === key).length;

  return (
    <GuestLayout tenant={tenant}>
      <Head title={`${brandName} • Portfolio`} />

      {/* =============================
          SINGLE HERO + FILTERS
      ============================== */}
      <section className="rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800">
        <div className="relative h-[360px] sm:h-[420px]">
          {hero && (
            <div
              className="absolute inset-0 bg-cover bg-center transition-opacity duration-700"
              style={{ backgroundImage: `url(${hero.full})` }}
            />
          )}

          <div className="absolute inset-0 bg-black/55" />

          <div className="relative z-10 max-w-6xl mx-auto px-6 py-12 text-white">
            <p className="text-xs uppercase tracking-[0.35em] text-amber-300">
              Portfolio
            </p>

            <h1 className="mt-3 text-4xl font-extrabold">
              Our Featured Work
            </h1>

            <p className="mt-3 max-w-2xl text-white/80">
              Browse weddings, events, baby shoots, and video work.
            </p>

            {/* FILTERS */}
            <div className="mt-6 flex flex-wrap gap-2">
              {categories.map((c) => (
                <button
                  key={c.key}
                  onClick={() => setActiveKey(c.key)}
                  className={
                    "px-4 py-2 rounded-full text-sm font-semibold transition " +
                    (activeKey === c.key
                      ? "bg-amber-400 text-slate-900"
                      : "bg-white/15 text-white hover:bg-white/25")
                  }
                >
                  {c.label} ({countFor(c.key)})
                </button>
              ))}

              <Link
                href="/quote"
                className="ml-auto px-4 py-2 rounded-full bg-amber-400 text-slate-900 font-semibold"
              >
                Get Quote
              </Link>
            </div>

            {/* SLIDER DOTS */}
            {slides.length > 1 && (
              <div className="mt-4 flex gap-2">
                {slides.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setSlideIndex(i)}
                    className={
                      "h-2.5 w-2.5 rounded-full " +
                      (i === slideIndex ? "bg-white" : "bg-white/40")
                    }
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* =============================
          IMAGE GRID (RESTORED)
      ============================== */}
      <section className="mt-10">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredItems.map((it) => (
            <button
              key={it.id}
              className="group rounded-2xl overflow-hidden border bg-white dark:bg-slate-950/40"
            >
              <div className="relative aspect-[4/3] bg-slate-200 dark:bg-slate-900">
                <img
                  src={it.thumb}
                  alt={it.title}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover transition group-hover:scale-105"
                />
              </div>
              <div className="p-3 text-left">
                <div className="text-xs uppercase tracking-wide text-amber-600">
                  {it.cat}
                </div>
                <div className="font-semibold">{it.title}</div>
              </div>
            </button>
          ))}
        </div>
      </section>
    </GuestLayout>
  );
}
