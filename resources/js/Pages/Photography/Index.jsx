import React, { useEffect, useMemo, useState } from "react";
import { Head, Link } from "@inertiajs/react";
import GuestLayout from "@/Layouts/GuestLayout";

export default function PhotographyIndex({ tenant }) {
    const brandName = tenant?.name || "Harbour Decor Rentals";

    // ✅ Replace these with your real images (public/images/photo/*)
    const heroSlides = useMemo(
        () => [
            "/images/photo/wedding1.jpg",
            "/images/photo/event1.jpg",
            "/images/photo/baby1.jpg",
            "/images/photo/live1.jpg",
        ],
        []
    );

    // ✅ Replace with your real video (public/videos/*)
    const highlightVideo = "/videos/highlight.mp4";

    const serviceCards = [
        {
            title: "Wedding Photography",
            tag: "Full-day • Bridal portraits • Reception",
            desc: "Cinematic storytelling with elegant editing, emotional moments, and premium details.",
            icon: "💍",
            image: "/images/photo/wedding2.jpg",
        },
        {
            title: "Event Photography",
            tag: "Corporate • Cultural • Parties",
            desc: "Clean, modern coverage of decor, guests, stage, speeches, and key highlights.",
            icon: "🎉",
            image: "/images/photo/event2.jpg",
        },
        {
            title: "Baby & Family Shoots",
            tag: "Studio / Lifestyle",
            desc: "Soft light, gentle direction, and timeless edits with warm tones and natural emotion.",
            icon: "🍼",
            image: "/images/photo/baby2.jpg",
        },
        {
            title: "Live Video + Reels",
            tag: "Live streaming • Highlights • Short reels",
            desc: "Live coverage plus cinematic highlight edits and social-ready reels for Instagram.",
            icon: "🎥",
            image: "/images/photo/live2.jpg",
        },
    ];

    const steps = [
        { title: "Inquiry", text: "Share your date, venue, and style. We confirm availability quickly." },
        { title: "Plan", text: "We align timeline, key moments, and shot priorities for your event." },
        { title: "Shoot", text: "Calm direction + candid coverage for a premium natural look." },
        { title: "Deliver", text: "Curated gallery + optional highlight video with consistent color grading." },
    ];

    const testimonials = [
        {
            name: "Ayesha",
            role: "Wedding",
            text: "The photos looked cinematic — we felt so comfortable. Perfect details and colors.",
        },
        {
            name: "Ravi",
            role: "Event",
            text: "Very professional. Great communication and the final edits were beautiful.",
        },
        {
            name: "Sana",
            role: "Baby shoot",
            text: "So patient with our baby and the gallery felt warm and timeless.",
        },
    ];

    // Hero slideshow
    const [idx, setIdx] = useState(0);
    useEffect(() => {
        const t = setInterval(() => setIdx((p) => (p + 1) % heroSlides.length), 6500);
        return () => clearInterval(t);
    }, [heroSlides.length]);

    const current = heroSlides[idx];

    // Video modal
    const [openVideo, setOpenVideo] = useState(false);

    return (
        <GuestLayout tenant={tenant}>
            <Head title={`${brandName} • Photography`} />

            {/* HERO */}
            <section className="relative overflow-hidden rounded-3xl bg-slate-950 border border-slate-200/40 dark:border-slate-800">
                <div
                    className="absolute inset-0 bg-cover bg-center transition-all duration-700"
                    style={{ backgroundImage: `url(${current})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/55 to-black/10" />

                <div className="relative z-10 px-6 sm:px-10 py-14 sm:py-16 lg:py-20 max-w-6xl mx-auto">
                    <p className="reveal text-xs uppercase tracking-[0.35em] text-amber-300">
                        Photography • Video • Live Streaming
                    </p>
                    <h1 className="reveal reveal-delay-1 mt-4 text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight max-w-3xl">
                        Unique, artistic wedding & event storytelling — with a cinematic finish.
                    </h1>
                    <p className="reveal reveal-delay-2 mt-5 text-base sm:text-lg text-slate-200 max-w-2xl leading-relaxed">
                        We capture emotion, details, and atmosphere — from bridal stages to baby smiles.
                        GTA & Windsor (travel available).
                    </p>

                    <div className="reveal reveal-delay-3 mt-7 flex flex-col sm:flex-row gap-3">
                        <Link
                            href="/portfolio"
                            className="inline-flex items-center justify-center px-7 py-3 rounded-full bg-amber-400 text-slate-950 font-semibold shadow-lg hover:bg-amber-300 transition"
                        >
                            View Portfolio
                        </Link>
                        <button
                            type="button"
                            onClick={() => setOpenVideo(true)}
                            className="inline-flex items-center justify-center px-7 py-3 rounded-full border border-white/35 text-white font-semibold hover:bg-white/10 transition"
                        >
                            ▶ Watch Highlight
                        </button>
                        <Link
                            href="/quote"
                            className="inline-flex items-center justify-center px-7 py-3 rounded-full border border-amber-300/60 text-amber-200 font-semibold hover:bg-white/10 transition"
                        >
                            Get a Quote
                        </Link>
                    </div>

                    <div className="reveal reveal-delay-4 mt-10 grid gap-3 sm:grid-cols-3 max-w-3xl">
                        <StatCard label="Weddings" value="Full-day coverage" />
                        <StatCard label="Events" value="Cultural + corporate" />
                        <StatCard label="Baby" value="Soft timeless edits" />
                    </div>
                </div>

                {/* dots */}
                <div className="absolute bottom-6 left-0 right-0 z-20 flex justify-center gap-2">
                    {heroSlides.map((_, i) => (
                        <button
                            key={i}
                            type="button"
                            onClick={() => setIdx(i)}
                            className={`h-2 w-2 rounded-full border border-white ${
                                i === idx ? "bg-amber-400" : "bg-white/20"
                            }`}
                            aria-label={`Slide ${i + 1}`}
                        />
                    ))}
                </div>
            </section>

            {/* SERVICES */}
            <section className="mt-12 rounded-3xl bg-[#f6f2e6] border border-black/10 overflow-hidden">
                <div className="max-w-6xl mx-auto px-6 sm:px-10 py-12">
                    <div className="grid lg:grid-cols-2 gap-10 items-start">
                        <div>
                            <p className="reveal text-xs uppercase tracking-[0.35em] text-amber-700">
                                Services
                            </p>
                            <h2 className="reveal reveal-delay-1 mt-3 text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-950">
                                Premium visuals — without feeling staged.
                            </h2>
                        </div>
                        <p className="reveal reveal-delay-2 text-slate-700 leading-relaxed">
                            Calm direction, candid coverage, and polished edits. Your gallery will feel cohesive,
                            cinematic, and timeless.
                        </p>
                    </div>

                    <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                        {serviceCards.map((c, i) => (
                            <div
                                key={c.title}
                                className={`reveal reveal-delay-${(i % 4) + 1} group relative rounded-2xl overflow-hidden border border-black/10 bg-white hover-lift`}
                            >
                                <div
                                    className="h-[340px] bg-cover bg-center hover-zoom"
                                    style={{ backgroundImage: `url(${c.image})` }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-95" />
                                <div className="absolute inset-x-0 bottom-0 p-5">
                                    <div className="flex items-center gap-2 text-white">
                                        <div className="h-10 w-10 rounded-2xl bg-white/10 border border-white/15 grid place-items-center text-lg">
                                            {c.icon}
                                        </div>
                                        <div>
                                            <div className="text-xl font-semibold drop-shadow">{c.title}</div>
                                            <div className="text-xs text-white/80">{c.tag}</div>
                                        </div>
                                    </div>
                                    <div className="mt-3 text-sm text-white/85 leading-relaxed">
                                        {c.desc}
                                    </div>
                                    <div className="mt-4">
                                        <Link
                                            href="/portfolio"
                                            className="inline-flex items-center text-sm font-semibold text-amber-200 hover:text-amber-100"
                                        >
                                            See examples →
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* PROCESS */}
            <section className="mt-12 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/40 overflow-hidden">
                <div className="max-w-6xl mx-auto px-6 sm:px-10 py-12">
                    <div className="flex flex-col lg:flex-row gap-10 lg:items-end lg:justify-between">
                        <div>
                            <p className="reveal text-xs uppercase tracking-[0.35em] text-amber-600 dark:text-amber-300">
                                How it works
                            </p>
                            <h2 className="reveal reveal-delay-1 mt-3 text-3xl sm:text-4xl font-extrabold tracking-tight">
                                Smooth from booking to delivery
                            </h2>
                        </div>
                        <Link
                            href="/quote"
                            className="reveal reveal-delay-2 inline-flex items-center justify-center px-5 py-3 rounded-2xl bg-slate-950 text-white font-semibold hover:bg-black transition"
                        >
                            Request pricing →
                        </Link>
                    </div>

                    <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {steps.map((s, i) => (
                            <div
                                key={s.title}
                                className={`reveal reveal-delay-${(i % 4) + 1} rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-950/30 p-5 hover-lift`}
                            >
                                <div className="text-[11px] uppercase tracking-[0.25em] text-amber-600 dark:text-amber-300">
                                    Step {i + 1}
                                </div>
                                <div className="mt-2 font-semibold text-lg">{s.title}</div>
                                <div className="mt-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                                    {s.text}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* TESTIMONIALS */}
            <section className="mt-12 rounded-3xl bg-slate-950 text-white overflow-hidden border border-slate-800">
                <div className="max-w-6xl mx-auto px-6 sm:px-10 py-12">
                    <div className="grid lg:grid-cols-2 gap-10 items-start">
                        <div>
                            <p className="reveal text-xs uppercase tracking-[0.35em] text-amber-300">Kind words</p>
                            <h2 className="reveal reveal-delay-1 mt-3 text-4xl sm:text-5xl font-extrabold">
                                Clients remember the feeling.
                            </h2>
                            <p className="reveal reveal-delay-2 mt-4 text-slate-300 leading-relaxed">
                                Calm experience during the shoot — premium results after.
                            </p>
                        </div>

                        <div className="grid gap-4">
                            {testimonials.map((t, i) => (
                                <div
                                    key={t.name}
                                    className={`reveal reveal-delay-${(i % 3) + 1} rounded-2xl border border-white/10 bg-white/5 p-6 hover-lift`}
                                >
                                    <div className="text-sm text-white/90 leading-relaxed">“{t.text}”</div>
                                    <div className="mt-4 flex items-center justify-between">
                                        <div>
                                            <div className="font-semibold">{t.name}</div>
                                            <div className="text-xs text-white/70">{t.role}</div>
                                        </div>
                                        <div className="text-amber-300">★★★★★</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="mt-12 rounded-3xl overflow-hidden border border-amber-300/60 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500">
                <div className="px-6 sm:px-10 py-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <div>
                        <h2 className="text-3xl font-extrabold text-slate-950">Let’s plan something beautiful.</h2>
                        <p className="mt-2 text-slate-900/80">
                            Tell us your date + venue, and we’ll guide you on packages and add-ons.
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        <Link
                            href="/portfolio"
                            className="inline-flex items-center justify-center px-7 py-3 rounded-full bg-slate-950 text-white font-semibold hover:bg-black transition"
                        >
                            View Portfolio
                        </Link>
                        <Link
                            href="/quote"
                            className="inline-flex items-center justify-center px-7 py-3 rounded-full bg-white text-slate-950 font-semibold hover:bg-white/90 transition"
                        >
                            Get Quote
                        </Link>
                    </div>
                </div>
            </section>

            {/* VIDEO MODAL */}
            {openVideo && (
                <div className="fixed inset-0 z-[80]">
                    <div className="absolute inset-0 bg-black/70" onClick={() => setOpenVideo(false)} />
                    <div className="absolute inset-x-0 top-10 sm:top-16 mx-auto max-w-5xl px-4">
                        <div className="rounded-3xl overflow-hidden border border-white/10 bg-slate-950 shadow-2xl">
                            <div className="px-4 py-3 flex items-center justify-between border-b border-white/10">
                                <div className="text-sm font-semibold text-white">Highlight Video</div>
                                <button
                                    type="button"
                                    onClick={() => setOpenVideo(false)}
                                    className="text-xs px-3 py-1 rounded-full bg-white/10 text-white hover:bg-white/15"
                                >
                                    Close ✕
                                </button>
                            </div>
                            <div className="p-3">
                                <video
                                    src={highlightVideo}
                                    controls
                                    playsInline
                                    className="w-full rounded-2xl bg-black"
                                />
                                <div className="mt-2 text-xs text-white/60">
                                    Replace video file: <span className="text-white/80">public/videos/highlight.mp4</span>
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

function StatCard({ label, value }) {
    return (
        <div className="reveal rounded-2xl border border-white/15 bg-white/5 backdrop-blur px-5 py-4 hover-lift">
            <div className="text-[11px] uppercase tracking-[0.25em] text-white/70">{label}</div>
            <div className="mt-2 text-base font-semibold text-white">{value}</div>
        </div>
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
