import React, { useMemo, useState } from "react";
import { Head, Link, router } from "@inertiajs/react";
import GuestLayout from "@/Layouts/GuestLayout";
import { useCart } from "@/Shop/useCart";

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function daysBetween(start, end) {
  if (!start || !end) return 1;
  const s = new Date(start);
  const e = new Date(end);
  const diff = Math.ceil((e - s) / (1000 * 60 * 60 * 24));
  return Math.max(1, diff || 1);
}

export default function ShopIndex({ tenant, items, filters }) {
  const { cart, addItem } = useCart();
  const [q, setQ] = useState(filters?.q || "");
  const [addingId, setAddingId] = useState(null);

  const cartCount = useMemo(
    () => (cart?.items?.length ? cart.items.length : 0),
    [cart]
  );

  function submitSearch(e) {
    e.preventDefault();
    router.get(route("shop.index"), { q }, { preserveScroll: true, preserveState: true });
  }

  function quickAdd(it) {
    const start_date = todayISO();
    const end_date = start_date;
    const days = daysBetween(start_date, end_date);

    setAddingId(it.id);

    addItem({
      id: it.id,
      name: it.name,
      sku: it.sku,
      rental_type: it.rental_type,
      price_per_day: Number(it.price_per_day || 0),
      security_deposit: Number(it.security_deposit || 0),
      qty: 1,
      start_date,
      end_date,
      days,
    });

    setTimeout(() => setAddingId(null), 450);
  }

  return (
    <GuestLayout tenant={tenant}>
      <Head title="Shop - Items for Rent" />

      <section className="max-w-7xl mx-auto px-2 sm:px-0">
        {/* Top bar card */}
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-950/40 backdrop-blur p-5 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <p className="text-[11px] uppercase tracking-[0.3em] text-amber-600 dark:text-amber-300">
                Shop
              </p>
              <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold tracking-tight">
                Items for Rent
              </h1>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                Browse items, add to cart, then request a quote.
              </p>
            </div>

            <Link
              href={route("shop.cart")}
              className="px-4 py-2 rounded-2xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-white/10 text-sm flex items-center gap-2 w-fit"
            >
              <span>🛒 Cart</span>
              {cartCount > 0 && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 font-semibold">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>

          {/* Search card row */}
          <form onSubmit={submitSearch} className="mt-5 flex gap-2">
            <input
              className="w-full rounded-2xl px-3 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-4 focus:ring-amber-500/15 focus:border-amber-400"
              placeholder="Search by name or SKU..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
            <button
              className="rounded-2xl px-4 py-2 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-white/10 font-semibold"
            >
              Search
            </button>
          </form>
        </div>

        {/* Grid */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.data.map((it) => (
            <div
              key={it.id}
              className="group rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/40 overflow-hidden shadow-sm hover:shadow-lg transition"
            >
              {/* Image placeholder */}
              <div className="h-40 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-900 dark:to-slate-800 relative">
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition bg-gradient-to-t from-black/20 to-transparent" />
                <div className="absolute left-4 top-4 text-xs px-3 py-1 rounded-full border border-white/30 bg-white/30 dark:bg-black/20">
                  {it.rental_type || "Rental"}
                </div>
              </div>

              <div className="p-5 flex flex-col">
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="font-semibold truncate text-base">
                      {it.name}
                    </div>
                    <div className="text-sm text-slate-500 dark:text-slate-400">
                      SKU: {it.sku || "—"}
                    </div>
                  </div>

                  <div className="text-right text-sm whitespace-nowrap">
                    <div className="font-semibold">
                      ${Number(it.price_per_day || 0).toFixed(2)}/day
                    </div>
                    {!!it.security_deposit && (
                      <div className="text-slate-500 dark:text-slate-400">
                        Deposit: ${Number(it.security_deposit).toFixed(2)}
                      </div>
                    )}
                  </div>
                </div>

                {/* Body */}
                <div className="mt-3 text-sm text-slate-600 dark:text-slate-300 line-clamp-3">
                  {it.description || "No description."}
                </div>

                <div className="mt-3 text-xs text-slate-500 dark:text-slate-400">
                  Qty available: {it.qty_total ?? "—"}
                </div>

                {/* Actions */}
                <div className="mt-4 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => quickAdd(it)}
                    className="flex-1 px-3 py-2 rounded-2xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-white/10 text-sm font-semibold"
                  >
                    {addingId === it.id ? "Added ✓" : "Add to Cart"}
                  </button>

                  <Link
                    className="px-3 py-2 rounded-2xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 text-sm font-semibold hover:opacity-90 transition"
                    href={route("shop.items.show", it.id)}
                  >
                    View
                  </Link>
                </div>

                <div className="mt-3 text-xs text-slate-500 dark:text-slate-400">
                  Quick add uses today’s date. Use “View” to choose dates/qty.
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="mt-7 flex flex-wrap gap-2">
          {items.links.map((l, idx) => (
            <Link
              key={idx}
              href={l.url || "#"}
              className={`px-3 py-2 rounded-2xl border border-slate-200 dark:border-slate-800 text-sm ${
                l.active ? "font-bold bg-amber-400 text-slate-950 border-amber-300" : ""
              } ${!l.url ? "opacity-50 pointer-events-none" : "hover:bg-slate-100 dark:hover:bg-white/10"}`}
              dangerouslySetInnerHTML={{ __html: l.label }}
            />
          ))}
        </div>
      </section>

      <style>{`
        .line-clamp-3{
          display:-webkit-box;
          -webkit-line-clamp:3;
          -webkit-box-orient:vertical;
          overflow:hidden;
        }
      `}</style>
    </GuestLayout>
  );
}
