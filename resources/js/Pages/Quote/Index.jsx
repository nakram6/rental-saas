import React, { useEffect, useMemo, useState } from "react";
import { Head, Link } from "@inertiajs/react";
import GuestLayout from "@/Layouts/GuestLayout";

export default function QuoteIndex({ tenant }) {
    const brand = tenant?.name ?? "Harbour Decor Rentals";

    const todayISO = useMemo(() => {
        const d = new Date();
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, "0");
        const dd = String(d.getDate()).padStart(2, "0");
        return `${yyyy}-${mm}-${dd}`;
    }, []);

    const [form, setForm] = useState({
        event_date: "",
        city: "",
        venue: "",
        event_type: "Wedding",
        guest_count: "",
        theme_colors: "",
        budget: "",
        notes: "",
        phone: "",
        email: "",
    });

    const [submitting, setSubmitting] = useState(false);
    const [result, setResult] = useState(null); // { quote_no, pdf, quote_id, reply? }
    const [error, setError] = useState("");

    // Optional: same API your assistant uses (tool-trigger)
    const QUOTE_TOOL = "__CREATE_DRAFT_QUOTE__";

    async function createDraftQuote() {
        if (!form.event_date) {
            setError("Please select an event date.");
            return;
        }

        setSubmitting(true);
        setError("");
        setResult(null);

        const payload = {
            message: QUOTE_TOOL,
            history: [{ role: "user", text: "Create draft quote" }],
            tenantName: brand,
            meta: {
                event_date: form.event_date,
                city: form.city || null,
                venue: form.venue || null,
                event_type: form.event_type || null,
                guest_count: form.guest_count ? Number(form.guest_count) : null,
                theme_colors: form.theme_colors || null,
                budget: form.budget ? Number(form.budget) : null,
                notes: [
                    form.notes || "",
                    form.phone ? `Phone: ${form.phone}` : "",
                    form.email ? `Email: ${form.email}` : "",
                ]
                    .filter(Boolean)
                    .join("\n"),
            },
        };

        try {
            const res = await fetch("/api/assistant", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify(payload),
            });

            const json = await res.json().catch(() => ({}));
            if (!res.ok) {
                setError(json?.reply || "Something went wrong. Please try again.");
                setSubmitting(false);
                return;
            }

            // Expecting: { reply, intent:"quote_created", pdf:"/storage/...", quoteNo, quoteId }
            setResult({
                reply: json?.reply || "Draft quote created.",
                pdf: json?.pdf || null,
                quote_no: json?.quoteNo || null,
                quote_id: json?.quoteId || null,
                intent: json?.intent || null,
            });
        } catch {
            setError("Network error. Please try again.");
        } finally {
            setSubmitting(false);
        }
    }

    useEffect(() => {
        // reveal on load
        const els = Array.from(document.querySelectorAll(".reveal"));
        if (!els.length) return;
        requestAnimationFrame(() => els.forEach((el) => el.classList.add("is-in")));
    }, []);

    return (
        <GuestLayout tenant={tenant}>
            <Head title={`Get a Quote • ${brand}`} />

            {/* HERO */}
            <section className="reveal rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/40">
                <div className="relative">
                    <div
                        className="h-[260px] sm:h-[320px] bg-cover bg-center"
                        style={{ backgroundImage: "url(/images/hero-backdrop.jpg)" }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/40 to-transparent" />
                    <div className="absolute inset-0 flex items-end">
                        <div className="px-6 sm:px-10 py-8 max-w-4xl">
                            <p className="text-[11px] uppercase tracking-[0.35em] text-amber-300">
                                Fast • Clear • Professional
                            </p>
                            <h1 className="mt-3 text-3xl sm:text-4xl font-extrabold text-white leading-tight">
                                Get a Decor Quote in Minutes
                            </h1>
                            <p className="mt-3 text-sm sm:text-base text-white/80 max-w-2xl">
                                Share your date, venue, guest count and style — we’ll generate a draft quote PDF you can review.
                            </p>

                            <div className="mt-6 flex flex-wrap gap-2">
                                <span className="badge">PDF quote instantly</span>
                                <span className="badge">Stage • Tables • Backdrop</span>
                                <span className="badge">Delivery + Setup + Teardown</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick links row */}
                <div className="px-6 sm:px-10 py-5 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
                    <div className="text-sm text-slate-600 dark:text-slate-300">
                        Prefer browsing first?{" "}
                        <Link href="/catalog" className="font-semibold text-amber-600 dark:text-amber-300 hover:opacity-80">
                            View catalog →
                        </Link>
                    </div>

                    <div className="flex gap-2">
                        <Link
                            href="/shop"
                            className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-white/10"
                        >
                            Shop
                        </Link>
                        <Link
                            href="/cart"
                            className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-white/10"
                        >
                            Cart
                        </Link>
                    </div>
                </div>
            </section>

            {/* MAIN GRID */}
            <section className="mt-8 grid gap-6 lg:grid-cols-[1.1fr,0.9fr]">
                {/* LEFT: FORM CARD */}
                <div className="reveal reveal-delay-1 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/40 overflow-hidden">
                    <div className="px-6 sm:px-8 py-6 border-b border-slate-200 dark:border-slate-800">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <p className="text-[11px] uppercase tracking-[0.3em] text-amber-600 dark:text-amber-300">
                                    Quote details
                                </p>
                                <h2 className="mt-2 text-xl sm:text-2xl font-bold">
                                    Tell us about your event
                                </h2>
                                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                                    Minimum required: <b>Event date</b>. The more details you add, the more accurate the quote.
                                </p>
                            </div>

                            <div className="hidden sm:flex flex-col items-end text-xs text-slate-500 dark:text-slate-400">
                                <span className="pill">Response-friendly</span>
                                <span className="pill mt-2">Clear pricing</span>
                            </div>
                        </div>
                    </div>

                    <div className="px-6 sm:px-8 py-6">
                        {/* form grid */}
                        <div className="grid gap-4 sm:grid-cols-2">
                            <Field label="Event date *">
                                <input
                                    type="date"
                                    min={todayISO}
                                    value={form.event_date}
                                    onChange={(e) => setForm((f) => ({ ...f, event_date: e.target.value }))}
                                    className="input"
                                />
                            </Field>

                            <Field label="Event type">
                                <select
                                    value={form.event_type}
                                    onChange={(e) => setForm((f) => ({ ...f, event_type: e.target.value }))}
                                    className="input"
                                >
                                    <option>Wedding</option>
                                    <option>Engagement</option>
                                    <option>Mehndi</option>
                                    <option>Birthday</option>
                                    <option>Baby Shower</option>
                                    <option>Corporate</option>
                                    <option>Other</option>
                                </select>
                            </Field>

                            <Field label="City">
                                <input
                                    value={form.city}
                                    onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
                                    placeholder="e.g. Windsor / Toronto"
                                    className="input"
                                />
                            </Field>

                            <Field label="Venue">
                                <input
                                    value={form.venue}
                                    onChange={(e) => setForm((f) => ({ ...f, venue: e.target.value }))}
                                    placeholder="e.g. Banquet hall name"
                                    className="input"
                                />
                            </Field>

                            <Field label="Guest count">
                                <input
                                    type="number"
                                    min="1"
                                    value={form.guest_count}
                                    onChange={(e) => setForm((f) => ({ ...f, guest_count: e.target.value }))}
                                    placeholder="e.g. 200"
                                    className="input"
                                />
                            </Field>

                            <Field label="Budget (CAD)">
                                <input
                                    type="number"
                                    min="0"
                                    step="1"
                                    value={form.budget}
                                    onChange={(e) => setForm((f) => ({ ...f, budget: e.target.value }))}
                                    placeholder="e.g. 2500"
                                    className="input"
                                />
                            </Field>

                            <Field label="Theme colors" full>
                                <input
                                    value={form.theme_colors}
                                    onChange={(e) => setForm((f) => ({ ...f, theme_colors: e.target.value }))}
                                    placeholder="e.g. White & Gold"
                                    className="input"
                                />
                            </Field>

                            <Field label="Notes (optional)" full>
                                <textarea
                                    rows={4}
                                    value={form.notes}
                                    onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                                    placeholder="Tell us what you want: stage, tables, backdrop style, florals, lighting, etc."
                                    className="input"
                                />
                            </Field>

                            <Field label="Phone (optional)">
                                <input
                                    value={form.phone}
                                    onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                                    placeholder="e.g. +1 226..."
                                    className="input"
                                />
                            </Field>

                            <Field label="Email (optional)">
                                <input
                                    type="email"
                                    value={form.email}
                                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                                    placeholder="you@email.com"
                                    className="input"
                                />
                            </Field>
                        </div>

                        {/* Result / error */}
                        {error ? (
                            <div className="mt-5 rounded-2xl border border-rose-200 dark:border-rose-900/40 bg-rose-50 dark:bg-rose-950/30 px-4 py-3 text-sm text-rose-800 dark:text-rose-200">
                                {error}
                            </div>
                        ) : null}

                        {result ? (
                            <div className="mt-5 rounded-2xl border border-emerald-200 dark:border-emerald-900/40 bg-emerald-50 dark:bg-emerald-950/30 px-4 py-4">
                                <div className="text-sm font-semibold text-emerald-900 dark:text-emerald-200">
                                    Draft quote created ✅
                                </div>
                                <div className="mt-1 text-sm text-emerald-800/90 dark:text-emerald-200/80">
                                    {result.reply}
                                </div>

                                <div className="mt-4 flex flex-wrap gap-2">
                                    {result.pdf ? (
                                        <a
                                            href={result.pdf}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="btn-primary"
                                        >
                                            📄 Open Quote PDF
                                        </a>
                                    ) : null}

                                    <button
                                        type="button"
                                        onClick={() => {
                                            setResult(null);
                                            setError("");
                                        }}
                                        className="btn-ghost"
                                    >
                                        Create another quote
                                    </button>
                                </div>
                            </div>
                        ) : null}

                        {/* Submit */}
                        <div className="mt-6 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
                            <button
                                type="button"
                                onClick={createDraftQuote}
                                disabled={submitting}
                                className="btn-primary w-full sm:w-auto justify-center"
                            >
                                {submitting ? "Creating..." : "Create draft quote (PDF)"}
                            </button>

                            <div className="text-xs text-slate-500 dark:text-slate-400">
                                By requesting a quote, you agree we may contact you about availability.
                            </div>
                        </div>
                    </div>
                </div>

                {/* RIGHT: INFO CARDS */}
                <div className="grid gap-6">
                    {/* Steps */}
                    <div className="reveal reveal-delay-2 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/40 overflow-hidden">
                        <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-800">
                            <p className="text-[11px] uppercase tracking-[0.3em] text-amber-600 dark:text-amber-300">
                                How it works
                            </p>
                            <h3 className="mt-2 text-lg font-bold">Simple process</h3>
                        </div>
                        <div className="p-6 space-y-4">
                            {[
                                { t: "Share details", d: "Date, venue, guest count, colors & budget." },
                                { t: "Get PDF quote", d: "Instant draft quote you can review." },
                                { t: "Refine items", d: "Swap pieces, adjust packages, confirm logistics." },
                                { t: "We set up", d: "Delivery, setup, teardown — done professionally." },
                            ].map((s, i) => (
                                <div key={i} className="step">
                                    <div className="stepDot">{i + 1}</div>
                                    <div>
                                        <div className="font-semibold">{s.t}</div>
                                        <div className="text-sm text-slate-600 dark:text-slate-300">{s.d}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Packages */}
                    <div className="reveal reveal-delay-3 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/40 overflow-hidden">
                        <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-800">
                            <p className="text-[11px] uppercase tracking-[0.3em] text-amber-600 dark:text-amber-300">
                                Packages
                            </p>
                            <h3 className="mt-2 text-lg font-bold">Popular starting points</h3>
                        </div>
                        <div className="p-6 grid gap-3">
                            {[
                                { name: "Basic", desc: "Backdrop + simple table décor", tag: "Great for small events" },
                                { name: "Standard", desc: "Stage + backdrop + tables", tag: "Most chosen" },
                                { name: "Premium", desc: "Full styling + florals + lighting", tag: "Luxury look" },
                            ].map((p) => (
                                <div key={p.name} className="packageCard">
                                    <div className="flex items-center justify-between gap-3">
                                        <div className="font-semibold text-slate-900 dark:text-white">{p.name}</div>
                                        <span className="packagePill">{p.tag}</span>
                                    </div>
                                    <div className="mt-1 text-sm text-slate-600 dark:text-slate-300">{p.desc}</div>
                                </div>
                            ))}
                            <div className="text-xs text-slate-500 dark:text-slate-400">
                                Packages are flexible — we customize based on venue and vision.
                            </div>
                        </div>
                    </div>

                    {/* Mini gallery */}
                    <div className="reveal reveal-delay-4 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/40">
                        <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-800">
                            <p className="text-[11px] uppercase tracking-[0.3em] text-amber-600 dark:text-amber-300">
                                Inspiration
                            </p>
                            <h3 className="mt-2 text-lg font-bold">Style preview</h3>
                        </div>
                        <div className="p-4 grid grid-cols-3 gap-2">
                            {[
                                "/images/events/event1.jpg",
                                "/images/events/event2.jpg",
                                "/images/events/event3.jpg",
                                "/images/hero-sofa.jpg",
                                "/images/hero-backdrop.jpg",
                                "/images/hero-centerpieces.jpg",
                            ].map((src, i) => (
                                <div key={i} className="aspect-square rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900">
                                    <div className="w-full h-full bg-cover bg-center hoverZoom" style={{ backgroundImage: `url(${src})` }} />
                                </div>
                            ))}
                        </div>
                        <div className="px-6 pb-6">
                            <Link href="/catalog" className="text-sm font-semibold text-amber-600 dark:text-amber-300 hover:opacity-80">
                                Browse more →
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            <style>{`
                .reveal{opacity:0; transform: translateY(10px); transition: opacity 700ms ease, transform 700ms ease;}
                .reveal.is-in{opacity:1; transform: translateY(0);}
                .reveal-delay-1{transition-delay: 90ms;}
                .reveal-delay-2{transition-delay: 180ms;}
                .reveal-delay-3{transition-delay: 260ms;}
                .reveal-delay-4{transition-delay: 340ms;}

                .badge{
                    padding: 6px 10px;
                    border-radius: 999px;
                    font-size: 11px;
                    border: 1px solid rgba(255,255,255,0.22);
                    background: rgba(255,255,255,0.10);
                    color: rgba(255,255,255,0.9);
                }
                .pill{
                    font-size: 11px;
                    padding: 6px 10px;
                    border-radius: 999px;
                    border: 1px solid rgba(148,163,184,0.35);
                    background: rgba(148,163,184,0.10);
                }
                .input{
                    width: 100%;
                    border-radius: 14px;
                    padding: 10px 12px;
                    border: 1px solid rgba(148,163,184,0.35);
                    background: rgba(255,255,255,0.65);
                    outline: none;
                }
                .dark .input{
                    background: rgba(2,6,23,0.35);
                    border-color: rgba(148,163,184,0.25);
                    color: white;
                }
                .input:focus{ border-color: rgba(245,158,11,0.7); box-shadow: 0 0 0 4px rgba(245,158,11,0.12); }

                .btn-primary{
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    padding: 10px 14px;
                    border-radius: 14px;
                    background: rgb(251 191 36);
                    color: rgb(15 23 42);
                    font-weight: 700;
                    border: 1px solid rgba(0,0,0,0.08);
                    transition: transform 150ms ease, opacity 150ms ease;
                }
                .btn-primary:hover{ opacity: 0.92; transform: translateY(-1px); }
                .btn-primary:disabled{ opacity: 0.6; cursor: not-allowed; transform: none; }

                .btn-ghost{
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    padding: 10px 14px;
                    border-radius: 14px;
                    border: 1px solid rgba(148,163,184,0.35);
                    background: rgba(148,163,184,0.08);
                    font-weight: 700;
                }

                .step{
                    display:flex;
                    gap:12px;
                    align-items:flex-start;
                    padding: 12px;
                    border-radius: 18px;
                    border: 1px solid rgba(148,163,184,0.25);
                    background: rgba(148,163,184,0.08);
                }
                .stepDot{
                    min-width: 32px;
                    height: 32px;
                    border-radius: 12px;
                    display:grid;
                    place-items:center;
                    background: rgba(245,158,11,0.18);
                    border: 1px solid rgba(245,158,11,0.35);
                    font-weight: 800;
                    color: rgb(245 158 11);
                }

                .packageCard{
                    border-radius: 18px;
                    border: 1px solid rgba(148,163,184,0.25);
                    background: rgba(148,163,184,0.08);
                    padding: 12px;
                    transition: transform 160ms ease;
                }
                .packageCard:hover{ transform: translateY(-2px); }
                .packagePill{
                    font-size: 11px;
                    padding: 5px 10px;
                    border-radius: 999px;
                    border: 1px solid rgba(245,158,11,0.35);
                    background: rgba(245,158,11,0.12);
                    color: rgb(245 158 11);
                    font-weight: 700;
                }

                .hoverZoom{ transition: transform 600ms ease; }
                .hoverZoom:hover{ transform: scale(1.05); }
            `}</style>
        </GuestLayout>
    );
}

function Field({ label, full, children }) {
    return (
        <div className={full ? "sm:col-span-2" : ""}>
            <div className="text-sm font-semibold mb-2">{label}</div>
            {children}
        </div>
    );
}
