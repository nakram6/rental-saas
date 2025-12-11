import React, { useMemo, useState } from "react";
import { Head, useForm, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import dayjs from "dayjs";

function buildMonthDays(baseDate) {
    const start = dayjs(baseDate).startOf("month").startOf("week"); // Sunday
    const end = dayjs(baseDate).endOf("month").endOf("week");

    const days = [];
    let current = start;
    while (current.isBefore(end) || current.isSame(end, "day")) {
        days.push(current);
        current = current.add(1, "day");
    }
    return days;
}

export default function Index({ auth, bookings, selectedDate }) {
    const [currentMonth, setCurrentMonth] = useState(
        selectedDate || dayjs().format("YYYY-MM-DD")
    );

    const [activeDate, setActiveDate] = useState(
        selectedDate || dayjs().format("YYYY-MM-DD")
    );

    const monthDays = useMemo(
        () => buildMonthDays(currentMonth),
        [currentMonth]
    );

    const dailyBookings = useMemo(
        () =>
            bookings.filter(
                (b) => dayjs(b.event_date).format("YYYY-MM-DD") === activeDate
            ),
        [bookings, activeDate]
    );

    const form = useForm({
        event_date: activeDate,
        start_time: "",
        end_time: "",
        client_name: "",
        client_phone: "",
        event_type: "",
        guest_count: "",
        notes: "",
        status: "pending",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        form.post(route("bookings.store"), {
            onSuccess: () => {
                form.reset("start_time", "end_time", "client_name", "client_phone", "event_type", "guest_count", "notes");
                form.setData("event_date", activeDate);
            },
        });
    };

    const goPrevMonth = () => {
        const next = dayjs(currentMonth).subtract(1, "month");
        setCurrentMonth(next.format("YYYY-MM-DD"));
    };

    const goNextMonth = () => {
        const next = dayjs(currentMonth).add(1, "month");
        setCurrentMonth(next.format("YYYY-MM-DD"));
    };

    const isToday = (d) => d.isSame(dayjs(), "day");

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Event Bookings" />

            <div className="py-4 bg-slate-900 min-h-screen">
                <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                        <div>
                            <h1 className="text-sm sm:text-base font-semibold text-slate-50">
                                Event bookings
                            </h1>
                            <p className="text-[11px] text-slate-400">
                                Tap a date on the calendar to see or add bookings. Designed to feel like an iPhone calendar for your decor events.
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                        {/* Calendar */}
                        <div className="lg:col-span-2 bg-slate-950 border border-slate-800 rounded-2xl p-4 shadow-xl shadow-black/60">
                            {/* Month header */}
                            <div className="flex items-center justify-between mb-3">
                                <button
                                    type="button"
                                    onClick={goPrevMonth}
                                    className="px-2 py-1 rounded-full border border-slate-600 text-slate-100 hover:bg-slate-800 text-[11px]"
                                >
                                    ‹
                                </button>
                                <div className="text-center">
                                    <p className="text-slate-50 text-sm font-semibold">
                                        {dayjs(currentMonth).format("MMMM YYYY")}
                                    </p>
                                    <p className="text-[11px] text-slate-400">
                                        {dayjs(activeDate).format("dddd, MMM D")}
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={goNextMonth}
                                    className="px-2 py-1 rounded-full border border-slate-600 text-slate-100 hover:bg-slate-800 text-[11px]"
                                >
                                    ›
                                </button>
                            </div>

                            {/* Weekday labels */}
                            <div className="grid grid-cols-7 text-[10px] text-center text-slate-400 mb-1">
                                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                                    (d) => (
                                        <div key={d}>{d}</div>
                                    )
                                )}
                            </div>

                            {/* Month days */}
                            <div className="grid grid-cols-7 gap-1 text-[11px]">
                                {monthDays.map((d) => {
                                    const dateStr = d.format("YYYY-MM-DD");
                                    const isCurrentMonth = d.isSame(
                                        currentMonth,
                                        "month"
                                    );
                                    const isSelected = dateStr === activeDate;
                                    const count =
                                        bookings.filter(
                                            (b) =>
                                                dayjs(b.event_date).format(
                                                    "YYYY-MM-DD"
                                                ) === dateStr
                                        ).length || 0;

                                    return (
                                        <button
                                            key={dateStr}
                                            type="button"
                                            onClick={() => {
                                                setActiveDate(dateStr);
                                            }}
                                            className={[
                                                "aspect-square flex flex-col items-center justify-center rounded-xl border transition",
                                                isSelected
                                                    ? "bg-amber-400 text-slate-900 border-amber-300"
                                                    : isToday(d)
                                                    ? "border-sky-400 text-sky-100 bg-sky-900/20"
                                                    : "border-slate-800 text-slate-200",
                                                !isCurrentMonth &&
                                                    "!text-slate-500 !border-slate-800",
                                            ].join(" ")}
                                        >
                                            <span className="font-medium">
                                                {d.date()}
                                            </span>
                                            {count > 0 && (
                                                <span className="mt-0.5 text-[9px] px-1 rounded-full bg-slate-900/70 text-amber-200">
                                                    {count} booking
                                                    {count > 1 ? "s" : ""}
                                                </span>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Right panel: bookings + form */}
                        <div className="space-y-3">
                            {/* Bookings list */}
                            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-3 text-[11px] shadow-xl shadow-black/60">
                                <p className="font-semibold text-slate-50 mb-1">
                                    Bookings on{" "}
                                    {dayjs(activeDate).format("MMM D, YYYY")}
                                </p>

                                {dailyBookings.length === 0 && (
                                    <p className="text-slate-400">
                                        No bookings yet. Add one below.
                                    </p>
                                )}

                                <div className="space-y-2 max-h-64 overflow-y-auto mt-1">
                                    {dailyBookings.map((b) => (
                                        <div
                                            key={b.id}
                                            className="rounded-xl border border-slate-700 bg-slate-900/80 px-2.5 py-2"
                                        >
                                            <div className="flex items-center justify-between gap-2">
                                                <div className="min-w-0">
                                                    <p className="font-semibold text-slate-50 truncate">
                                                        {b.client_name}
                                                    </p>
                                                    <p className="text-[10px] text-slate-400 truncate">
                                                        {b.event_type || "Event"}
                                                        {b.guest_count
                                                            ? ` • ${b.guest_count} guests`
                                                            : ""}
                                                    </p>
                                                </div>
                                                <span
                                                    className={[
                                                        "px-2 py-0.5 rounded-full text-[9px] border",
                                                        b.status === "confirmed"
                                                            ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/60"
                                                            : b.status === "cancelled"
                                                            ? "bg-rose-500/10 text-rose-300 border-rose-500/60"
                                                            : "bg-amber-500/10 text-amber-300 border-amber-500/60",
                                                    ].join(" ")}
                                                >
                                                    {b.status}
                                                </span>
                                            </div>
                                            <p className="text-[10px] text-slate-400 mt-0.5">
                                                {b.start_time
                                                    ? `${b.start_time.slice(
                                                          0,
                                                          5
                                                      )} – ${
                                                          b.end_time
                                                              ? b.end_time.slice(
                                                                    0,
                                                                    5
                                                                )
                                                              : "open end"
                                                      }`
                                                    : "Time TBD"}
                                            </p>
                                            {b.notes && (
                                                <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-2">
                                                    {b.notes}
                                                </p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Add booking form */}
                            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-3 text-[11px] shadow-xl shadow-black/60">
                                <p className="font-semibold text-slate-50 mb-2">
                                    New booking
                                </p>
                                <form onSubmit={handleSubmit} className="space-y-2">
                                    <input
                                        type="hidden"
                                        value={activeDate}
                                        onChange={() => {}}
                                    />
                                    <div>
                                        <label className="block text-slate-200 mb-1">
                                            Client name *
                                        </label>
                                        <input
                                            type="text"
                                            value={form.data.client_name}
                                            onChange={(e) =>
                                                form.setData(
                                                    "client_name",
                                                    e.target.value
                                                )
                                            }
                                            className="w-full rounded-md border border-slate-700 bg-slate-900/70 text-slate-100 px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-amber-400"
                                            required
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        <div>
                                            <label className="block text-slate-200 mb-1">
                                                Phone
                                            </label>
                                            <input
                                                type="text"
                                                value={form.data.client_phone}
                                                onChange={(e) =>
                                                    form.setData(
                                                        "client_phone",
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full rounded-md border border-slate-700 bg-slate-900/70 text-slate-100 px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-amber-400"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-slate-200 mb-1">
                                                Event type
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="Mehndi, Walima…"
                                                value={form.data.event_type}
                                                onChange={(e) =>
                                                    form.setData(
                                                        "event_type",
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full rounded-md border border-slate-700 bg-slate-900/70 text-slate-100 px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-amber-400"
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-3 gap-2">
                                        <div>
                                            <label className="block text-slate-200 mb-1">
                                                Guests
                                            </label>
                                            <input
                                                type="number"
                                                min="1"
                                                value={form.data.guest_count}
                                                onChange={(e) =>
                                                    form.setData(
                                                        "guest_count",
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full rounded-md border border-slate-700 bg-slate-900/70 text-slate-100 px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-amber-400"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-slate-200 mb-1">
                                                Start
                                            </label>
                                            <input
                                                type="time"
                                                value={form.data.start_time}
                                                onChange={(e) =>
                                                    form.setData(
                                                        "start_time",
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full rounded-md border border-slate-700 bg-slate-900/70 text-slate-100 px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-amber-400"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-slate-200 mb-1">
                                                End
                                            </label>
                                            <input
                                                type="time"
                                                value={form.data.end_time}
                                                onChange={(e) =>
                                                    form.setData(
                                                        "end_time",
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full rounded-md border border-slate-700 bg-slate-900/70 text-slate-100 px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-amber-400"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-slate-200 mb-1">
                                            Notes
                                        </label>
                                        <textarea
                                            rows={3}
                                            value={form.data.notes}
                                            onChange={(e) =>
                                                form.setData(
                                                    "notes",
                                                    e.target.value
                                                )
                                            }
                                            className="w-full rounded-md border border-slate-700 bg-slate-900/70 text-slate-100 px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-amber-400"
                                            placeholder="Decoration theme, colours, hall name, etc."
                                        />
                                    </div>
                                    <div className="flex justify-end">
                                        <button
                                            type="submit"
                                            disabled={form.processing}
                                            className="px-3 py-1.5 rounded-full bg-amber-400 text-slate-900 font-semibold hover:bg-amber-300 disabled:opacity-60"
                                        >
                                            Save booking
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
