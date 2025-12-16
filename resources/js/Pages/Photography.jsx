import React, { useMemo, useState } from "react";
import { Head, Link } from "@inertiajs/react";
import GuestLayout from "@/Layouts/GuestLayout";

export default function Photography({ tenant }) {
    const brand = tenant?.name || "Harbour Decor Rentals";

    // Replace these later with your real images
    const heroImages = useMemo(
        () => [
            "/images/photo/wedding1.jpg",
            "/images/photo/event1.jpg",
            "/images/photo/baby1.jpg",
        ],
        []
    );

    const gallery = useMemo(
        () => [
            "/images/photo/wedding2.jpg",
            "/images/photo/wedding3.jpg",
            "/images/photo/event2.jpg",
            "/images/photo/event3.jpg",
            "/images/photo/baby2.jpg",
            "/images/photo/baby3.jpg",
            "/images/photo/wedding4.jpg",
            "/images/photo/event4.jpg",
            "/images/photo/baby4.jpg",
        ],
        []
    );

    // Optional embeds (put real URLs later)
    // YouTube embed example: https://www.youtube.com/embed/VIDEO_ID
    const youtubeEmbedUrl = ""; // e.g. "https://www.youtube.com/embed/dQw4w9WgXcQ"
    // Instagram embed example: https://www.instagram.com/reel/ID/embed
    const instagramEmbedUrl = ""; // e.g. "https://www.instagram.com/reel/xxxxx/embed"

    // Modal video (use a real mp4 later if you want)
    const [videoOpen, setVideoOpen] = useState(false);
    const modalVideoSrc = "/videos/sample.mp4"; // placeholder (optional)

    return (
        <GuestLayout tenant={tenant}>
            <Head title={`${brand} · Photography`} />

            {/* HERO */}
            <section className="relative h-[540px] lg:h-[720px] rounded-3xl overflow-hidden bg-slate-950">
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${heroImages[0]})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-black/10" />

                {/* Artistic floating frames */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-10 left-8 w-28 h-28 rounded-2xl border border-white/15 bg-white/5 backdrop-blur" />
                    <div className="absolute bottom-10 left-12 w-40 h-28 rounded-2xl border border-white/15 bg-white/5 backdrop-blur" />
                    <div className="absolute top-16 right-10 w-44 h-32 rounded-2xl border border-white/15 bg-white/5 backdrop-blur" />
                </div>

                <div className="relative z-10 h-full max-w-6xl mx-auto px-6 flex flex-col justify-center">
                    <p className="text-xs uppercase tracking-[0.35em] text-amber-300 mb-4">
                        Photography & Films
                    </p>
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white max-w-3xl leading-tight">
                        Capture emotions.<br />
                        Keep the story forever.
                    </h1>
                    <p className="mt-5 text-base sm:text-lg text-slate-200 max-w-xl">
                        Wedding photography, event coverage, baby shoots, and live cinematic
                        video — crafted with an artistic eye.
                    </p>

                    <div className="mt-8 flex flex-wrap gap-3">
                        <Link
                            href="/quote"
                            className="px-6 py-3 rounded-full bg-amber-400 text-slate-950 font-semibold hover:bg-amber-300 transition"
                        >
                            Book a Shoot
                        </Link>
                        <a
                            href="#portfolio"
                            className="px-6 py-3 rounded-full border border-white/40 text-white hover:bg-white/10 transition"
                        >
                            View Portfolio
                        </a>
                        <button
                            type="button"
                            onClick={() => setVideoOpen(true)}
                            className="px-6 py-3 rounded-full bg-white/10 border border-white/20 text-white hover:bg-white/15 transition inline-flex items-center gap-2"
                        >
                            ▶ Watch highlight
                        </button>
                    </div>

                    <div className="mt-10 flex flex-wrap gap-2 text-[11px] text-white/80">
                        <span className="px-3 py-1 rounded-full border border-amber-300/60 bg-amber-500/10">
                            Editorial portraits
                        </span>
                        <span className="px-3 py-1 rounded-full border border-white/20 bg-white/10">
                            Natural storytelling
                        </span>
                        <span className="px-3 py-1 rounded-full border border-white/20 bg-white/10">
                            Live video + reels
                        </span>
                    </div>
                </div>
            </section>

            {/* SERVICES (ARTISTIC CARDS) */}
            <section className="mt-14 rounded-3xl bg-[#f6f2e6] border border-black/10">
                <div className="max-w-6xl mx-auto px-6 py-12">
                    <p className="text-xs uppercase tracking-[0.35em] text-amber-700">
                        What we shoot
                    </p>
                    <h2 className="mt-3 text-4xl font-extrabold text-slate-950">
                        Photography & Video Services
                    </h2>

                    <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {[
                            {
                                title: "Wedding Photography",
                                text: "Story-driven coverage of emotions, rituals, and timeless portraits.",
                                icon: "💍",
                            },
                            {
                                title: "Event Coverage",
                                text: "Corporate, cultural, birthdays & celebrations — documented naturally.",
                                icon: "🎉",
                            },
                            {
                                title: "Baby & Family",
                                text: "Soft, warm, emotion-filled baby, maternity and family sessions.",
                                icon: "👶",
                            },
                            {
                                title: "Live Video & Films",
                                text: "Cinematic highlights, live streaming, reels, and full-length films.",
                                icon: "🎥",
                            },
                        ].map((s, i) => (
                            <div
                                key={i}
                                className="group bg-white rounded-2xl border border-black/10 p-6 hover-lift"
                            >
                                <div className="text-3xl">{s.icon}</div>
                                <h3 className="mt-4 font-semibold text-lg text-slate-950">
                                    {s.title}
                                </h3>
                                <p className="mt-2 text-sm text-slate-700 leading-relaxed">
                                    {s.text}
                                </p>

                                <div className="mt-5 inline-flex items-center text-sm font-semibold text-amber-700 group-hover:underline">
                                    Learn more →
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* PRICING PACKAGES */}
            <section className="mt-14 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/40">
                <div className="max-w-6xl mx-auto px-6 py-12">
                    <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
                        <div>
                            <p className="text-xs uppercase tracking-[0.35em] text-amber-600 dark:text-amber-300">
                                Packages
                            </p>
                            <h2 className="mt-3 text-4xl font-extrabold">
                                Clear pricing. Beautiful results.
                            </h2>
                            <p className="mt-3 text-sm text-slate-600 dark:text-slate-300 max-w-2xl">
                                These are placeholders. Replace prices/what’s included anytime.
                            </p>
                        </div>
                        <Link
                            href="/quote"
                            className="px-6 py-3 rounded-2xl bg-amber-400 text-slate-950 font-semibold hover:bg-amber-300 transition w-fit"
                        >
                            Request exact quote
                        </Link>
                    </div>

                    <div className="mt-10 grid gap-6 lg:grid-cols-3">
                        {[
                            {
                                name: "Essential",
                                price: "$499",
                                tagline: "Perfect for small sessions",
                                features: [
                                    "1-hour shoot",
                                    "20 edited photos",
                                    "Online gallery",
                                    "1 location",
                                ],
                            },
                            {
                                name: "Signature",
                                price: "$1299",
                                tagline: "Best for weddings/events",
                                featured: true,
                                features: [
                                    "6-hour coverage",
                                    "200+ edited photos",
                                    "Highlight reel (30–60s)",
                                    "2 locations",
                                ],
                            },
                            {
                                name: "Cinematic",
                                price: "$2499",
                                tagline: "Photography + film",
                                features: [
                                    "Full-day coverage",
                                    "2 photographers",
                                    "Cinematic highlight film",
                                    "Drone (optional)",
                                ],
                            },
                        ].map((p, idx) => (
                            <div
                                key={idx}
                                className={
                                    "rounded-3xl border p-7 hover-lift " +
                                    (p.featured
                                        ? "border-amber-400 bg-amber-500/10"
                                        : "border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-950/30")
                                }
                            >
                                <div className="flex items-center justify-between">
                                    <div className="text-lg font-semibold">{p.name}</div>
                                    {p.featured ? (
                                        <span className="text-[11px] px-3 py-1 rounded-full bg-amber-400 text-slate-950 font-semibold">
                                            Popular
                                        </span>
                                    ) : null}
                                </div>
                                <div className="mt-3 text-4xl font-extrabold">{p.price}</div>
                                <div className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                                    {p.tagline}
                                </div>

                                <ul className="mt-6 space-y-2 text-sm text-slate-700 dark:text-slate-300">
                                    {p.features.map((f) => (
                                        <li key={f} className="flex gap-2">
                                            <span className="text-amber-600 dark:text-amber-300">✓</span>
                                            <span>{f}</span>
                                        </li>
                                    ))}
                                </ul>

                                <Link
                                    href="/quote"
                                    className="mt-7 inline-flex w-full justify-center px-5 py-3 rounded-2xl bg-slate-950 text-amber-300 font-semibold hover:bg-black transition"
                                >
                                    Choose {p.name}
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* BEFORE / AFTER SLIDER */}
            <section className="mt-14 rounded-3xl bg-[#f6f2e6] border border-black/10">
                <div className="max-w-6xl mx-auto px-6 py-12">
                    <p className="text-xs uppercase tracking-[0.35em] text-amber-700">
                        Before / After
                    </p>
                    <h2 className="mt-3 text-4xl font-extrabold text-slate-950">
                        Edit style preview
                    </h2>
                    <p className="mt-3 text-sm text-slate-700 max-w-2xl">
                        Replace these two images later with your real “RAW vs Edited” sample.
                    </p>

                    <div className="mt-8">
                        <BeforeAfter
                            beforeSrc="/images/photo/before.jpg"
                            afterSrc="/images/photo/after.jpg"
                        />
                    </div>
                </div>
            </section>

            {/* PORTFOLIO */}
            <section
                id="portfolio"
                className="mt-14 rounded-3xl bg-[#f6f2e6] border border-black/10"
            >
                <div className="max-w-6xl mx-auto px-6 py-12">
                    <p className="text-xs uppercase tracking-[0.35em] text-amber-700">
                        Portfolio
                    </p>
                    <h2 className="mt-3 text-4xl font-extrabold text-slate-950">
                        Recent work
                    </h2>

                    {/* Mosaic */}
                    <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {gallery.map((src, i) => (
                            <div
                                key={i}
                                className="relative rounded-2xl overflow-hidden border border-black/10 hover-lift"
                            >
                                <div
                                    className="h-[270px] bg-cover bg-center hover-zoom"
                                    style={{ backgroundImage: `url(${src})` }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/0 to-transparent opacity-70" />
                            </div>
                        ))}
                    </div>

                    <div className="mt-10 flex flex-wrap gap-3">
                        <Link
                            href="/quote"
                            className="px-6 py-3 rounded-2xl bg-slate-950 text-amber-300 font-semibold hover:bg-black transition"
                        >
                            Book now
                        </Link>
                        <button
                            type="button"
                            onClick={() => setVideoOpen(true)}
                            className="px-6 py-3 rounded-2xl bg-white border border-black/10 text-slate-950 font-semibold hover:bg-black/5 transition"
                        >
                            Watch highlight →
                        </button>
                    </div>
                </div>
            </section>

            {/* EMBEDS (IG / YT) */}
            <section className="mt-14 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/40">
                <div className="max-w-6xl mx-auto px-6 py-12">
                    <p className="text-xs uppercase tracking-[0.35em] text-amber-600 dark:text-amber-300">
                        Follow our work
                    </p>
                    <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold">
                        Reels & highlights
                    </h2>

                    <div className="mt-10 grid gap-6 lg:grid-cols-2">
                        <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800">
                            <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                                <div className="font-semibold">YouTube (optional)</div>
                                <div className="text-[11px] text-slate-500 dark:text-slate-400">
                                    set <b>youtubeEmbedUrl</b>
                                </div>
                            </div>

                            {youtubeEmbedUrl ? (
                                <iframe
                                    title="YouTube Embed"
                                    src={youtubeEmbedUrl}
                                    className="w-full"
                                    style={{ height: 360 }}
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                />
                            ) : (
                                <div className="p-5 text-sm text-slate-600 dark:text-slate-300">
                                    No YouTube embed set. Add a link like:
                                    <div className="mt-2 text-xs p-3 rounded-xl bg-slate-100 dark:bg-slate-900">
                                        https://www.youtube.com/embed/VIDEO_ID
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800">
                            <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                                <div className="font-semibold">Instagram (optional)</div>
                                <div className="text-[11px] text-slate-500 dark:text-slate-400">
                                    set <b>instagramEmbedUrl</b>
                                </div>
                            </div>

                            {instagramEmbedUrl ? (
                                <iframe
                                    title="Instagram Embed"
                                    src={instagramEmbedUrl}
                                    className="w-full"
                                    style={{ height: 360 }}
                                    frameBorder="0"
                                    scrolling="no"
                                    allow="encrypted-media"
                                />
                            ) : (
                                <div className="p-5 text-sm text-slate-600 dark:text-slate-300">
                                    No Instagram embed set. Add a link like:
                                    <div className="mt-2 text-xs p-3 rounded-xl bg-slate-100 dark:bg-slate-900">
                                        https://www.instagram.com/reel/ID/embed
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="mt-10 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 bg-amber-500/10">
                        <div className="text-lg font-semibold">Fast booking</div>
                        <div className="mt-2 text-sm text-slate-700 dark:text-slate-300">
                            Tell us your <b>date</b>, <b>city</b>, <b>event type</b>, and
                            what you want (photo / video / live). We’ll reply quickly.
                        </div>
                        <div className="mt-5 flex gap-2">
                            <Link
                                href="/quote"
                                className="px-5 py-2.5 rounded-xl bg-amber-400 text-slate-950 font-semibold hover:bg-amber-300"
                            >
                                Request quote
                            </Link>
                            <button
                                type="button"
                                onClick={() => setVideoOpen(true)}
                                className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 font-semibold"
                            >
                                See highlight
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="mt-14 rounded-3xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500">
                <div className="px-6 py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-950">
                            Let’s capture your story
                        </h2>
                        <p className="text-sm text-slate-800 mt-1">
                            Wedding · Event · Baby · Live video — we’ll make it cinematic.
                        </p>
                    </div>
                    <Link
                        href="/quote"
                        className="px-6 py-3 rounded-full bg-slate-950 text-amber-300 font-semibold hover:bg-black"
                    >
                        Book now
                    </Link>
                </div>
            </section>

            {/* VIDEO MODAL */}
            {videoOpen && (
                <div className="fixed inset-0 z-[80] bg-black/70 flex items-center justify-center p-4">
                    <div className="w-full max-w-4xl rounded-3xl overflow-hidden border border-white/10 bg-slate-950 shadow-2xl">
                        <div className="px-4 py-3 flex items-center justify-between border-b border-white/10">
                            <div className="text-sm font-semibold text-white">
                                Highlight video
                            </div>
                            <button
                                type="button"
                                onClick={() => setVideoOpen(false)}
                                className="text-xs px-3 py-1 rounded-full bg-white/10 text-white hover:bg-white/15"
                            >
                                ✕ Close
                            </button>
                        </div>

                        <div className="aspect-video bg-black">
                            {/* If you don’t have a video file yet, you can keep this as a poster image later */}
                            <video
                                controls
                                autoPlay
                                className="w-full h-full"
                                src={modalVideoSrc}
                            />
                        </div>

                        <div className="p-4 text-sm text-slate-300">
                            Replace <b>/videos/sample.mp4</b> with your real highlight film.
                            (Or switch to a YouTube iframe if you prefer.)
                        </div>
                    </div>
                </div>
            )}

            {/* Animations */}
            <style>{`
                .hover-lift{transition: transform 220ms ease, box-shadow 220ms ease;}
                .hover-lift:hover{transform: translateY(-4px); box-shadow: 0 18px 45px -20px rgba(0,0,0,0.45);}
                .hover-zoom{transition: transform 600ms ease;}
                .hover-zoom:hover{transform: scale(1.05);}
            `}</style>
        </GuestLayout>
    );
}

/**
 * BeforeAfter slider (simple, smooth)
 * - Replace images later
 */
function BeforeAfter({ beforeSrc, afterSrc }) {
    const [value, setValue] = useState(55);

    return (
        <div className="relative rounded-3xl overflow-hidden border border-black/10 bg-white">
            <div className="relative h-[320px] sm:h-[420px]">
                {/* AFTER (full) */}
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${afterSrc})` }}
                />

                {/* BEFORE (clipped) */}
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                        backgroundImage: `url(${beforeSrc})`,
                        clipPath: `inset(0 ${100 - value}% 0 0)`,
                    }}
                />

                {/* Divider */}
                <div
                    className="absolute top-0 bottom-0 w-[2px] bg-white/90 shadow"
                    style={{ left: `${value}%` }}
                />

                {/* Knob */}
                <div
                    className="absolute top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white text-slate-900 grid place-items-center shadow-lg"
                    style={{ left: `calc(${value}% - 20px)` }}
                >
                    ⇆
                </div>

                {/* Labels */}
                <div className="absolute top-4 left-4 text-xs px-3 py-1 rounded-full bg-black/60 text-white">
                    Before
                </div>
                <div className="absolute top-4 right-4 text-xs px-3 py-1 rounded-full bg-black/60 text-white">
                    After
                </div>
            </div>

            <div className="px-5 py-4 bg-white">
                <input
                    type="range"
                    min="0"
                    max="100"
                    value={value}
                    onChange={(e) => setValue(Number(e.target.value))}
                    className="w-full"
                />
                <div className="mt-2 text-xs text-slate-600">
                    Slide to preview editing style
                </div>
            </div>
        </div>
    );
}
