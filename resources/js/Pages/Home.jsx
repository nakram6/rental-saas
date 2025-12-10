// File: resources/js/Pages/Home.jsx
import React, { useEffect, useState } from "react";
import { Head, Link } from "@inertiajs/react";
import GuestLayout from "@/Layouts/GuestLayout";

export default function Home({ tenant, items = [] }) {
    const brandName = tenant?.name || "Event Decor Rentals";
    const title = brandName;

    const slides = [
        {
            image: "/images/hero-sofa.jpg",
            heading: "Luxury Stage Sofas & Seating",
            text: "Create dreamy bridal stages and elegant main seating for your event.",
        },
        {
            image: "/images/hero-backdrop.jpg",
            heading: "Floral & Fabric Backdrops",
            text: "Transform simple halls into photo-ready spaces with modern backdrops.",
        },
        {
            image: "/images/hero-centerpieces.jpg",
            heading: "Table Décor & Centerpieces",
            text: "Finish your tables with centrepieces and details that look amazing in photos.",
        },
    ];


    const eventImages = [
    "/images/events/event1.jpg",
    "/images/events/event2.jpg",
    "/images/events/event3.jpg",
];


// Images used in the Instagram-style grid
    const igImages = [
        "/images/events/event1.jpg",
        "/images/events/event2.jpg",
        "/images/events/event3.jpg",
        "/images/hero-sofa.jpg",
        "/images/hero-backdrop.jpg",
        "/images/hero-centerpieces.jpg",
    ];


        const [openFaqIndex, setOpenFaqIndex] = useState(0);

    const faqs = [
        {
            category: "Services",
            question: "What types of events do you specialize in?",
            answer:
                "We work on weddings, cultural ceremonies, showers, birthdays, corporate events and intimate home celebrations. Each event is styled to match your venue, culture and personal taste.",
        },
        {
            category: "Pricing",
            question: "How much do wedding decorators typically cost?",
            answer:
                "Pricing depends on your venue, guest count, décor elements and setup complexity. Share your date, venue and vision and we’ll create a tailored quote with clear options.",
        },
        {
            category: "Logistics",
            question: "Can you help with both indoor and outdoor setups?",
            answer:
                "Yes. We design for halls, hotels, community centres, homes and outdoor venues. We adjust décor, florals and candles to work safely with weather, space and venue rules.",
        },
        {
            category: "Booking",
            question: "How far in advance should I book?",
            answer:
                "Prime weekends book quickly. We recommend reaching out 6–12 months in advance, but we also take on shorter-notice events when our calendar allows.",
        },
    ];





    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(
            () => setCurrentIndex((prev) => (prev + 1) % slides.length),
            6000
        );
        return () => clearInterval(interval);
    }, [slides.length]);

    const goPrev = () =>
        setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
    const goNext = () =>
        setCurrentIndex((prev) => (prev + 1) % slides.length);

    const currentSlide = slides[currentIndex];
    const hasItems = items.length > 0;

    return (
        <GuestLayout tenant={tenant}>
            <Head title={title} />

            {/* HERO SLIDESHOW */}
            <section className="relative h-[520px] sm:h-[620px] lg:h-[700px] overflow-hidden bg-slate-950">
                <div
                    className="absolute inset-0 bg-cover bg-center transition-all duration-700"
                    style={{ backgroundImage: `url(${currentSlide.image})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/20" />

                <div className="relative z-10 h-full max-w-6xl mx-auto px-4 flex flex-col justify-center">
                    <p className="fade-in-up text-sm uppercase tracking-[0.25em] text-amber-300 mb-4">
                        Event Décor Rentals · GTA & Windsor
                    </p>

                    <h1 className="fade-in-up delay-1 text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white max-w-2xl leading-tight drop-shadow">
                        {currentSlide.heading}
                    </h1>

                    <p className="fade-in-up delay-2 mt-4 text-base sm:text-lg text-gray-200 max-w-xl">
                        {currentSlide.text}
                    </p>

                    <div className="fade-in-up delay-3 mt-6 flex flex-col sm:flex-row gap-3">
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

            {/* OVERLAPPING HIGHLIGHT STRIP */}
            <section className="relative -mt-10 z-20">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="fade-in-up bg-slate-900/90 border border-slate-800 rounded-2xl shadow-xl shadow-black/40 px-5 py-4 flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
                        <div>
                            <h2 className="text-sm font-semibold text-slate-50">
                                Modern décor styling for weddings, showers & celebrations
                            </h2>
                            <p className="text-xs text-slate-400 mt-1">
                                From first moodboard to the final candle, we design spaces
                                that feel warm in person and look beautiful on camera.
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-3 text-[11px] text-slate-300">
                            <span className="px-3 py-1 rounded-full border border-amber-400/50 bg-amber-500/10">
                                Bridal stages & receptions
                            </span>
                            <span className="px-3 py-1 rounded-full border border-slate-600 bg-slate-800/80">
                                Engagements & cultural ceremonies
                            </span>
                            <span className="px-3 py-1 rounded-full border border-slate-600 bg-slate-800/80">
                                Showers & milestone parties
                            </span>
                        </div>
                    </div>
                </div>
            </section>

            {/* WHY US */}
            <section className="bg-slate-950 border-t border-slate-900 mt-10">
                <div className="max-w-6xl mx-auto px-4 py-14 space-y-8">
                    <div className="fade-in-up text-center max-w-2xl mx-auto">
                        <p className="text-xs uppercase tracking-[0.3em] text-amber-300">
                            Why Us?
                        </p>
                        <h2 className="mt-2 text-2xl sm:text-3xl font-bold text-white">
                            Where every event tells a story
                        </h2>
                        <p className="mt-3 text-sm text-slate-300">
                            At {brandName}, we turn your celebrations into heartfelt
                            experiences with personalized event design that reflects your
                            unique story. Whether you&apos;re planning a luxury wedding,
                            cultural ceremony or milestone celebration, we go beyond décor —
                            we create emotion-rich moments that stay with you and your guests.
                        </p>
                        <p className="mt-2 text-sm text-slate-300">
                            As trusted decorators and event stylists, we blend your
                            vision with creative precision to craft spaces that feel
                            meaningful, magical and entirely yours.
                        </p>
                    </div>

                    <div className="grid gap-6 sm:grid-cols-2">
                        <div className="fade-in-up bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
                            <h3 className="text-sm font-semibold text-white">
                                Unmatched quality
                            </h3>
                            <p className="mt-2 text-sm text-slate-300">
                                Commitment to excellence in every project, big or small —
                                from intimate home events to full-scale ballroom weddings.
                            </p>
                        </div>
                        <div className="fade-in-up delay-1 bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
                            <h3 className="text-sm font-semibold text-white">
                                Client-centric approach
                            </h3>
                            <p className="mt-2 text-sm text-slate-300">
                                We take the time to understand your vision, culture and
                                priorities, then build a plan that feels personal and stress-reduced.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* WHO WE ARE */}
            <section className="bg-slate-900 border-t border-slate-800">
                <div className="max-w-6xl mx-auto px-4 py-14 grid gap-10 md:grid-cols-2 items-start">
                    <div className="fade-in-up space-y-3">
                        <p className="text-xs uppercase tracking-[0.3em] text-amber-300">
                            Who We Are
                        </p>
                        <h2 className="text-2xl sm:text-3xl font-bold text-white">
                            Creating beautiful moments. Building lasting trust.
                        </h2>
                        <p className="text-sm text-slate-300">
                            At {brandName}, we&apos;re more than event decorators — we&apos;re
                            creators of unforgettable moments. From elegant event décor and
                            customized rentals to optional catering and professional photography
                            partners, we bring every detail together to make your day feel
                            truly special.
                        </p>
                        <p className="text-sm text-slate-300">
                            Whether it&apos;s a wedding, birthday, corporate event or home
                            staging project, we combine creativity, care and experience to
                            deliver seamless, stylish results.
                        </p>
                        <p className="text-sm text-slate-300">
                            Our team is passionate about turning your vision into a beautiful,
                            stress-reduced experience — one that feels personal, emotional and
                            truly yours.
                        </p>
                    </div>

                    <div className="fade-in-up delay-1 bg-slate-950/70 border border-slate-800 rounded-2xl p-5 space-y-3 text-sm text-slate-300">
                        <h3 className="text-sm font-semibold text-white">
                            What we love working on
                        </h3>
                        <ul className="space-y-1 text-xs">
                            <li>• Luxury wedding stages & receptions</li>
                            <li>• Cultural ceremonies & nikah setups</li>
                            <li>• Showers, birthdays & anniversaries</li>
                            <li>• Corporate events & launch parties</li>
                            <li>• Home staging & styled photo shoots</li>
                        </ul>
                        <Link
                            href="/catalog"
                            className="inline-flex mt-3 text-xs text-amber-300 hover:text-amber-200"
                        >
                            Explore décor collections →
                        </Link>
                    </div>
                </div>
            </section>

            {/* OUR SERVICES – refined */}
            <section className="bg-slate-950 border-t border-slate-900">
                <div className="max-w-6xl mx-auto px-4 py-14 space-y-8">
                    <div className="fade-in-up text-center max-w-2xl mx-auto">
                        <p className="text-xs uppercase tracking-[0.3em] text-amber-300">
                            Our Services
                        </p>
                        <h2 className="mt-2 text-2xl sm:text-3xl font-bold text-white">
                            Complete event planning & décor support
                        </h2>
                        <p className="mt-3 text-sm text-slate-300">
                            From décor, rentals and layouts to optional catering partners and
                            photography, we help you pull every detail together so your
                            celebration feels cohesive and effortless.
                        </p>
                    </div>

                    <div className="grid gap-6 sm:grid-cols-3">
                        <div className="fade-in-up bg-slate-900/80 border border-slate-800 rounded-2xl p-5 flex flex-col gap-3">
                            <h3 className="text-sm font-semibold text-white">
                                Event décor & styling
                            </h3>
                            <p className="text-xs text-slate-300">
                                Ceremony stages, head tables, aisle décor and room styling that
                                match your colours, culture and venue.
                            </p>
                            <ul className="mt-1 space-y-1 text-[11px] text-slate-400">
                                <li>• Custom stage layouts</li>
                                <li>• Draping, florals & candles</li>
                                <li>• Designs for weddings & special events</li>
                            </ul>
                        </div>

                        <div className="fade-in-up delay-1 bg-slate-900/80 border border-slate-800 rounded-2xl p-5 flex flex-col gap-3">
                            <h3 className="text-sm font-semibold text-white">
                                Décor rentals
                            </h3>
                            <p className="text-xs text-slate-300">
                                A curated collection of sofas, backdrops, tables and
                                centrepieces you can mix and match for your event.
                            </p>
                            <ul className="mt-1 space-y-1 text-[11px] text-slate-400">
                                <li>• Lounge seating, panels & arches</li>
                                <li>• Cake tables, plinths & statement pieces</li>
                                <li>• Delivery, setup & pickup options</li>
                            </ul>
                        </div>

                        <div className="fade-in-up delay-2 bg-slate-900/80 border border-slate-800 rounded-2xl p-5 flex flex-col gap-3">
                            <h3 className="text-sm font-semibold text-white">
                                Add-on services
                            </h3>
                            <p className="text-xs text-slate-300">
                                Optional add-ons through trusted partners to complete your
                                experience.
                            </p>
                            <ul className="mt-1 space-y-1 text-[11px] text-slate-400">
                                <li>• Photography & highlight reels</li>
                                <li>• Catering referrals & dessert tables</li>
                                <li>• Home staging & styled shoots</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* RECENT EVENTS / PORTFOLIO PREVIEW */}
<section className="bg-slate-900 border-t border-slate-800">
    <div className="max-w-6xl mx-auto px-4 py-14 space-y-6">
        <div className="fade-in-up text-center max-w-2xl mx-auto">
            <p className="text-xs uppercase tracking-[0.3em] text-amber-300">
                Extremely Impressive
            </p>
            <h2 className="mt-2 text-2xl sm:text-3xl font-bold text-white">
                Recent wedding & event decorations
            </h2>
            <p className="mt-3 text-sm text-slate-300">
                Discover the kind of magic we create for clients across Canada.
                Each event tells a unique story, and we&apos;re honoured to help
                bring these moments to life.
            </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-3">
            {eventImages.map((img, idx) => (
                <div
                    key={idx}
                    className="fade-in-up bg-slate-950/70 border border-slate-800 rounded-2xl overflow-hidden flex flex-col"
                    style={{ animationDelay: `${0.1 * idx}s` }}
                >
                    <div
                        className="h-40 bg-cover bg-center"
                        style={{ backgroundImage: `url(${img})` }}
                    />
                    <div className="p-4 text-xs text-slate-300 space-y-1">
                        <h3 className="text-sm font-semibold text-white">
                            Styled celebration {idx + 1}
                        </h3>
                        <p>
                            Elegant décor with cohesive colours, layered textures
                            and photo-ready details.
                        </p>
                    </div>
                </div>
            ))}
        </div>

        <div className="fade-in-up text-center">
            <Link
                href="/catalog"
                className="inline-flex text-sm text-amber-300 hover:text-amber-200"
            >
                Say yes to the best ideas – explore décor →
            </Link>
        </div>
    </div>
</section>


                       {/* FAQ */}
            <section className="bg-slate-950 border-t border-slate-900">
                <div className="max-w-6xl mx-auto px-4 py-14 grid gap-10 md:grid-cols-[1.1fr,1.4fr] items-start">
                    {/* Left: intro text */}
                    <div className="fade-in-up max-w-md">
                        <p className="text-xs uppercase tracking-[0.3em] text-amber-300">
                            Every question has an answer
                        </p>
                        <h2 className="mt-2 text-2xl sm:text-3xl font-bold text-white">
                            Frequently asked questions
                        </h2>
                        <p className="mt-3 text-sm text-slate-300">
                            Wondering how it all works? Here are answers to some of the most
                            common questions about décor, pricing and booking. If you don&apos;t
                            see your question here, we&apos;re just a message away.
                        </p>

                        <div className="mt-6 text-xs text-slate-400 space-y-1">
                            <p>• Transparent quotes with no hidden fees</p>
                            <p>• Support from first inquiry to final teardown</p>
                            <p>• Décor plans tailored to your venue &amp; culture</p>
                        </div>

                        <div className="mt-6 text-xs text-slate-400">
                            Have more questions?{" "}
                            <a
                                href="mailto:info@harbourdecor.com"
                                className="text-amber-300 hover:text-amber-200"
                            >
                                Contact us and we&apos;ll be happy to answer.
                            </a>
                        </div>
                    </div>

                    {/* Right: accordion */}
                    <div className="space-y-3">
                        {faqs.map((faq, index) => {
                            const isOpen = openFaqIndex === index;

                            return (
                                <div
                                    key={index}
                                    className={`
                                        fade-in-up
                                        rounded-2xl border
                                        ${isOpen ? "border-amber-400/70 bg-slate-900/90" : "border-slate-800 bg-slate-900/70"}
                                        shadow-sm shadow-black/40
                                        transition-colors
                                    `}
                                    style={{ animationDelay: `${0.08 * index}s` }}
                                >
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setOpenFaqIndex(
                                                isOpen ? -1 : index
                                            )
                                        }
                                        className="w-full flex items-center justify-between gap-3 px-4 py-3"
                                    >
                                        <div className="flex flex-col items-start">
                                            <span className="text-[10px] uppercase tracking-[0.2em] text-amber-300">
                                                {faq.category}
                                            </span>
                                            <span className="mt-1 text-sm font-semibold text-white text-left">
                                                {faq.question}
                                            </span>
                                        </div>

                                        {/* Icon */}
                                        <div
                                            className={`
                                                h-7 w-7 rounded-full border
                                                flex items-center justify-center text-xs
                                                ${isOpen ? "bg-amber-400 text-slate-900 border-amber-400" : "bg-slate-900 text-slate-300 border-slate-600"}
                                                transition-transform
                                                ${isOpen ? "rotate-90" : ""}
                                            `}
                                        >
                                            {/* simple chevron-style + icon */}
                                            <span className="font-bold">
                                                &gt;
                                            </span>
                                        </div>
                                    </button>

                                    {/* Answer panel */}
                                    <div
                                        className={`
                                            px-4 pb-4 text-xs text-slate-300
                                            overflow-hidden transition-all duration-300
                                            ${isOpen ? "max-h-40 opacity-100" : "max-h-0 opacity-0"}
                                        `}
                                    >
                                        <p className="pt-1 leading-relaxed">
                                            {faq.answer}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>


            {/* TESTIMONIALS */}
<section className="bg-slate-950 border-t border-slate-900 py-16">
    <div className="max-w-6xl mx-auto px-4">
        {/* Heading */}
        <div className="text-center fade-in-up">
            <p className="text-xs uppercase tracking-[0.3em] text-amber-300">
                Testimonials
            </p>
            <h2 className="mt-2 text-3xl font-bold text-white">
                Our clients say it best
            </h2>
            <p className="mt-3 text-sm text-slate-300 max-w-2xl mx-auto">
                Discover what our clients have to say about their experiences with us.
                We take pride in delivering exceptional service and creating lasting impressions.
            </p>
        </div>

        {/* Cards – mobile slider, desktop grid */}
        <div
            className="
                mt-10
                flex gap-6 overflow-x-auto pb-4 -mx-4 px-4
                snap-x snap-mandatory
                md:grid md:grid-cols-3 md:gap-6 md:overflow-visible md:px-0 md:mx-0 md:snap-none
            "
        >
            {[
                {
                    name: "Sonia Arzoo Abbas",
                    image: "/images/testimonials/falak.jpg",
                    text: "They did an amazing job with our family events. The décor felt elegant, thoughtful and perfectly matched our theme. We’ve booked them multiple times and every event feels special.",
                },
                {
                    name: "Jass Grewal",
                    image: "/images/testimonials/mariam.jpg",
                    text: "Great work! The stage and backdrop were absolutely gorgeous and eye-catching. Most of our guests commented on how beautiful everything looked. The photo booth area was a hit too.",
                },
                {
                    name: "Ibrahim Safdar",
                    image: "/images/testimonials/huriya.jpg",
                    text: "Hired them to decorate my son’s 9th birthday. I was impressed by their timely service, friendly team and creative touches. They made the space look like a magazine shoot.",
                },
            ].map((t, idx) => (
                <div
                    key={idx}
                    className="
                        fade-in-up
                        snap-center
                        min-w-[260px] max-w-xs
                        md:min-w-0 md:max-w-none
                        bg-gradient-to-b from-slate-900/90 via-slate-900/70 to-slate-950
                        border border-slate-800
                        rounded-2xl
                        p-6
                        shadow-lg shadow-black/40
                        hover:border-amber-400/70 hover:shadow-amber-500/20
                        transition
                        flex flex-col
                    "
                    style={{ animationDelay: `${0.1 * idx}s` }}
                >
                    {/* Top row: avatar + stars + quote */}
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                            {/* Avatar with real image */}
                            <div className="h-9 w-9 rounded-full overflow-hidden border-2 border-amber-400/80 shadow-sm">
                                <img
                                    src={t.image}
                                    alt={t.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            {/* Stars */}
                            <div className="flex items-center gap-0.5 text-amber-300 text-xs">
                                {Array(5)
                                    .fill()
                                    .map((_, i) => (
                                        <span key={i}>★</span>
                                    ))}
                            </div>
                        </div>

                       {/* Quote bubble */}
<div
    className="
        h-9 w-9
        rounded-full
        bg-amber-400
        text-gray-900
        flex items-center justify-center
        text-xl font-semibold
        shadow-md shadow-amber-500/40
        quote-pop
    "
    style={{ animationDelay: `${0.1 * idx + 0.15}s` }}
>
    <span className="leading-none -mt-[2px]">“</span>
</div>

                    </div>

                    {/* Text */}
                    <p className="text-sm text-slate-200 leading-relaxed flex-1">
                        {t.text}
                    </p>

                    {/* Name + badge */}
                    <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                        <p className="text-sm font-semibold text-white">
                            {t.name}
                        </p>
                        <span className="text-[10px] uppercase tracking-[0.2em] text-slate-400">
                            Verified client
                        </span>
                    </div>
                </div>
            ))}
        </div>
    </div>
</section>


                       {/* INSTAGRAM / SOCIAL FOLLOW */}
            <section className="bg-slate-950 border-t border-slate-900">
                <div className="max-w-6xl mx-auto px-4 py-12 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="fade-in-up max-w-md">
                        <p className="text-xs uppercase tracking-[0.3em] text-amber-300">
                            Follow our latest work
                        </p>
                        <h2 className="mt-2 text-xl sm:text-2xl font-bold text-white">
                            See transformations, trends and behind-the-scenes
                        </h2>
                        <p className="mt-3 text-sm text-slate-300">
                            Follow our décor journey to see how we blend timeless traditions
                            with modern trends — from first sketch to final candlelight.
                        </p>
                        <p className="mt-3 text-sm text-amber-300">
                            Follow <span className="font-semibold">@harbourdecor</span>{" "}
                            (or your handle) on Instagram &amp; TikTok.
                        </p>
                    </div>

                    <div className="fade-in-up delay-1 grid grid-cols-3 gap-2 w-full md:w-72">
                        {igImages.map((src, idx) => (
                            <div
                                key={idx}
                                className="aspect-square rounded-xl overflow-hidden border border-slate-700 bg-slate-800"
                            >
                                <div
                                    className="w-full h-full bg-cover bg-center"
                                    style={{ backgroundImage: `url(${src})` }}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FINAL CTA */}
            <section className="bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 border-t border-amber-300/60">
                <div className="max-w-6xl mx-auto px-4 py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="fade-in-up">
                        <h2 className="text-2xl font-bold text-gray-900">
                            Ready to start planning?
                        </h2>
                        <p className="text-sm text-gray-800 mt-1">
                            Browse the catalog and send us a quote request for your date,
                            venue and vision.
                        </p>
                    </div>
                    <Link
                        href="/catalog"
                        className="fade-in-up delay-1 inline-flex items-center px-6 py-3 rounded-full bg-gray-900 text-amber-300 font-semibold hover:bg-black"
                    >
                        Explore catalog
                    </Link>
                </div>
            </section>
        </GuestLayout>
    );
}
