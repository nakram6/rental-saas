import React, { useEffect, useMemo, useRef, useState } from "react";
import { Head, Link } from "@inertiajs/react";
import GuestLayout from "@/Layouts/GuestLayout";

/**
 * Home Page (Public)
 * - Adds more modern sections + more placeholder images
 * - Keeps your Virtual Assistant panel as-is
 *
 * NOTE:
 * - Virtual Assistant uses POST /api/assistant
 */

export default function Home({ tenant, items = [] }) {
    const brandName = tenant?.name || "Event Decor Rentals";
    const title = brandName;

    const instagramProfileUrl = "https://www.instagram.com/harbourdecor/";
    const instagramEmbedUrl = "";

    // Hero slides
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

    // Gallery / Events placeholders (reuse images — you will replace later)
    const eventImages = [
        "/images/events/event1.jpg",
        "/images/events/event2.jpg",
        "/images/events/event3.jpg",
        "/images/hero-sofa.jpg",
        "/images/hero-backdrop.jpg",
        "/images/hero-centerpieces.jpg",
    ];

    const igImages = [
        "/images/events/event1.jpg",
        "/images/events/event2.jpg",
        "/images/events/event3.jpg",
        "/images/hero-sofa.jpg",
        "/images/hero-backdrop.jpg",
        "/images/hero-centerpieces.jpg",
        "/images/events/event1.jpg",
        "/images/events/event2.jpg",
        "/images/events/event3.jpg",
    ];

    // FAQ
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

    // Slideshow logic
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
    const goNext = () => setCurrentIndex((prev) => (prev + 1) % slides.length);
    const currentSlide = slides[currentIndex];

    // -----------------------------
    // ✅ Virtual Assistant (RIGHT PANEL)
    // -----------------------------
    const STORAGE_KEY = "public_assistant_history_v1";
    const SESSION_KEY = "public_assistant_session_id_v1";

    const AVAILABILITY_TOOL = "__CHECK_AVAILABILITY__";
    const QUOTE_TOOL = "__CREATE_DRAFT_QUOTE__";

    const [pendingTool, setPendingTool] = useState(null); // "availability" | "quote" | null

    const todayISO = useMemo(() => {
        const d = new Date();
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, "0");
        const dd = String(d.getDate()).padStart(2, "0");
        return `${yyyy}-${mm}-${dd}`;
    }, []);

    const [availabilityForm, setAvailabilityForm] = useState({
        date: "",
        start_time: "",
        end_time: "",
    });

    const [quoteForm, setQuoteForm] = useState({
        event_date: "",
        guest_count: "",
        theme_colors: "",
        budget: "",
        notes: "",
    });

    function parseAvailabilityInput(text) {
        const t = (text || "").trim();
        const dateMatch = t.match(/\b(\d{4}-\d{2}-\d{2})\b/);
        if (!dateMatch) return null;

        const date = dateMatch[1];

        const timeMatch = t.match(
            /\b(\d{1,2}:\d{2})\s*(?:-|–|to)\s*(\d{1,2}:\d{2})\b/i
        );

        if (timeMatch) {
            const start_time = timeMatch[1].padStart(5, "0");
            const end_time = timeMatch[2].padStart(5, "0");
            return { date, start_time, end_time };
        }

        return { date };
    }

    function generateTimes() {
        const times = [];
        for (let h = 6; h <= 23; h++) {
            times.push(`${String(h).padStart(2, "0")}:00`);
            times.push(`${String(h).padStart(2, "0")}:30`);
        }
        return times;
    }

    const [assistantOpen, setAssistantOpen] = useState(false);
    const [assistantLoading, setAssistantLoading] = useState(false);
    const [assistantText, setAssistantText] = useState("");
    const [assistantError, setAssistantError] = useState("");

    const [sessionId, setSessionId] = useState(() => {
        try {
            const raw = localStorage.getItem(SESSION_KEY);
            return raw ? Number(raw) : null;
        } catch {
            return null;
        }
    });

    const [history, setHistory] = useState(() => {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            const parsed = raw ? JSON.parse(raw) : [];
            return Array.isArray(parsed) ? parsed : [];
        } catch {
            return [];
        }
    });

    const messages = useMemo(() => {
        if (!history.length) {
            return [
                {
                    role: "assistant",
                    text:
                        `Hi! I’m your ${brandName} assistant. ` +
                        `Tell me your event date, city, venue, guest count, theme colors, and budget — ` +
                        `and I’ll guide you.`,
                },
            ];
        }
        return history;
    }, [history, brandName]);

    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
        } catch {
            // ignore
        }
    }, [history]);

    const listRef = useRef(null);
    useEffect(() => {
        if (!assistantOpen) return;
        const t = setTimeout(() => {
            if (listRef.current) {
                listRef.current.scrollTop = listRef.current.scrollHeight;
            }
        }, 50);
        return () => clearTimeout(t);
    }, [assistantOpen, messages.length]);

    const quickActions = [
        { label: "Check availability", tool: "availability" },
        { label: "Get quote", tool: "quote" },
        { label: "Suggest items", text: "Suggest décor items based on my event details." },
        { label: "Packages", text: "Show me 3 décor package ideas: basic, standard, premium." },
    ];

    function clearAssistant() {
        setHistory([]);
        setAssistantError("");
        setSessionId(null);
        setPendingTool(null);
        setAvailabilityForm({ date: "", start_time: "", end_time: "" });
        setQuoteForm({ event_date: "", guest_count: "", theme_colors: "", budget: "", notes: "" });
        try {
            localStorage.removeItem(SESSION_KEY);
        } catch {
            // ignore
        }
    }

    async function postAssistant(payload, attempt = 0) {
        const res = await fetch("/api/assistant", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(payload),
        });

        const json = await res.json().catch(() => ({}));

        if (res.status === 429) {
            if (attempt < 3) {
                const wait = 800 * Math.pow(2, attempt);
                await new Promise((r) => setTimeout(r, wait));
                return postAssistant(payload, attempt + 1);
            }
            return { ok: false, json: { reply: "Too many requests. Please try again in a moment." } };
        }

        return { ok: res.ok, json };
    }

    async function sendTool(toolName, meta = {}, userSummaryText = null) {
        if (assistantLoading) return;

        setAssistantError("");
        setAssistantLoading(true);
        setPendingTool(null);

        const nextHistory = [...history, { role: "user", text: userSummaryText || toolName }];
        setHistory(nextHistory);

        try {
            const { ok, json } = await postAssistant({
                message: toolName,
                history: nextHistory,
                tenantName: brandName,
                sessionId: sessionId,
                meta,
            });

            if (json?.sessionId && json.sessionId !== sessionId) {
                setSessionId(json.sessionId);
                try {
                    localStorage.setItem(SESSION_KEY, String(json.sessionId));
                } catch {
                    // ignore
                }
            }

            const replyText = json?.reply || "Sorry, please try again.";
            setHistory((h) => [...h, { role: "assistant", text: replyText, intent: json?.intent || null, pdf: json?.pdf || null }]);
            if (!ok) setAssistantError(replyText);
        } catch {
            const fallback = "Network error. Please check your connection and try again.";
            setHistory((h) => [...h, { role: "assistant", text: fallback }]);
            setAssistantError(fallback);
        } finally {
            setAssistantLoading(false);
        }
    }

    async function submitAvailabilityForm() {
        if (!availabilityForm.date || assistantLoading) return;

        const meta = {
            date: availabilityForm.date,
            start_time: availabilityForm.start_time || null,
            end_time: availabilityForm.end_time || null,
        };

        const summary =
            meta.start_time && meta.end_time
                ? `Check availability: ${meta.date} ${meta.start_time}-${meta.end_time}`
                : `Check availability: ${meta.date}`;

        await sendTool(AVAILABILITY_TOOL, meta, summary);
        setAvailabilityForm({ date: "", start_time: "", end_time: "" });
    }

    async function submitQuoteForm() {
        if (!quoteForm.event_date || assistantLoading) return;

        const meta = {
            event_date: quoteForm.event_date,
            guest_count: quoteForm.guest_count ? Number(quoteForm.guest_count) : null,
            theme_colors: quoteForm.theme_colors || null,
            budget: quoteForm.budget ? Number(quoteForm.budget) : null,
            notes: quoteForm.notes || null,
        };

        const summary = `Create draft quote: ${meta.event_date}${meta.guest_count ? ` · ${meta.guest_count} guests` : ""}${meta.theme_colors ? ` · ${meta.theme_colors}` : ""}${meta.budget ? ` · $${meta.budget}` : ""}`;

        await sendTool(QUOTE_TOOL, meta, summary);
        setQuoteForm({ event_date: "", guest_count: "", theme_colors: "", budget: "", notes: "" });
    }

    async function sendToAssistant(overrideText) {
        const msg = (overrideText ?? assistantText).trim();
        if (!msg || assistantLoading) return;

        if (pendingTool === "availability") {
            const parsed = parseAvailabilityInput(msg);

            const nextHistory = [...history, { role: "user", text: msg }];
            setHistory(nextHistory);
            setAssistantText("");

            if (!parsed) {
                setHistory((h) => [
                    ...h,
                    {
                        role: "assistant",
                        text: "Please use format: `YYYY-MM-DD` or `YYYY-MM-DD 18:00-23:00` — or use the date picker above.",
                    },
                ]);
                return;
            }

            setPendingTool(null);
            setAssistantError("");
            setAssistantLoading(true);

            try {
                const { ok, json } = await postAssistant({
                    message: AVAILABILITY_TOOL,
                    history: nextHistory,
                    tenantName: brandName,
                    sessionId: sessionId,
                    meta: parsed,
                });

                if (json?.sessionId && json.sessionId !== sessionId) {
                    setSessionId(json.sessionId);
                    try {
                        localStorage.setItem(SESSION_KEY, String(json.sessionId));
                    } catch {
                        // ignore
                    }
                }

                const replyText = json?.reply || "Sorry, please try again.";
                setHistory((h) => [
                    ...h,
                    {
                        role: "assistant",
                        text: replyText,
                        intent: json?.intent || null,
                        pdf: json?.pdf || null,
                    },
                ]);

                if (!ok) setAssistantError(replyText);
            } catch {
                const fallback = "Network error. Please check your connection and try again.";
                setHistory((h) => [...h, { role: "assistant", text: fallback }]);
                setAssistantError(fallback);
            } finally {
                setAssistantLoading(false);
            }

            return;
        }

        setAssistantError("");
        setAssistantLoading(true);

        const nextHistory = [...history, { role: "user", text: msg }];
        setHistory(nextHistory);
        setAssistantText("");

        try {
            const { ok, json } = await postAssistant({
                message: msg,
                history: nextHistory,
                tenantName: brandName,
                sessionId: sessionId,
            });

            if (json?.sessionId && json.sessionId !== sessionId) {
                setSessionId(json.sessionId);
                try {
                    localStorage.setItem(SESSION_KEY, String(json.sessionId));
                } catch {
                    // ignore
                }
            }

            const reply = json?.reply || "Okay!";
            setHistory((h) => [...h, { role: "assistant", text: reply }]);
            if (!ok) setAssistantError(reply);
        } catch {
            const fallback = "Network error. Please check your connection and try again.";
            setHistory((h) => [...h, { role: "assistant", text: fallback }]);
            setAssistantError(fallback);
        } finally {
            setAssistantLoading(false);
        }
    }

    function runQuickAction(action) {
        setAssistantOpen(true);

        if (action.tool === "availability") {
            setPendingTool("availability");
            setAvailabilityForm({ date: "", start_time: "", end_time: "" });

            setTimeout(() => {
                setHistory((h) => [
                    ...h,
                    { role: "assistant", text: "Please select your event date and time below." },
                ]);
            }, 50);
            return;
        }

        if (action.tool === "quote") {
            setPendingTool("quote");
            setQuoteForm((f) => ({ ...f, event_date: f.event_date || "" }));

            setTimeout(() => {
                setHistory((h) => [
                    ...h,
                    { role: "assistant", text: "Great — fill in the quote details below (at least the event date)." },
                ]);
            }, 50);
            return;
        }

        setTimeout(() => sendToAssistant(action.text), 50);
    }

    // -----------------------------
    // Featured items (from props)
    // -----------------------------
    const featured = useMemo(() => {
        const list = Array.isArray(items) ? items : [];
        return list.slice(0, 6);
    }, [items]);

    const services = [
        {
            title: "Full Wedding Styling",
            text: "Stage, aisle, tables, and entry moments — designed as one cohesive look.",
            icon: "💍",
        },
        {
            title: "Backdrop + Florals",
            text: "Modern backdrops with florals, draping, and lighting for photo-ready spaces.",
            icon: "🌸",
        },
        {
            title: "Table Décor",
            text: "Centerpieces, candles, runners, charger plates — curated for your theme.",
            icon: "🕯️",
        },
        {
            title: "Setup + Teardown",
            text: "Professional delivery, setup, and teardown — aligned with venue rules and timelines.",
            icon: "🚚",
        },
    ];

    const steps = [
        {
            title: "Share your date + venue",
            text: "Use the assistant to check availability and tell us your event details.",
        },
        {
            title: "Get a draft quote",
            text: "We generate a clear PDF quote you can review and adjust.",
        },
        {
            title: "Finalize your look",
            text: "Choose items, colors, and packages — we confirm logistics and styling.",
        },
        {
            title: "We set everything up",
            text: "We handle delivery, setup, and teardown so you can enjoy your day.",
        },
    ];

    const testimonials = [
        {
            name: "Ayesha",
            text: "The stage setup was stunning — everyone kept taking photos. Super professional team.",
        },
        {
            name: "Ravi",
            text: "They matched our theme perfectly and made the venue look luxurious. Highly recommend!",
        },
        {
            name: "Sana",
            text: "Smooth process from quote to setup. Beautiful details and on-time delivery.",
        },
    ];

    return (
        <GuestLayout tenant={tenant}>
            <Head title={title} />

            {/* ✅ Floating assistant launcher */}
            <button
                type="button"
                onClick={() => setAssistantOpen(true)}
                className="fixed right-4 bottom-6 z-[60] flex items-center gap-2 rounded-full bg-amber-400 text-slate-950 px-4 py-3 shadow-xl shadow-black/40 hover:bg-amber-300 transition"
                aria-label="Open assistant"
            >
                <span className="text-lg">💬</span>
                <span className="text-sm font-semibold">Assistant</span>
            </button>

            {/* ✅ Assistant slide panel */}
            <div
                className={`fixed right-0 top-0 h-full z-[70] transition-transform duration-300 ${
                    assistantOpen ? "translate-x-0" : "translate-x-full"
                }`}
                style={{ width: "360px", maxWidth: "92vw" }}
            >
                {/* Overlay */}
                <div
                    className={`fixed inset-0 bg-black/50 transition-opacity duration-300 ${
                        assistantOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                    }`}
                    onClick={() => setAssistantOpen(false)}
                />

                {/* Panel */}
                <div className="relative h-full bg-slate-950 border-l border-slate-800 shadow-2xl shadow-black/60 flex flex-col">
                    {/* Header */}
                    <div className="px-4 py-4 border-b border-slate-800 flex items-center justify-between">
                        <div>
                            <p className="text-[10px] uppercase tracking-[0.25em] text-amber-300">Virtual Assistant</p>
                            <h3 className="text-sm font-semibold text-white">{brandName}</h3>
                            {sessionId ? (
                                <p className="text-[11px] text-slate-400 mt-1">
                                    Session: <span className="text-slate-200">{sessionId}</span>
                                </p>
                            ) : null}
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={clearAssistant}
                                className="text-xs px-3 py-1 rounded-full border border-slate-700 text-slate-200 hover:bg-slate-900"
                            >
                                Clear
                            </button>
                            <button
                                type="button"
                                onClick={() => setAssistantOpen(false)}
                                className="text-xs px-3 py-1 rounded-full bg-slate-900 border border-slate-700 text-slate-200 hover:bg-slate-800"
                            >
                                ✕
                            </button>
                        </div>
                    </div>

                    {/* Messages */}
                    <div ref={listRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
                        {messages.map((m, idx) => {
                            const isUser = m.role === "user";
                            const isLast = idx === messages.length - 1;

                            return (
                                <div key={idx} className="space-y-2">
                                    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
                                        <div
                                            className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-relaxed border ${
                                                isUser
                                                    ? "bg-amber-400 text-slate-950 border-amber-300"
                                                    : "bg-slate-900 text-slate-100 border-slate-800"
                                            }`}
                                        >
                                            <div>{m.text}</div>

                                            {/* ✅ Quote PDF button */}
                                            {m.intent === "quote_created" && m.pdf && (
                                                <a
                                                    href={m.pdf}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="mt-2 inline-flex items-center gap-2 text-xs px-3 py-1.5 rounded-full bg-amber-400 text-slate-900 font-semibold hover:bg-amber-300 transition"
                                                >
                                                    📄 Open Quote PDF
                                                </a>
                                            )}
                                        </div>
                                    </div>

                                    {/* ✅ Inline Availability Picker */}
                                    {pendingTool === "availability" && isLast && m.role === "assistant" && (
                                        <div className="bg-slate-900 border border-slate-700 rounded-xl p-3 space-y-2 text-xs">
                                            <label className="block text-slate-300">
                                                Event date
                                                <input
                                                    type="date"
                                                    min={todayISO}
                                                    value={availabilityForm.date}
                                                    onChange={(e) =>
                                                        setAvailabilityForm((f) => ({
                                                            ...f,
                                                            date: e.target.value,
                                                        }))
                                                    }
                                                    className="mt-1 w-full rounded-lg bg-slate-800 border border-slate-600 px-2 py-1 text-slate-100"
                                                />
                                            </label>

                                            <div className="flex gap-2">
                                                <label className="flex-1 text-slate-300">
                                                    Start time
                                                    <select
                                                        value={availabilityForm.start_time}
                                                        onChange={(e) =>
                                                            setAvailabilityForm((f) => ({
                                                                ...f,
                                                                start_time: e.target.value,
                                                            }))
                                                        }
                                                        className="mt-1 w-full rounded-lg bg-slate-800 border border-slate-600 px-2 py-1 text-slate-100"
                                                    >
                                                        <option value="">Any</option>
                                                        {generateTimes().map((t) => (
                                                            <option key={t} value={t}>
                                                                {t}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </label>

                                                <label className="flex-1 text-slate-300">
                                                    End time
                                                    <select
                                                        value={availabilityForm.end_time}
                                                        onChange={(e) =>
                                                            setAvailabilityForm((f) => ({
                                                                ...f,
                                                                end_time: e.target.value,
                                                            }))
                                                        }
                                                        className="mt-1 w-full rounded-lg bg-slate-800 border border-slate-600 px-2 py-1 text-slate-100"
                                                    >
                                                        <option value="">Any</option>
                                                        {generateTimes().map((t) => (
                                                            <option key={t} value={t}>
                                                                {t}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </label>
                                            </div>

                                            <button
                                                type="button"
                                                onClick={submitAvailabilityForm}
                                                disabled={!availabilityForm.date || assistantLoading}
                                                className="w-full mt-2 rounded-lg bg-amber-400 text-slate-900 py-1.5 font-semibold disabled:opacity-50"
                                            >
                                                Check availability
                                            </button>

                                            <div className="text-[11px] text-slate-400">
                                                Tip: pick only a date if you’re flexible — choose time if you want a specific slot.
                                            </div>
                                        </div>
                                    )}

                                    {/* ✅ Inline Quote Builder */}
                                    {pendingTool === "quote" && isLast && m.role === "assistant" && (
                                        <div className="bg-slate-900 border border-slate-700 rounded-xl p-3 space-y-2 text-xs">
                                            <label className="block text-slate-300">
                                                Event date <span className="text-rose-300">*</span>
                                                <input
                                                    type="date"
                                                    min={todayISO}
                                                    value={quoteForm.event_date}
                                                    onChange={(e) =>
                                                        setQuoteForm((f) => ({
                                                            ...f,
                                                            event_date: e.target.value,
                                                        }))
                                                    }
                                                    className="mt-1 w-full rounded-lg bg-slate-800 border border-slate-600 px-2 py-1 text-slate-100"
                                                />
                                            </label>

                                            <div className="flex gap-2">
                                                <label className="flex-1 text-slate-300">
                                                    Guest count
                                                    <input
                                                        type="number"
                                                        min="1"
                                                        max="5000"
                                                        value={quoteForm.guest_count}
                                                        onChange={(e) =>
                                                            setQuoteForm((f) => ({
                                                                ...f,
                                                                guest_count: e.target.value,
                                                            }))
                                                        }
                                                        className="mt-1 w-full rounded-lg bg-slate-800 border border-slate-600 px-2 py-1 text-slate-100"
                                                        placeholder="e.g. 200"
                                                    />
                                                </label>

                                                <label className="flex-1 text-slate-300">
                                                    Budget (CAD)
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        step="1"
                                                        value={quoteForm.budget}
                                                        onChange={(e) =>
                                                            setQuoteForm((f) => ({
                                                                ...f,
                                                                budget: e.target.value,
                                                            }))
                                                        }
                                                        className="mt-1 w-full rounded-lg bg-slate-800 border border-slate-600 px-2 py-1 text-slate-100"
                                                        placeholder="e.g. 2500"
                                                    />
                                                </label>
                                            </div>

                                            <label className="block text-slate-300">
                                                Theme colors
                                                <input
                                                    type="text"
                                                    value={quoteForm.theme_colors}
                                                    onChange={(e) =>
                                                        setQuoteForm((f) => ({
                                                            ...f,
                                                            theme_colors: e.target.value,
                                                        }))
                                                    }
                                                    className="mt-1 w-full rounded-lg bg-slate-800 border border-slate-600 px-2 py-1 text-slate-100"
                                                    placeholder="e.g. White & Gold"
                                                />
                                            </label>

                                            <label className="block text-slate-300">
                                                Notes (optional)
                                                <textarea
                                                    rows={2}
                                                    value={quoteForm.notes}
                                                    onChange={(e) =>
                                                        setQuoteForm((f) => ({
                                                            ...f,
                                                            notes: e.target.value,
                                                        }))
                                                    }
                                                    className="mt-1 w-full rounded-lg bg-slate-800 border border-slate-600 px-2 py-1 text-slate-100"
                                                    placeholder="Anything important about venue/setup?"
                                                />
                                            </label>

                                            <button
                                                type="button"
                                                onClick={submitQuoteForm}
                                                disabled={!quoteForm.event_date || assistantLoading}
                                                className="w-full mt-2 rounded-lg bg-amber-400 text-slate-900 py-1.5 font-semibold disabled:opacity-50"
                                            >
                                                Create draft quote (PDF)
                                            </button>

                                            <div className="text-[11px] text-slate-400">You’ll get a PDF link instantly. We can refine items afterward.</div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}

                        {/* ✅ Typing dots */}
                        {assistantLoading && (
                            <div className="flex justify-start">
                                <div className="max-w-[85%] rounded-2xl px-3 py-2 text-sm border bg-slate-900 text-slate-100 border-slate-800">
                                    <span className="inline-flex items-center gap-1">
                                        <span className="h-1.5 w-1.5 rounded-full bg-slate-300 animate-bounce [animation-delay:-0.2s]" />
                                        <span className="h-1.5 w-1.5 rounded-full bg-slate-300 animate-bounce [animation-delay:-0.1s]" />
                                        <span className="h-1.5 w-1.5 rounded-full bg-slate-300 animate-bounce" />
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Footer input */}
                    <div className="p-4 border-t border-slate-800">
                        {/* ✅ Quick actions */}
                        <div className="mb-3 flex flex-wrap gap-2">
                            {quickActions.map((a) => (
                                <button
                                    key={a.label}
                                    type="button"
                                    onClick={() => runQuickAction(a)}
                                    className="text-xs px-3 py-1 rounded-full border border-slate-700 text-slate-200 hover:bg-slate-900"
                                >
                                    {a.label}
                                </button>
                            ))}
                        </div>

                        {assistantError ? <div className="mb-2 text-xs text-rose-300">{assistantError}</div> : null}

                        <div className="flex gap-2">
                            <input
                                value={assistantText}
                                onChange={(e) => setAssistantText(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") sendToAssistant();
                                }}
                                placeholder={
                                    pendingTool === "availability"
                                        ? "Optional: type date (YYYY-MM-DD) or date + time range…"
                                        : "Type your message…"
                                }
                                className="flex-1 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 px-3 py-2 text-sm outline-none focus:border-amber-400"
                            />
                            <button
                                type="button"
                                onClick={() => sendToAssistant()}
                                disabled={assistantLoading}
                                className="rounded-xl bg-amber-400 text-slate-950 px-4 py-2 text-sm font-semibold hover:bg-amber-300 disabled:opacity-60"
                            >
                                Send
                            </button>
                        </div>

                        <div className="mt-2 text-[11px] text-slate-400">
                            Tip: share <span className="text-slate-200">date</span>, <span className="text-slate-200">city</span>,{" "}
                            <span className="text-slate-200">venue</span>, <span className="text-slate-200">guests</span>,{" "}
                            <span className="text-slate-200">colors</span>, <span className="text-slate-200">budget</span>.
                        </div>
                    </div>
                </div>
            </div>

            {/* HERO SLIDESHOW */}
            <section className="relative h-[520px] sm:h-[640px] lg:h-[740px] overflow-hidden bg-slate-950 rounded-3xl">
                <div className="absolute inset-0 bg-cover bg-center transition-all duration-700" style={{ backgroundImage: `url(${currentSlide.image})` }} />
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/55 to-black/10" />

                <div className="relative z-10 h-full max-w-6xl mx-auto px-4 flex flex-col justify-center">
                    <p className="reveal text-sm uppercase tracking-[0.25em] text-amber-300 mb-4">Event Décor Rentals · GTA & Windsor</p>

                    <h1 className="reveal reveal-delay-1 text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white max-w-2xl leading-tight drop-shadow">{currentSlide.heading}</h1>

                    <p className="reveal reveal-delay-2 mt-4 text-base sm:text-lg text-gray-200 max-w-xl">{currentSlide.text}</p>

                    <div className="reveal reveal-delay-3 mt-6 flex flex-col sm:flex-row gap-3">
                        <Link href="/catalog" className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-amber-400 text-gray-900 font-semibold shadow-lg hover:bg-amber-300 transition">
                            Browse Catalog
                        </Link>
                        <Link href="/shop" className="inline-flex items-center justify-center px-6 py-3 rounded-full border border-white/40 text-white font-medium hover:bg-white/10 transition">
                            Shop Items
                        </Link>
                    </div>

                    <div className="reveal reveal-delay-4 mt-8 flex flex-wrap gap-2 text-[11px] text-slate-200/90">
                        <span className="px-3 py-1 rounded-full border border-amber-400/60 bg-amber-500/10">Fast quote PDF</span>
                        <span className="px-3 py-1 rounded-full border border-white/20 bg-white/10">Setup + teardown</span>
                        <span className="px-3 py-1 rounded-full border border-white/20 bg-white/10">Modern + cultural styling</span>
                    </div>
                </div>

                <button type="button" onClick={goPrev} className="absolute left-4 top-1/2 -translate-y-1/2 z-20 rounded-full bg-black/40 text-white w-9 h-9 flex items-center justify-center hover:bg-black/60">‹</button>
                <button type="button" onClick={goNext} className="absolute right-4 top-1/2 -translate-y-1/2 z-20 rounded-full bg-black/40 text-white w-9 h-9 flex items-center justify-center hover:bg-black/60">›</button>

                <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2 z-20">
                    {slides.map((_, idx) => (
                        <button
                            key={idx}
                            type="button"
                            onClick={() => setCurrentIndex(idx)}
                            className={`h-2 w-2 rounded-full border border-white ${idx === currentIndex ? "bg-amber-400" : "bg-white/20"}`}
                        />
                    ))}
                </div>
            </section>

            {/* WHY US? (matches your inspiration) */}
            <section className="mt-12 rounded-3xl bg-[#f6f2e6] border border-black/10 overflow-hidden">
                <div className="max-w-6xl mx-auto px-6 sm:px-10 py-12 grid gap-10 lg:grid-cols-2 items-center">
                    <div>
                        <p className="reveal text-xs uppercase tracking-[0.35em] text-amber-700">WHY US?</p>
                        <h2 className="reveal reveal-delay-1 mt-3 text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-950">
                            Where Every Event Tells a Story
                        </h2>
                        <p className="reveal reveal-delay-2 mt-5 text-base text-slate-700 leading-relaxed max-w-xl">
                            At {brandName}, we turn your celebrations into heartfelt experiences with personalized event design that reflects your unique story.
                            Whether you’re planning a luxury wedding, cultural ceremony, or milestone celebration, we create emotion-rich moments that stay with you.
                        </p>

                        <div className="reveal reveal-delay-3 mt-8 border-t border-black/15 pt-7 grid gap-5">
                            <div className="flex gap-4">
                                <div className="h-11 w-11 rounded-2xl bg-black/5 grid place-items-center text-xl">🏅</div>
                                <div>
                                    <div className="font-semibold text-slate-950">Unmatched Quality</div>
                                    <div className="text-sm text-slate-700">Commitment to excellence in every project, big or small.</div>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="h-11 w-11 rounded-2xl bg-black/5 grid place-items-center text-xl">🤝</div>
                                <div>
                                    <div className="font-semibold text-slate-950">Client-Centric Approach</div>
                                    <div className="text-sm text-slate-700">Dedicated to understanding and fulfilling your unique needs.</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="relative">
                        <div className="reveal relative rounded-3xl overflow-hidden shadow-[0_30px_80px_-40px_rgba(0,0,0,0.6)] border border-black/10">
                            <div className="h-[420px] sm:h-[460px] bg-cover bg-center" style={{ backgroundImage: `url(${eventImages[0]})` }} />
                        </div>

                        {/* collage cards */}
                        {[eventImages[1], eventImages[2], eventImages[3], eventImages[4]].map((src, i) => (
                            <div
                                key={i}
                                className={`reveal reveal-delay-${(i % 4) + 1} absolute rounded-2xl overflow-hidden border border-black/10 bg-white shadow-lg hover-lift`}
                                style={
                                    i === 0
                                        ? { top: "14%", left: "-6%", width: 160, height: 160 }
                                        : i === 1
                                        ? { top: "6%", right: "-6%", width: 160, height: 120 }
                                        : i === 2
                                        ? { bottom: "10%", left: "6%", width: 180, height: 130 }
                                        : { bottom: "6%", right: "-6%", width: 180, height: 130 }
                                }
                            >
                                <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${src})` }} />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* WHO WE ARE (matches your inspiration: image left, text right, dark) */}
            <section className="mt-12 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800">
                <div className="grid lg:grid-cols-2">
                    <div className="min-h-[320px] lg:min-h-[520px] bg-cover bg-center" style={{ backgroundImage: `url(${eventImages[5]})` }} />
                    <div className="bg-slate-950 text-white p-8 sm:p-12 flex flex-col justify-center">
                        <p className="reveal text-xs uppercase tracking-[0.35em] text-amber-300">WHO WE ARE</p>
                        <h2 className="reveal reveal-delay-1 mt-4 text-4xl sm:text-5xl font-extrabold leading-tight">
                            Creating Beautiful Moments.<br />Building Lasting Trust.
                        </h2>
                        <p className="reveal reveal-delay-2 mt-6 text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl">
                            At {brandName}, we’re more than event decorators — we’re creators of unforgettable moments. From elegant décor and customized rentals
                            to seamless coordination, we bring every detail together to make your day feel truly special.
                        </p>
                        <div className="reveal reveal-delay-3 mt-8 flex gap-3">
                            <Link href="/catalog" className="px-6 py-3 rounded-2xl border border-amber-300/70 text-amber-200 font-semibold hover:bg-white/10 transition">Read More →</Link>
                            <button type="button" onClick={() => setAssistantOpen(true)} className="px-6 py-3 rounded-2xl bg-amber-400 text-slate-950 font-semibold hover:bg-amber-300 transition">Chat now</button>
                        </div>
                    </div>
                </div>
            </section>

            {/* OUR SERVICES (4 tall cards like your screenshot) */}
            <section className="mt-12 rounded-3xl bg-[#f6f2e6] border border-black/10">
                <div className="max-w-6xl mx-auto px-6 sm:px-10 py-12">
                    <div className="grid lg:grid-cols-2 gap-10 items-start">
                        <div>
                            <p className="reveal text-xs uppercase tracking-[0.35em] text-amber-700">OUR SERVICES</p>
                            <h2 className="reveal reveal-delay-1 mt-3 text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-950">
                                Complete Event Planning & Decoration Services Across Canada
                            </h2>
                        </div>
                        <div className="reveal reveal-delay-2 text-slate-700 leading-relaxed">
                            From event décor, rentals, and styling to add-on services like photography partners and catering recommendations,
                            we provide tailored solutions that bring your vision to life — making your experience seamless and unforgettable.
                        </div>
                    </div>

                    <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                        {[
                            { title: "Event Decor", img: eventImages[1] },
                            { title: "Event Photography", img: eventImages[2] },
                            { title: "Event Catering", img: eventImages[3] },
                            { title: "Event Rental", img: eventImages[4] },
                        ].map((c, i) => (
                            <div
                                key={c.title}
                                className={`reveal reveal-delay-${(i % 4) + 1} group relative rounded-2xl overflow-hidden border border-black/10 bg-white hover-lift`}
                            >
                                <div className="h-[360px] bg-cover bg-center" style={{ backgroundImage: `url(${c.img})` }} />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-90" />
                                <div className="absolute inset-x-0 bottom-0 p-5">
                                    <div className="text-2xl font-semibold text-white drop-shadow">{c.title}</div>
                                    <div className="mt-3">
                                        <Link href="/catalog" className="inline-flex items-center text-sm font-semibold text-amber-200 hover:text-amber-100">
                                            Learn more →
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* EXTREMELY IMPRESSIVE (mosaic like your screenshot) */}
            <section className="mt-12 rounded-3xl bg-[#f6f2e6] border border-black/10 overflow-hidden">
                <div className="max-w-6xl mx-auto px-6 sm:px-10 py-12">
                    <p className="reveal text-xs uppercase tracking-[0.35em] text-amber-700">EXTREMELY IMPRESSIVE</p>
                    <h2 className="reveal reveal-delay-1 mt-3 text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-950">Recent Wedding & Event Decorations</h2>
                    <p className="reveal reveal-delay-2 mt-4 text-slate-700 leading-relaxed max-w-4xl">
                        Discover the magic we create for clients across Canada. From elegant weddings to milestone celebrations, our portfolio showcases diversity,
                        creativity, and premium styling.
                    </p>

                    <div className="mt-10 grid gap-3 sm:gap-4 grid-cols-2 rounded-3xl overflow-hidden">
                        {eventImages.slice(0, 4).map((src, idx) => (
                            <div key={idx} className={`reveal reveal-delay-${(idx % 4) + 1} relative overflow-hidden ${idx === 0 ? "col-span-2 md:col-span-1" : ""}`}>
                                <div className="h-[240px] sm:h-[280px] md:h-[320px] bg-cover bg-center hover-zoom" style={{ backgroundImage: `url(${src})` }} />
                            </div>
                        ))}
                    </div>

                    <div className="reveal reveal-delay-3 mt-8 flex flex-wrap gap-3">
                        <Link href="/catalog" className="px-6 py-3 rounded-2xl bg-slate-950 text-white font-semibold hover:bg-black transition">Explore catalog</Link>
                        <button type="button" onClick={() => setAssistantOpen(true)} className="px-6 py-3 rounded-2xl bg-amber-400 text-slate-950 font-semibold hover:bg-amber-300 transition">Get a quote</button>
                    </div>
                </div>
            </section>

            {/* FEATURED ITEMS (kept) */}
            <section id="featured" className="mt-12">
                <div className="flex items-center justify-between gap-3 flex-wrap">
                    <div>
                        <p className="reveal text-xs uppercase tracking-[0.3em] text-amber-600 dark:text-amber-300">Featured</p>
                        <h2 className="reveal reveal-delay-1 mt-2 text-2xl sm:text-3xl font-bold">Popular rental pieces</h2>
                        <p className="reveal reveal-delay-2 mt-2 text-sm text-slate-600 dark:text-slate-300">Quick picks clients love. Replace images later — these are placeholders.</p>
                    </div>
                    <Link href="/shop" className="reveal reveal-delay-2 text-sm font-semibold text-amber-600 dark:text-amber-300 hover:opacity-80">View all →</Link>
                </div>

                <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {(featured.length ? featured : new Array(6).fill(null)).map((it, idx) => {
                        const name = it?.name ?? `Featured Item ${idx + 1}`;
                        const category = it?.category ?? "Decor";
                        const price = it?.price != null ? `$${Number(it.price).toFixed(0)}` : "From $—";
                        const image = it?.image_path || eventImages[idx % eventImages.length];
                        const href = it?.id ? `/shop/items/${it.id}` : "/shop";

                        return (
                            <Link
                                key={it?.id ?? idx}
                                href={href}
                                className="group reveal rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/40 shadow-sm hover-lift"
                                style={{ transitionDelay: `${Math.min(idx, 5) * 80}ms` }}
                            >
                                <div className="h-44 bg-cover bg-center hover-zoom" style={{ backgroundImage: `url(${image})` }} />
                                <div className="p-4">
                                    <div className="flex items-start justify-between gap-3">
                                        <div>
                                            <div className="text-xs text-slate-500 dark:text-slate-400">{category}</div>
                                            <div className="mt-1 font-semibold group-hover:underline">{name}</div>
                                        </div>
                                        <div className="text-sm font-semibold">{price}</div>
                                    </div>
                                    <div className="mt-2 text-sm text-slate-600 dark:text-slate-300 line-clamp-2">
                                        {it?.short_description ?? "Elegant piece for stage, seating, or photo corners. Replace description later."}
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </section>

            {/* FAQ (kept) */}
            <section className="mt-12 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/40 p-6 sm:p-8">
                <div className="grid gap-8 md:grid-cols-[1.1fr,1.4fr] items-start">
                    <div className="max-w-md">
                        <p className="reveal text-xs uppercase tracking-[0.3em] text-amber-600 dark:text-amber-300">FAQ</p>
                        <h2 className="reveal reveal-delay-1 mt-2 text-2xl sm:text-3xl font-bold">Frequently asked questions</h2>
                        <p className="reveal reveal-delay-2 mt-3 text-sm text-slate-600 dark:text-slate-300">Quick answers about services, pricing, logistics and booking.</p>
                    </div>

                    <div className="space-y-3">
                        {faqs.map((faq, index) => {
                            const isOpen = openFaqIndex === index;
                            return (
                                <div
                                    key={index}
                                    className={`reveal rounded-2xl border ${
                                        isOpen
                                            ? "border-amber-400/70 bg-amber-500/5"
                                            : "border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-950/30"
                                    } transition-colors`}
                                    style={{ transitionDelay: `${index * 70}ms` }}
                                >
                                    <button
                                        type="button"
                                        onClick={() => setOpenFaqIndex(isOpen ? -1 : index)}
                                        className="w-full flex items-center justify-between gap-3 px-4 py-3"
                                    >
                                        <div className="flex flex-col items-start">
                                            <span className="text-[10px] uppercase tracking-[0.2em] text-amber-600 dark:text-amber-300">{faq.category}</span>
                                            <span className="mt-1 text-sm font-semibold text-left">{faq.question}</span>
                                        </div>
                                        <div
                                            className={`h-7 w-7 rounded-full border flex items-center justify-center text-xs ${
                                                isOpen
                                                    ? "bg-amber-400 text-slate-900 border-amber-400 rotate-90"
                                                    : "bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-300 border-slate-200 dark:border-slate-700"
                                            } transition-transform`}
                                        >
                                            <span className="font-bold">&gt;</span>
                                        </div>
                                    </button>

                                    <div
                                        className={`px-4 pb-4 text-sm text-slate-600 dark:text-slate-300 overflow-hidden transition-all duration-300 ${
                                            isOpen ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
                                        }`}
                                    >
                                        <p className="pt-1 leading-relaxed">{faq.answer}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Instagram (kept) */}
            <section className="mt-12 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/40 p-6 sm:p-8">
                <div className="grid gap-8 md:grid-cols-2 items-start">
                    <div>
                        <p className="reveal text-xs uppercase tracking-[0.3em] text-amber-600 dark:text-amber-300">Instagram</p>
                        <h2 className="reveal reveal-delay-1 mt-2 text-xl sm:text-2xl font-bold">Follow our latest work</h2>
                        <p className="reveal reveal-delay-2 mt-3 text-sm text-slate-600 dark:text-slate-300">See real event transformations, trends, and behind-the-scenes.</p>

                        <a
                            href={instagramProfileUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="reveal reveal-delay-2 inline-flex mt-4 items-center gap-2 text-sm font-semibold text-amber-600 dark:text-amber-300 hover:opacity-80"
                        >
                            Visit Instagram profile →
                        </a>

                        <div className="mt-6 grid grid-cols-3 gap-2 w-full max-w-sm">
                            {igImages.map((src, idx) => (
                                <div key={idx} className="reveal aspect-square rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900" style={{ transitionDelay: `${Math.min(idx, 8) * 60}ms` }}>
                                    <div className="w-full h-full bg-cover bg-center hover-zoom" style={{ backgroundImage: `url(${src})` }} />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <div className="reveal rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                            <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                                <p className="text-sm font-semibold">Embedded post (optional)</p>
                                <span className="text-[11px] text-slate-500 dark:text-slate-400">Paste /p/ID/embed URL</span>
                            </div>

                            {instagramEmbedUrl ? (
                                <iframe
                                    title="Instagram Embed"
                                    src={instagramEmbedUrl}
                                    className="w-full"
                                    style={{ height: 520 }}
                                    frameBorder="0"
                                    scrolling="no"
                                    allow="encrypted-media"
                                />
                            ) : (
                                <div className="p-4 text-sm text-slate-600 dark:text-slate-300">
                                    No embed configured. Set <span className="font-semibold">instagramEmbedUrl</span> to a post embed URL.
                                </div>
                            )}
                        </div>

                        <div className="reveal reveal-delay-1 mt-4 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 bg-amber-500/10">
                            <div className="font-semibold">Want a fast quote?</div>
                            <div className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                                Tell us your <b>date</b>, <b>venue</b>, <b>guest count</b> and <b>colors</b> — we’ll reply with options.
                            </div>
                            <div className="mt-4 flex gap-2">
                                <button
                                    type="button"
                                    onClick={() => setAssistantOpen(true)}
                                    className="px-4 py-2 rounded-xl bg-amber-400 text-slate-950 text-sm font-semibold hover:bg-amber-300"
                                >
                                    Open Assistant
                                </button>
                                <Link href="/quote" className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-sm font-semibold">Quote Page</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FINAL CTA */}
            <section className="mt-12 rounded-3xl overflow-hidden border border-amber-300/60 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500">
                <div className="px-6 sm:px-10 py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Ready to start planning?</h2>
                        <p className="text-sm text-gray-800 mt-1">Browse the catalog and request a quote for your date, venue and vision.</p>
                    </div>
                    <div className="flex gap-2">
                        <Link href="/catalog" className="inline-flex items-center px-6 py-3 rounded-full bg-gray-900 text-amber-300 font-semibold hover:bg-black">Explore catalog</Link>
                        <button type="button" onClick={() => setAssistantOpen(true)} className="inline-flex items-center px-6 py-3 rounded-full bg-white text-gray-900 font-semibold hover:bg-white/90">Chat now</button>
                    </div>
                </div>
            </section>

            <style>{`
                /* reveal on load (simple, modern) */
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

                .line-clamp-2{display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;}
            `}</style>

            {/* attach reveal observer */}
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
