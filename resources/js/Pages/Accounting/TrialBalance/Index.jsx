import React, { useMemo, useState } from "react";
import { Head, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

const money = (n) =>
  Number(n || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export default function Index({ rows = [], totals = {}, filters = {} }) {
  const [from, setFrom] = useState(filters.from ?? "");
  const [to, setTo] = useState(filters.to ?? "");
  const [asOf, setAsOf] = useState(filters.as_of ?? "");

  const applyRange = () => {
    router.get(
      "/accounting/trial-balance",
      { from: from || null, to: to || null, as_of: null },
      { preserveState: true, preserveScroll: true }
    );
  };

  const applyAsOf = () => {
    router.get(
      "/accounting/trial-balance",
      { as_of: asOf || null, from: null, to: null },
      { preserveState: true, preserveScroll: true }
    );
  };

  const reset = () => {
    setFrom("");
    setTo("");
    setAsOf("");
    router.get("/accounting/trial-balance", {}, { preserveScroll: true });
  };

  const grouped = useMemo(() => {
    const map = new Map();
    for (const r of rows) {
      const key = r.account_type || "other";
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(r);
    }
    return Array.from(map.entries());
  }, [rows]);

  return (
    <AuthenticatedLayout>
      <Head title="Trial Balance" />

      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold">Trial Balance</h1>
            <p className="text-sm opacity-70">
              Summarizes total debits and credits by account for the selected period.
            </p>
          </div>

          <div className="flex gap-3">
            <div className="px-4 py-2 rounded-lg border bg-white dark:bg-gray-900">
              <div className="text-xs opacity-70">Total Debit</div>
              <div className="text-lg font-semibold">{money(totals.debit)}</div>
            </div>
            <div className="px-4 py-2 rounded-lg border bg-white dark:bg-gray-900">
              <div className="text-xs opacity-70">Total Credit</div>
              <div className="text-lg font-semibold">{money(totals.credit)}</div>
            </div>
          </div>
        </div>

        {/* Balance status */}
        <div
          className={`rounded-2xl border p-4 shadow-sm ${
            totals.balanced ? "bg-green-50 dark:bg-green-950" : "bg-red-50 dark:bg-red-950"
          }`}
        >
          <div className="font-semibold">
            {totals.balanced ? "Balanced ✅" : "Not Balanced ⚠️"}
          </div>
          <div className="text-sm opacity-80">
            Debits should equal credits. If not, review journal entries.
          </div>
        </div>

        {/* Filters */}
        <div className="rounded-2xl border bg-white dark:bg-gray-900 shadow-sm p-5 space-y-4">
          <div className="text-sm font-semibold">Filters</div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
            {/* Range */}
            <div className="md:col-span-3">
              <label className="block text-sm mb-1">From</label>
              <input
                type="date"
                className="w-full rounded-lg border px-3 py-2 bg-transparent"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
              />
            </div>

            <div className="md:col-span-3">
              <label className="block text-sm mb-1">To</label>
              <input
                type="date"
                className="w-full rounded-lg border px-3 py-2 bg-transparent"
                value={to}
                onChange={(e) => setTo(e.target.value)}
              />
            </div>

            <div className="md:col-span-2 flex gap-2">
              <button
                onClick={applyRange}
                className="px-4 py-2 rounded-lg bg-black text-white dark:bg-white dark:text-black"
              >
                Apply Range
              </button>
              <button onClick={reset} className="px-4 py-2 rounded-lg border">
                Reset
              </button>
            </div>

            {/* As-of */}
            <div className="md:col-span-3 md:col-start-1">
              <label className="block text-sm mb-1">As of date</label>

              <input
                type="date"
                className="w-full rounded-lg border px-3 py-2 bg-transparent"
                value={asOf}
                onChange={(e) => setAsOf(e.target.value)}
              />
            </div>
            <div className="md:col-span-2 flex gap-2">
              <button
                onClick={applyAsOf}
                className="px-4 py-2 rounded-lg border"
              >
                Apply As-Of
              </button>
            </div>

            <div className="md:col-span-12 text-xs opacity-70">
              Tip: Use either a date range (From/To) <b>or</b> As-Of date.
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="rounded-2xl border bg-white dark:bg-gray-900 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b flex items-center justify-between">
            <div className="text-sm font-semibold">Accounts</div>
            <div className="text-xs opacity-70">Rows: {rows.length}</div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-black/5 dark:bg-white/5">
                <tr>
                  <th className="text-left p-3">Account</th>
                  <th className="text-left p-3">Type</th>
                  <th className="text-right p-3">Debit</th>
                  <th className="text-right p-3">Credit</th>
                  <th className="text-right p-3">Net</th>
                </tr>
              </thead>

              <tbody>
                {grouped.map(([type, items]) => (
                  <React.Fragment key={type}>
                    <tr className="bg-black/5 dark:bg-white/5">
                      <td className="p-3 font-semibold" colSpan={5}>
                        {String(type).toUpperCase()}
                      </td>
                    </tr>

                    {items.map((r) => (
                      <tr key={r.account_id} className="border-b last:border-b-0 hover:bg-black/5 dark:hover:bg-white/5">
                        <td className="p-3">{r.account_name}</td>
                        <td className="p-3 capitalize opacity-80">{r.account_type}</td>
                        <td className="p-3 text-right">{r.debit ? money(r.debit) : ""}</td>
                        <td className="p-3 text-right">{r.credit ? money(r.credit) : ""}</td>
                        <td className="p-3 text-right font-semibold">
                          {r.net ? money(r.net) : "0.00"}
                        </td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))}

                <tr className="bg-black/5 dark:bg-white/5 font-semibold">
                  <td className="p-3" colSpan={2}>Totals</td>
                  <td className="p-3 text-right">{money(totals.debit)}</td>
                  <td className="p-3 text-right">{money(totals.credit)}</td>
                  <td className="p-3 text-right">{money((totals.debit || 0) - (totals.credit || 0))}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Navigation helper */}
        <div className="flex gap-2">
          <a className="px-4 py-2 rounded-lg border" href="/accounting/general-ledger">
            Go to General Ledger
          </a>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
