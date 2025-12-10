import React, { useEffect, useState } from "react";
import { Head, Link } from "@inertiajs/react";
import GuestLayout from "@/Layouts/GuestLayout";

export default function Home({ tenant, items = [] }) {
    const title = tenant?.name || "Event Decor Rentals";

    // Slides for hero background
    const slides = [
        {
            image: "resources/js/Pages/Public/images/hero-sofa.jpg",
            heading: "Luxury Stage Sofas & Seating",
            text: "Create dreamy bridal stages and elegant main seating for your event.",
        },
        {
            image: "hero-backdrop.jpg",
            heading: "Floral & Fabric Backdrops",
            text: "Beautiful backdrops that transform any hall into a photo-ready space.",
        },
        {
            image: "resources/js/Pages/Public/images/hero-centerpieces.jpg",
            heading: "Table Décor & Centerpieces",
            text: "Complete your tables with stylish centerpieces and accent décor.",
        },
    ];

    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % slides.length);
        }, 6000); // 6s per slide

        return () => clearInterval(interval);
    }, [slides.length]);

    const goPrev = () => {
        setCurrentIndex((prev) =>
            prev === 0 ? slides.length - 1 : prev - 1
        );
    };

    const goNext = () => {
        setCurrentIndex((prev) => (prev + 1) % slides.length);
    };

    const currentSlide = slides[currentIndex];

    const hasItems = items.length > 0;

    return (
        <GuestLayout tenant={tenant}>
            <Head title={title} />

            {/* HERO SLIDESHOW */}
            <section className="relative h-[520px] sm:h-[620px] lg:h-[700px] overflow-hidden">
                {/* Background image */}
                <div
                    className="absolute inset-0 bg-cover bg-center transition-all duration-700"
                    style={{
                        backgroundImage: `url(${currentSlide.image})`,
                    }}
                />

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/20" />

                {/* Content */}
                <div className="relative z-10 h-full max-w-6xl mx-auto px-4 flex flex-col justify-center">
                    <p className="text-sm uppercase tracking-[0.25em] text-amber-300 mb-4">
                        Event Décor Rentals · GTA
                    </p>

                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white max-w-2xl leading-tight drop-shadow">
                        {currentSlide.heading}
                    </h1>

                    <p className="mt-4 text-base sm:text-lg text-gray-200 max-w-xl">
                        {currentSlide.text}
                    </p>

                    <div className="mt-6 flex flex-col sm:flex-row gap-3">
                        <Link
                            href="/catalog"
                            className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-amber-400 text-gray-900 font-semibold shadow-lg hover:bg-amber-300 transition"
                        >
                            Browse Catalog
                        </Link>
                        <a
                            href="#featured"
                            className="inline-flex items-center justify-center px-6 py-3 rounded-full border border-white/40 text-white font-medium hover:bg-white/10 transition"
                        >
                            View Featured Items
                        </a>
                    </div>
                </div>

                {/* Slide controls */}
                <button
                    type="button"
                    onClick={goPrev}
                    className="absolute left-4 top-1/2 -translate-y-1/2 z-20 rounded-full bg-black/40 text-white w-9 h-9 flex items-center justify-center hover:bg-black/60"
                >
                    ‹
                </button>
                <button
                    type="button"
                    onClick={goNext}
                    className="absolute right-4 top-1/2 -translate-y-1/2 z-20 rounded-full bg-black/40 text-white w-9 h-9 flex items-center justify-center hover:bg-black/60"
                >
                    ›
                </button>

                {/* Dots */}
                <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2 z-20">
                    {slides.map((_, idx) => (
                        <button
                            key={idx}
                            type="button"
                            onClick={() => setCurrentIndex(idx)}
                            className={`h-2 w-2 rounded-full border border-white ${
                                idx === currentIndex ? "bg-amber-400" : "bg-white/20"
                            }`}
                        />
                    ))}
                </div>
            </section>

            {/* FEATURED ITEMS */}
            <section
                id="featured"
                className="bg-slate-950 text-slate-50 border-t border-slate-800"
            >
                <div className="max-w-6xl mx-auto px-4 py-14 space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div>
                            <h2 className="text-2xl font-bold text-white">
                                Featured Décor Pieces
                            </h2>
                            <p className="text-sm text-slate-300 mt-1">
                                A glimpse of what you can rent for your next event.
                            </p>
                        </div>
                        {hasItems && (
                            <Link
                                href="/catalog"
                                className="text-sm text-amber-300 hover:text-amber-200"
                            >
                                View full catalog →
                            </Link>
                        )}
                    </div>

                    {!hasItems && (
                        <p className="text-slate-400 text-sm">
                            No items added yet. Once you create items in the admin panel,
                            they will appear here as featured décor.
                        </p>
                    )}

                    <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {items.slice(0, 8).map((item) => (
                            <div
                                key={item.id}
                                className="bg-slate-900/70 border border-slate-800 rounded-xl p-4 hover:border-amber-300/60 hover:shadow-lg hover:shadow-amber-500/10 transition flex flex-col justify-between"
                            >
                                <div>
                                    <h3 className="text-base font-semibold text-white">
                                        {item.name}
                                    </h3>
                                    <p className="mt-2 text-xs text-slate-300 line-clamp-3">
                                        {item.description ||
                                            "Beautiful décor piece to style your stage or hall."}
                                    </p>
                                </div>

                                <div className="mt-4 flex items-center justify-between text-xs">
                                    <span className="font-semibold text-amber-300">
                                        ${Number(item.price_per_day || 0).toFixed(2)}/day
                                    </span>
                                    <Link
                                        href="/catalog"
                                        className="text-amber-200 hover:text-amber-100"
                                    >
                                        View details
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* WHY CHOOSE US */}
            <section className="bg-slate-950 border-t border-slate-800">
                <div className="max-w-6xl mx-auto px-4 py-12 grid sm:grid-cols-3 gap-8 text-center text-slate-200">
                    <div>
                        <h3 className="font-semibold text-white mb-2">
                            Curated Luxury Décor
                        </h3>
                        <p className="text-sm text-slate-400">
                            Handpicked pieces that photograph beautifully and give a premium look
                            to your event.
                        </p>
                    </div>
                    <div>
                        <h3 className="font-semibold text-white mb-2">
                            Reliable Delivery
                        </h3>
                        <p className="text-sm text-slate-400">
                            Professional delivery, setup (if offered), and pickup so you can relax
                            and enjoy your event.
                        </p>
                    </div>
                    <div>
                        <h3 className="font-semibold text-white mb-2">
                            Flexible Packages
                        </h3>
                        <p className="text-sm text-slate-400">
                            Combine sofas, backdrops, chairs, tables and more into packages that
                            fit your theme and budget.
                        </p>
                    </div>
                </div>
            </section>

            {/* FINAL CTA */}
            <section className="bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500">
                <div className="max-w-6xl mx-auto px-4 py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">
                            Ready to style your next event?
                        </h2>
                        <p className="text-sm text-gray-800 mt-1">
                            Browse the catalog and send us a quote request for your date and venue.
                        </p>
                    </div>
                    <Link
                        href="/catalog"
                        className="inline-flex items-center px-6 py-3 rounded-full bg-gray-900 text-amber-300 font-semibold hover:bg-black"
                    >
                        Explore Catalog
                    </Link>
                </div>
            </section>
        </GuestLayout>
    );
}
