import React, { useEffect, useMemo, useRef, useState } from "react";
import { Head, Link } from "@inertiajs/react";
import GuestLayout from "@/Layouts/GuestLayout";

/**
 * NOTE:
 * - Virtual Assistant uses POST /api/assistant
 */

export default function Home({ tenant, items = [] }) {
    const brandName = tenant?.name || "Event Decor Rentals";
    const title = brandName;

    const instagramProfileUrl = "https://www.instagram.com/harbourdecor/";
    const instagramEmbedUrl = "";

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
        // local date (prevents UTC off-by-1)
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

    // ✅ Quick actions
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

    // ✅ 429 retry helper
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

        const nextHistory = [
            ...history,
            { role: "user", text: userSummaryText || toolName },
        ];
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
            setHistory((h) => [...h, { role: "assistant", text: replyText }]);
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

        const summary = `Create draft quote: ${meta.event_date}${
            meta.guest_count ? ` · ${meta.guest_count} guests` : ""
        }${meta.theme_colors ? ` · ${meta.theme_colors}` : ""}${
            meta.budget ? ` · $${meta.budget}` : ""
        }`;

        await sendTool(QUOTE_TOOL, meta, summary);

        setQuoteForm({ event_date: "", guest_count: "", theme_colors: "", budget: "", notes: "" });
    }

    async function sendToAssistant(overrideText) {
        const msg = (overrideText ?? assistantText).trim();
        if (!msg || assistantLoading) return;

        // If in availability mode, allow typed date parsing
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
                            <p className="text-[10px] uppercase tracking-[0.25em] text-amber-300">
                                Virtual Assistant
                            </p>
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

                                            <div className="text-[11px] text-slate-400">
                                                You’ll get a PDF link instantly. We can refine items afterward.
                                            </div>
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

                        {assistantError ? (
                            <div className="mb-2 text-xs text-rose-300">{assistantError}</div>
                        ) : null}

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
                            Tip: share <span className="text-slate-200">date</span>,{" "}
                            <span className="text-slate-200">city</span>,{" "}
                            <span className="text-slate-200">venue</span>,{" "}
                            <span className="text-slate-200">guests</span>,{" "}
                            <span className="text-slate-200">colors</span>,{" "}
                            <span className="text-slate-200">budget</span>.
                        </div>
                    </div>
                </div>
            </div>

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

            {/* RECENT EVENTS */}
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
                            Each event tells a unique story, and we're honoured to help
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
                    <div className="fade-in-up max-w-md">
                        <p className="text-xs uppercase tracking-[0.3em] text-amber-300">
                            Every question has an answer
                        </p>
                        <h2 className="mt-2 text-2xl sm:text-3xl font-bold text-white">
                            Frequently asked questions
                        </h2>
                        <p className="mt-3 text-sm text-slate-300">
                            Wondering how it all works? Here are answers to some of the most
                            common questions about décor, pricing and booking.
                        </p>
                    </div>

                    <div className="space-y-3">
                        {faqs.map((faq, index) => {
                            const isOpen = openFaqIndex === index;
                            return (
                                <div
                                    key={index}
                                    className={`fade-in-up rounded-2xl border ${
                                        isOpen
                                            ? "border-amber-400/70 bg-slate-900/90"
                                            : "border-slate-800 bg-slate-900/70"
                                    } shadow-sm shadow-black/40 transition-colors`}
                                    style={{ animationDelay: `${0.08 * index}s` }}
                                >
                                    <button
                                        type="button"
                                        onClick={() => setOpenFaqIndex(isOpen ? -1 : index)}
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
                                        <div
                                            className={`h-7 w-7 rounded-full border flex items-center justify-center text-xs ${
                                                isOpen
                                                    ? "bg-amber-400 text-slate-900 border-amber-400 rotate-90"
                                                    : "bg-slate-900 text-slate-300 border-slate-600"
                                            } transition-transform`}
                                        >
                                            <span className="font-bold">&gt;</span>
                                        </div>
                                    </button>

                                    <div
                                        className={`px-4 pb-4 text-xs text-slate-300 overflow-hidden transition-all duration-300 ${
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

            {/* Instagram */}
            <section className="bg-slate-950 border-t border-slate-900">
                <div className="max-w-6xl mx-auto px-4 py-12 grid gap-8 md:grid-cols-2 items-start">
                    <div className="fade-in-up">
                        <p className="text-xs uppercase tracking-[0.3em] text-amber-300">
                            Follow our latest work
                        </p>
                        <h2 className="mt-2 text-xl sm:text-2xl font-bold text-white">
                            Instagram feed
                        </h2>
                        <p className="mt-3 text-sm text-slate-300">
                            See real event transformations, trends, and behind-the-scenes.
                        </p>

                        <a
                            href={instagramProfileUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex mt-4 items-center gap-2 text-sm text-amber-300 hover:text-amber-200"
                        >
                            Visit Instagram profile →
                        </a>

                        <div className="mt-6 grid grid-cols-3 gap-2 w-full max-w-sm">
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

                    <div className="fade-in-up delay-1">
                        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl overflow-hidden">
                            <div className="px-4 py-3 border-b border-slate-800 flex items-center justify-between">
                                <p className="text-sm font-semibold text-white">
                                    Embedded post (optional)
                                </p>
                                <span className="text-[11px] text-slate-400">
                                    Best: paste a single post/reel embed URL
                                </span>
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
                                <div className="p-4 text-sm text-slate-300">
                                    No embed configured. If you want a real feed-style embed,
                                    paste a post/reel embed URL in{" "}
                                    <span className="text-slate-100 font-semibold">
                                        instagramEmbedUrl
                                    </span>{" "}
                                    (example: <code className="text-slate-100">.../p/ID/embed</code>).
                                </div>
                            )}
                        </div>
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
