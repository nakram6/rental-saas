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

export default function ShopShow({ tenant, item }) {
  const { addItem, cart } = useCart();

  const today = new Date().toISOString().slice(0, 10);
  const [qty, setQty] = useState(1);
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);

  const days = useMemo(() => daysBetween(startDate, endDate), [startDate, endDate]);

  const lineTotal = Number(item.price_per_day || 0) * Number(qty || 1) * Number(days || 1);
  const depositTotal = Number(item.security_deposit || 0) * Number(qty || 1);

  function onAdd() {
    addItem({
      id: item.id,
      name: item.name,
      sku: item.sku,
      rental_type: item.rental_type,
      price_per_day: Number(item.price_per_day || 0),
      security_deposit: Number(item.security_deposit || 0),
      qty: Number(qty || 1),
      start_date: startDate,
      end_date: endDate,
      days,
    });
  }

  return (
    <GuestLayout tenant={tenant}>
      <Head title={`${item.name} - Rent`} />

      <section className="max-w-5xl mx-auto px-2 sm:px-0">
        {/* Top row */}
        <div className="flex items-center justify-between gap-3 mb-5">
          <Link
            href={route("shop.index")}
            className="text-sm font-semibold text-amber-600 dark:text-amber-300 hover:opacity-80"
          >
            ← Back to shop
          </Link>

          <Link
            href={route("shop.cart")}
            className="text-sm px-3 py-2 rounded-2xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-white/10"
          >
            🛒 Cart: <b>{cart?.items?.length ?? 0}</b>
          </Link>
        </div>

        {/* Main card */}
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/40 overflow-hidden shadow-sm">
          {/* Header image */}
          <div className="h-56 sm:h-72 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-900 dark:to-slate-800 relative">
            <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent" />
            <div className="absolute left-6 bottom-6">
              <div className="text-[11px] uppercase tracking-[0.3em] text-white/80">
                {item.rental_type || "Rental item"}
              </div>
              <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold text-white">
                {item.name}
              </h1>
              <div className="mt-2 text-sm text-white/80">SKU: {item.sku || "—"}</div>
            </div>
          </div>

          <div className="p-6 sm:p-8 grid gap-6">
            {/* Description card */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-950/30 p-5">
              <div className="text-sm font-semibold mb-2">Description</div>
              <div className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {item.description || "No description."}
              </div>
            </div>

            {/* Info cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-950/30 p-5">
                <div className="text-xs uppercase tracking-[0.25em] text-slate-500 dark:text-slate-400">
                  Pricing
                </div>
                <div className="mt-2 text-2xl font-extrabold">
                  ${Number(item.price_per_day || 0).toFixed(2)}
                  <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                    {" "}
                    / day
                  </span>
                </div>
                {!!item.security_deposit && (
                  <div className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                    Deposit: <b>${Number(item.security_deposit).toFixed(2)}</b> each
                  </div>
                )}
              </div>

              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-950/30 p-5">
                <div className="text-xs uppercase tracking-[0.25em] text-slate-500 dark:text-slate-400">
                  Stock
                </div>
                <div className="mt-2 text-sm">
                  Total qty: <b>{item.qty_total ?? "—"}</b>
                </div>
                <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                  (Availability is confirmed during checkout/quote.)
                </div>
              </div>
            </div>

            {/* Rental builder card */}
            <div className="rounded-3xl border border-amber-300/60 bg-amber-500/10 p-6">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <div className="text-[11px] uppercase tracking-[0.3em] text-amber-700 dark:text-amber-300">
                    Build your rental
                  </div>
                  <div className="mt-2 text-lg font-bold text-slate-900 dark:text-white">
                    Select dates + quantity
                  </div>
                </div>

                <button
                  onClick={onAdd}
                  className="px-5 py-2.5 rounded-2xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-semibold hover:opacity-90 transition"
                >
                  Add to Cart
                </button>
              </div>

              <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-sm font-semibold">Start date</label>
                  <input
                    type="date"
                    min={today}
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="mt-2 w-full rounded-2xl px-3 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold">End date</label>
                  <input
                    type="date"
                    min={startDate || today}
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="mt-2 w-full rounded-2xl px-3 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold">Qty</label>
                  <input
                    type="number"
                    min="1"
                    max={item.qty_total || 999}
                    value={qty}
                    onChange={(e) => setQty(e.target.value)}
                    className="mt-2 w-full rounded-2xl px-3 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800"
                  />
                </div>
              </div>

              <div className="mt-5 grid sm:grid-cols-3 gap-3">
                <div className="rounded-2xl bg-white/70 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 p-4">
                  <div className="text-xs text-slate-500 dark:text-slate-400">Days</div>
                  <div className="mt-1 text-lg font-extrabold">{days}</div>
                </div>

                <div className="rounded-2xl bg-white/70 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 p-4">
                  <div className="text-xs text-slate-500 dark:text-slate-400">Line total</div>
                  <div className="mt-1 text-lg font-extrabold">${Number(lineTotal || 0).toFixed(2)}</div>
                </div>

                <div className="rounded-2xl bg-white/70 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 p-4">
                  <div className="text-xs text-slate-500 dark:text-slate-400">Deposit total</div>
                  <div className="mt-1 text-lg font-extrabold">
                    ${Number(depositTotal || 0).toFixed(2)}
                  </div>
                </div>
              </div>

              <div className="mt-4 text-xs text-slate-600 dark:text-slate-300">
                Tip: after adding items, go to <b>Cart</b> to request a quote PDF.
              </div>
            </div>
          </div>
        </div>
      </section>
    </GuestLayout>
  );
}
