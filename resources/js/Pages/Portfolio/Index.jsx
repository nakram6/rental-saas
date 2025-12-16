import React, { useEffect, useMemo, useState } from "react";
import { Head, Link } from "@inertiajs/react";
import GuestLayout from "@/Layouts/GuestLayout";

export default function PortfolioIndex({ tenant }) {
    const brandName = tenant?.name || "Harbour Decor Rentals";

    // ✅ Replace with real images in public/images/portfolio/*
    const items = useMemo(
        () => [
            { id: 1, cat: "Weddings", title: "Bridal portraits", src: "/images/portfolio/wedding1.jpg" },
            { id: 2, cat: "Weddings", title: "Reception details", src: "/images/portfolio/wedding2.jpg" },
            { id: 3, cat: "Events", title: "Stage moments", src: "/images/portfolio/event1.jpg" },
            { id: 4, cat: "Events", title: "Guests & candids", src: "/images/portfolio/event2.jpg" },
            { id: 5, cat: "Baby", title: "Soft studio light", src: "/images/portfolio/baby1.jpg" },
            { id: 6, cat: "Baby", title: "Family lifestyle", src: "/images/portfolio/baby2.jpg" },
            { id: 7, cat: "Video", title: "Highlight frame", src: "/images/portfolio/video1.jpg" },
            { id: 8, cat: "Video", title: "Live stream setup", src: "/images/portfolio/video2.jpg" },
            { id: 9, cat: "Weddings", title: "Golden hour", src: "/images/portfolio/wedding3.jpg" },
            { id: 10, cat: "Events", title: "Cultural ceremony", src: "/images/portfolio/event3.jpg" },
            { id: 11, cat: "Baby", title: "Tiny details", src: "/images/portfolio/baby3.jpg" },
            { id: 12, cat: "Video", title: "Cinematic scene", src: "/images/portfolio/video3.jpg" },
        ],
        []
    );

    const categories = useMemo(() => {
        const set = new Set(items.map((i) => i.cat));
        return ["All", ...Array.from(set)];
    }, [items]);

    const [active, setActive] = useState("All");
    const [lightbox, setLightbox] = useState(null);

    const filtered = useMemo(() => {
        if (active === "All") return items;
        return items.filter((i) => i.cat === active);
    }, [items, active]);

    useEffect(() => {
        if (!lightbox) return;
        const onKey = (e) => {
            if (e.key === "Escape") setLightbox(null);
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [lightbox]);

    return (
        <GuestLayout tenant={tenant}>
            <Head title={`${brandName} • Portfolio`} />

            {/* Header */}
            <section className="rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/40">
                <div className="px-6 sm:px-10 py-12 max-w-6xl mx-auto">
                    <p className="reveal text-xs uppercase tracking-[0.35em] text-amber-600 dark:text-amber-300">
                        Portfolio
                    </p>
                    <h1 className="reveal reveal-delay-1 mt-3 text-4xl sm:text-5xl font-extrabold tracking-tight">
                        A curated selection of our work
                    </h1>
                    <p className="reveal reveal-delay-2 mt-4 text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl">
                        Browse by category. Click any photo to view fullscreen.
                    </p>

                    <div className="reveal reveal-delay-3 mt-7 flex flex-wrap gap-2">
                        {categories.map((c) => (
                            <button
                                key={c}
                                type="button"
                                onClick={() => setActive(c)}
                                className={
                                    "px-4 py-2 rounded-full text-sm font-semibold border transition " +
                                    (active === c
                                        ? "bg-slate-950 text-white border-slate-950 dark:bg-white dark:text-slate-950 dark:border-white"
                                        : "bg-white/60 dark:bg-slate-950/20 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/10")
                                }
                            >
                                {c}
                            </button>
                        ))}

                        <div className="ml-auto flex items-center gap-2">
                            <Link
                                href="/photography"
                                className="px-4 py-2 rounded-full text-sm font-semibold border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-white/10"
                            >
                                Services
                            </Link>
                            <Link
                                href="/quote"
                                className="px-4 py-2 rounded-full text-sm font-semibold bg-amber-400 text-slate-950 hover:bg-amber-300"
                            >
                                Get Quote
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Gallery */}
            <section className="mt-10">
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {filtered.map((it, i) => (
                        <button
                            key={it.id}
                            type="button"
                            onClick={() => setLightbox(it)}
                            className={`reveal reveal-delay-${(i % 4) + 1} group text-left rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/40 hover-lift`}
                        >
                            <div className="h-56 bg-cover bg-center hover-zoom" style={{ backgroundImage: `url(${it.src})` }} />
                            <div className="p-4">
                                <div className="text-[11px] uppercase tracking-[0.25em] text-amber-600 dark:text-amber-300">
                                    {it.cat}
                                </div>
                                <div className="mt-1 font-semibold group-hover:underline">{it.title}</div>
                            </div>
                        </button>
                    ))}
                </div>

                <div className="reveal reveal-delay-3 mt-10 rounded-3xl bg-[#f6f2e6] border border-black/10 p-8">
                    <div className="max-w-4xl">
                        <div className="text-xs uppercase tracking-[0.35em] text-amber-700">Custom packages</div>
                        <div className="mt-3 text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-950">
                            Tell us your date + venue — we’ll reply with options.
                        </div>
                        <div className="mt-4 text-slate-700">
                            Add-ons: short reels, live streaming, drone, second shooter, same-day edit.
                        </div>
                        <div className="mt-6 flex flex-wrap gap-3">
                            <Link href="/quote" className="px-6 py-3 rounded-2xl bg-slate-950 text-white font-semibold hover:bg-black transition">
                                Get a Quote
                            </Link>
                            <Link href="/photography" className="px-6 py-3 rounded-2xl border border-black/15 text-slate-950 font-semibold hover:bg-black/5 transition">
                                View Services
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Lightbox */}
            {lightbox && (
                <div className="fixed inset-0 z-[90]">
                    <div className="absolute inset-0 bg-black/75" onClick={() => setLightbox(null)} />
                    <div className="absolute inset-x-0 top-10 sm:top-16 mx-auto max-w-6xl px-4">
                        <div className="rounded-3xl overflow-hidden border border-white/10 bg-slate-950 shadow-2xl">
                            <div className="px-4 py-3 flex items-center justify-between border-b border-white/10">
                                <div className="text-sm font-semibold text-white">{lightbox.title}</div>
                                <button
                                    type="button"
                                    onClick={() => setLightbox(null)}
                                    className="text-xs px-3 py-1 rounded-full bg-white/10 text-white hover:bg-white/15"
                                >
                                    Close ✕
                                </button>
                            </div>
                            <div className="p-3">
                                <div className="w-full rounded-2xl overflow-hidden bg-black" style={{ aspectRatio: "16/9" }}>
                                    <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${lightbox.src})` }} />
                                </div>
                                <div className="mt-3 flex items-center justify-between text-xs text-white/70">
                                    <span>{lightbox.cat}</span>
                                    <span>Press ESC to close</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <style>{styles}</style>
            <RevealObserver />
        </GuestLayout>
    );
}

function RevealObserver() {
    useEffect(() => {
        const els = Array.from(document.querySelectorAll(".reveal"));
        if (!els.length) return;

        const io = new IntersectionObserver(
            (entries) => {
                entries.forEach((e) => {
                    if (e.isIntersecting) {
                        e.target.classList.add("is-in");
                        io.unobserve(e.target);
                    }
                });
            },
            { threshold: 0.12, rootMargin: "80px" }
        );

        els.forEach((el) => io.observe(el));
        return () => io.disconnect();
    }, []);

    return null;
}

const styles = `
.reveal{opacity:0; transform: translateY(10px); transition: opacity 700ms ease, transform 700ms ease;}
.reveal.is-in{opacity:1; transform: translateY(0);}
.reveal-delay-1{transition-delay: 90ms;}
.reveal-delay-2{transition-delay: 180ms;}
.reveal-delay-3{transition-delay: 260ms;}
.reveal-delay-4{transition-delay: 340ms;}

.hover-lift{transition: transform 220ms ease, box-shadow 220ms ease;}
.hover-lift:hover{transform: translateY(-4px); box-shadow: 0 18px 45px -20px rgba(0,0,0,0.45);}

.hover-zoom{transition: transform 600ms ease;}
.hover-zoom:hover{transform: scale(1.04);}
`;
