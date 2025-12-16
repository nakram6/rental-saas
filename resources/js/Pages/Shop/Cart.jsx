import React, { useMemo, useState } from "react";
import { Head, Link } from "@inertiajs/react";
import GuestLayout from "@/Layouts/GuestLayout";
import { useCart } from "@/Shop/useCart";

function daysBetween(start, end) {
  if (!start || !end) return 1;
  const s = new Date(start);
  const e = new Date(end);
  const diff = Math.ceil((e - s) / (1000 * 60 * 60 * 24));
  return Math.max(1, diff || 1);
}

export default function CartPage({ tenant }) {
  const { cart, totals, updateItem, removeItem, clear } = useCart();
  const today = new Date().toISOString().slice(0, 10);

  const [event, setEvent] = useState({
    event_date: "",
    city: "",
    venue: "",
    event_type: "",
    guest_count: "",
    theme_colors: "",
    budget: "",
    notes: "",
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  function onChangeEvent(key, value) {
    setEvent((prev) => ({ ...prev, [key]: value }));
  }

  // ✅ Safe computed totals (fallback if totals not present)
  const computedSubtotal = useMemo(() => {
    if (totals?.subtotal != null) return Number(totals.subtotal || 0);

    return (cart?.items || []).reduce((sum, c) => {
      const qty = Number(c.qty || 1);
      const days = Number(c.days || daysBetween(c.start_date, c.end_date));
      const price = Number(c.price_per_day || 0);
      return sum + qty * days * price;
    }, 0);
  }, [totals?.subtotal, cart?.items]);

  const computedDeposit = useMemo(() => {
    if (totals?.deposit != null) return Number(totals.deposit || 0);

    return (cart?.items || []).reduce((sum, c) => {
      const qty = Number(c.qty || 1);
      const dep = Number(c.security_deposit || 0);
      return sum + qty * dep;
    }, 0);
  }, [totals?.deposit, cart?.items]);

  async function checkout() {
    setError(null);
    setResult(null);

    if (!cart?.items?.length) {
      setError("Your cart is empty.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        event: {
          ...event,
          guest_count: event.guest_count === "" ? null : Number(event.guest_count),
          budget: event.budget === "" ? null : Number(event.budget),
        },
        items: cart.items.map((x) => ({
          id: x.id,
          qty: Number(x.qty || 1),
          start_date: x.start_date,
          end_date: x.end_date,
          days: Number(x.days || daysBetween(x.start_date, x.end_date)),
        })),
      };

      const res = await fetch("/api/cart/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "X-Requested-With": "XMLHttpRequest",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.message || "Checkout failed");

      setResult(data);
    } catch (e) {
      setError(e?.message || "Checkout failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <GuestLayout tenant={tenant}>
      <Head title="Cart - Rental Items" />

      <div className="max-w-6xl mx-auto px-2 sm:px-0">
        {/* Header */}
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-950/40 backdrop-blur p-5 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="text-[11px] uppercase tracking-[0.3em] text-amber-600 dark:text-amber-300">
                Cart
              </p>
              <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold tracking-tight">
                Your Cart
              </h1>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                Adjust dates/qty, then request a draft quote PDF.
              </p>
            </div>

            <div className="flex gap-2">
              <Link
                href={route("shop.index")}
                className="px-4 py-2 rounded-2xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-white/10 text-sm font-semibold"
              >
                ← Back to shop
              </Link>

              <button
                className="px-4 py-2 rounded-2xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-white/10 text-sm font-semibold"
                onClick={clear}
                disabled={!cart?.items?.length}
              >
                Clear cart
              </button>
            </div>
          </div>
        </div>

        {/* Empty state */}
        {!cart?.items?.length ? (
          <div className="mt-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/40 p-8 text-slate-600 dark:text-slate-300">
            Cart is empty.
          </div>
        ) : (
          <>
            {/* Cart Items */}
            <div className="mt-6 grid gap-4">
              {cart.items.map((c, idx) => {
                const qty = Number(c.qty || 1);
                const days = Number(c.days || daysBetween(c.start_date, c.end_date));
                const price = Number(c.price_per_day || 0);
                const dep = Number(c.security_deposit || 0);

                const lineTotal = qty * days * price;
                const depositTotal = qty * dep;

                return (
                  <div
                    key={idx}
                    className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/40 p-5 sm:p-6 shadow-sm"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                      <div className="min-w-0">
                        <div className="text-lg font-bold truncate">{c.name}</div>
                        <div className="text-sm text-slate-500 dark:text-slate-400">
                          SKU: {c.sku || "—"}
                        </div>

                        <div className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                          ${price.toFixed(2)}/day
                          {!!dep && (
                            <span className="ml-2 text-slate-500 dark:text-slate-400">
                              • Deposit: ${dep.toFixed(2)} each
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button
                          className="px-4 py-2 rounded-2xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-white/10 text-sm font-semibold"
                          onClick={() => removeItem(idx)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>

                    <div className="mt-5 grid grid-cols-1 sm:grid-cols-4 gap-3">
                      <div>
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                          Start date
                        </label>
                        <input
                          type="date"
                          min={today}
                          value={c.start_date || today}
                          onChange={(e) => {
                            const start_date = e.target.value;
                            const newDays = daysBetween(start_date, c.end_date);
                            updateItem(idx, { start_date, days: newDays });
                          }}
                          className="mt-2 w-full rounded-2xl px-3 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800"
                        />
                      </div>

                      <div>
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                          End date
                        </label>
                        <input
                          type="date"
                          min={c.start_date || today}
                          value={c.end_date || today}
                          onChange={(e) => {
                            const end_date = e.target.value;
                            const newDays = daysBetween(c.start_date, end_date);
                            updateItem(idx, { end_date, days: newDays });
                          }}
                          className="mt-2 w-full rounded-2xl px-3 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800"
                        />
                      </div>

                      <div>
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                          Qty
                        </label>
                        <input
                          type="number"
                          min="1"
                          value={qty}
                          onChange={(e) =>
                            updateItem(idx, { qty: Number(e.target.value || 1) })
                          }
                          className="mt-2 w-full rounded-2xl px-3 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800"
                        />
                      </div>

                      <div>
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                          Days
                        </label>
                        <input
                          type="number"
                          min="1"
                          value={days}
                          onChange={(e) =>
                            updateItem(idx, { days: Number(e.target.value || 1) })
                          }
                          className="mt-2 w-full rounded-2xl px-3 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800"
                        />
                      </div>
                    </div>

                    <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-950/30 p-4">
                        <div className="text-xs text-slate-500 dark:text-slate-400">Days</div>
                        <div className="mt-1 text-lg font-extrabold">{days}</div>
                      </div>

                      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-950/30 p-4">
                        <div className="text-xs text-slate-500 dark:text-slate-400">Line total</div>
                        <div className="mt-1 text-lg font-extrabold">${lineTotal.toFixed(2)}</div>
                      </div>

                      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-950/30 p-4">
                        <div className="text-xs text-slate-500 dark:text-slate-400">Deposit total</div>
                        <div className="mt-1 text-lg font-extrabold">${depositTotal.toFixed(2)}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Totals + Event info */}
            <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/40 p-5 sm:p-6">
                <div className="font-bold text-lg mb-4">Totals</div>
                <div className="text-sm flex items-center justify-between">
                  <span>Subtotal</span>
                  <b>${computedSubtotal.toFixed(2)}</b>
                </div>
                <div className="text-sm flex items-center justify-between mt-2">
                  <span>Deposit (not included in subtotal)</span>
                  <b>${computedDeposit.toFixed(2)}</b>
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                  Taxes will be calculated inside the quote.
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/40 p-5 sm:p-6">
                <div className="font-bold text-lg mb-4">Event details (optional)</div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-semibold">Event date</label>
                    <input
                      type="date"
                      min={today}
                      value={event.event_date}
                      onChange={(e) => onChangeEvent("event_date", e.target.value)}
                      className="mt-2 w-full rounded-2xl px-3 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-semibold">City</label>
                    <input
                      value={event.city}
                      onChange={(e) => onChangeEvent("city", e.target.value)}
                      className="mt-2 w-full rounded-2xl px-3 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800"
                      placeholder="Toronto"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-semibold">Venue</label>
                    <input
                      value={event.venue}
                      onChange={(e) => onChangeEvent("venue", e.target.value)}
                      className="mt-2 w-full rounded-2xl px-3 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800"
                      placeholder="Venue name"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-semibold">Guest count</label>
                    <input
                      type="number"
                      min="0"
                      value={event.guest_count}
                      onChange={(e) => onChangeEvent("guest_count", e.target.value)}
                      className="mt-2 w-full rounded-2xl px-3 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-semibold">Theme colors</label>
                    <input
                      value={event.theme_colors}
                      onChange={(e) => onChangeEvent("theme_colors", e.target.value)}
                      className="mt-2 w-full rounded-2xl px-3 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800"
                      placeholder="White, Gold"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-semibold">Budget</label>
                    <input
                      type="number"
                      min="0"
                      value={event.budget}
                      onChange={(e) => onChangeEvent("budget", e.target.value)}
                      className="mt-2 w-full rounded-2xl px-3 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800"
                      placeholder="1500"
                    />
                  </div>
                </div>

                <div className="mt-3">
                  <label className="text-sm font-semibold">Notes</label>
                  <textarea
                    value={event.notes}
                    onChange={(e) => onChangeEvent("notes", e.target.value)}
                    className="mt-2 w-full rounded-2xl px-3 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800"
                    rows={3}
                    placeholder="Any special instructions..."
                  />
                </div>
              </div>
            </div>

            {/* Checkout */}
            <div className="mt-6 rounded-3xl border border-amber-300/60 bg-amber-500/10 p-5 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <div className="font-bold text-lg">Create Draft Quote</div>
                  <div className="text-sm text-slate-600 dark:text-slate-300">
                    This will generate a quote PDF for admin review.
                  </div>
                </div>

                <button
                  onClick={checkout}
                  disabled={loading || !cart?.items?.length}
                  className="px-5 py-2.5 rounded-2xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-semibold hover:opacity-90 disabled:opacity-60"
                >
                  {loading ? "Creating..." : "Request Quote"}
                </button>
              </div>

              {error && (
                <div className="mt-4 text-sm rounded-2xl border border-rose-300/60 bg-rose-500/10 p-4">
                  <b>Error:</b> {error}
                </div>
              )}

              {result && (
                <div className="mt-4 text-sm rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-950/30 p-4">
                  <div>
                    Quote created: <b>{result.quote_no}</b> (ID: {result.quote_id})
                  </div>
                  {result.pdf_url ? (
                    <div className="mt-2">
                      <a className="font-semibold underline" href={result.pdf_url} target="_blank" rel="noreferrer">
                        Download PDF
                      </a>
                    </div>
                  ) : (
                    <div className="mt-2 text-slate-500 dark:text-slate-400">
                      PDF not generated yet.
                    </div>
                  )}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </GuestLayout>
  );
}
