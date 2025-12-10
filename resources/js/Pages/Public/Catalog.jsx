// resources/js/Pages/Public/Catalog.jsx

import React from "react";
import { Head, Link } from "@inertiajs/react";
import GuestLayout from "@/Layouts/GuestLayout";

export default function Catalog({ tenant, items = [] }) {
    const title = tenant?.name
        ? `${tenant.name} – Catalog`
        : "Event Decor Catalog";

    // Dummy images (you can replace these files later)
    const imagePool = [
        "/images/hero-sofa.jpg",
        "/images/hero-backdrop.jpg",
        "/images/hero-centerpieces.jpg",
        "/images/hero-sofa.jpg",        // repeat ok, user will replace later
        "/images/hero-backdrop.jpg",
        "/images/hero-centerpieces.jpg",
    ];

    const getImageForIndex = (index) =>
        imagePool[index % imagePool.length];

    const hasItems = items.length > 0;

    return (
        <GuestLayout tenant={tenant}>
            <Head title={title} />

            {/* Page header */}
            <section className="bg-slate-950 border-b border-slate-800">
                <div className="max-w-6xl mx-auto px-4 py-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                    <div>
                        <p className="text-xs uppercase tracking-[0.25em] text-amber-300 mb-2">
                            Full Decor Catalog
                        </p>
                        <h1 className="text-3xl font-bold text-white">
                            Browse Our Décor Collection
                        </h1>
                        <p className="mt-2 text-sm text-slate-300 max-w-xl">
                            Sofas, backdrops, centerpieces, tables, chairs and accent pieces
                            available for your next event.
                        </p>
                    </div>
                    {hasItems && (
                        <div className="text-sm text-slate-300">
                            Showing <span className="font-semibold text-amber-300">{items.length}</span>{" "}
                            item{items.length !== 1 ? "s" : ""}
                        </div>
                    )}
                </div>
            </section>

            {/* Catalog grid */}
            <section className="bg-slate-950">
                <div className="max-w-6xl mx-auto px-4 py-10">
                    {!hasItems && (
                        <p className="text-slate-400 text-sm">
                            No items in the catalog yet. Once you add décor items in the admin
                            panel, they will appear here in a grid view.
                        </p>
                    )}

                    {hasItems && (
                        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {items.map((item, index) => {
                                const imgSrc = getImageForIndex(index);
                                const price = Number(item.price_per_day || 0).toFixed(2);
                                const category =
                                    item.meta?.category ||
                                    item.rental_type ||
                                    "Decor";

                                return (
                                    <div
                                        key={item.id}
                                        className="bg-slate-900/80 border border-slate-800 rounded-xl overflow-hidden shadow-sm hover:shadow-lg hover:shadow-amber-500/10 hover:border-amber-300/60 transition flex flex-col"
                                    >
                                        {/* Image */}
                                        <div className="relative h-40 w-full overflow-hidden">
                                            <img
                                                src={imgSrc}
                                                alt={item.name}
                                                className="h-full w-full object-cover"
                                            />
                                            <span className="absolute left-3 top-3 inline-flex items-center rounded-full bg-black/60 px-2.5 py-0.5 text-xs font-medium text-amber-300">
                                                {category}
                                            </span>
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 flex flex-col p-4 space-y-2">
                                            <h2 className="text-sm font-semibold text-white line-clamp-2">
                                                {item.name}
                                            </h2>

                                            <p className="text-xs text-slate-300 line-clamp-3">
                                                {item.description ||
                                                    "Beautiful décor piece to style your stage, entrance, or seating area."}
                                            </p>

                                            <div className="mt-2 flex items-center justify-between text-xs">
                                                <span className="font-semibold text-amber-300">
                                                    ${price}/day
                                                </span>
                                                {item.qty_total != null && (
                                                    <span className="text-slate-400">
                                                        Qty: {item.qty_total}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="px-4 pb-4 flex items-center justify-between gap-2">
                                            <button
                                                type="button"
                                                className="flex-1 inline-flex items-center justify-center rounded-full bg-amber-400 text-gray-900 text-xs font-semibold py-1.5 hover:bg-amber-300 transition"
                                            >
                                                Add to quote
                                            </button>
                                            <Link
                                                href="#"
                                                className="text-[11px] text-slate-300 hover:text-white"
                                            >
                                                View details
                                            </Link>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </section>
        </GuestLayout>
    );
}
