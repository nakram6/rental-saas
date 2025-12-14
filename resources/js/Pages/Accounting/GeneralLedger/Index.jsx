import React, { useMemo, useState } from "react";
import { Head, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

const fmtMoney = (n) => {
  const x = Number(n || 0);
  return x.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

const fmtDate = (s) => (s ? String(s) : "");

export default function Index({ accounts = [], lines = [], filters = {}, opening_balance = 0 }) {
  const [accountId, setAccountId] = useState(filters.account_id ?? "");
  const [from, setFrom] = useState(filters.from ?? "");
  const [to, setTo] = useState(filters.to ?? "");

  const selectedAccount = useMemo(
    () => accounts.find((a) => String(a.id) === String(accountId)),
    [accounts, accountId]
  );

  const opening = Number(opening_balance || 0);

  // Build rows with running balance starting from opening balance
  const rows = useMemo(() => {
    let bal = opening;
    return (lines || []).map((line) => {
      const debit = Number(line.debit || 0);
      const credit = Number(line.credit || 0);
      bal += debit - credit;
      return { ...line, _balance: bal };
    });
  }, [lines, opening]);

  const endingBalance = rows.length ? Number(rows[rows.length - 1]._balance || 0) : opening;

  const apply = () => {
    router.get(
      "/accounting/general-ledger",
      { account_id: accountId || null, from: from || null, to: to || null },
      { preserveState: true, preserveScroll: true }
    );
  };

  const reset = () => {
    setAccountId("");
    setFrom("");
    setTo("");
    router.get("/accounting/general-ledger", {}, { preserveScroll: true });
  };

  // Plain URL export (no Ziggy needed)
  const exportUrl = useMemo(() => {
    const params = new URLSearchParams();
    if (accountId) params.set("account_id", accountId);
    if (from) params.set("from", from);
    if (to) params.set("to", to);
    return `/accounting/general-ledger/export?${params.toString()}`;
  }, [accountId, from, to]);

  const hasAccount = !!accountId;
  const hasRows = rows.length > 0;

  return (
    <AuthenticatedLayout>
      <Head title="General Ledger" />

      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold">General Ledger</h1>
            <p className="text-sm opacity-70">
              View journal lines by account with opening and running balances.
            </p>
          </div>

          {selectedAccount && (
            <div className="flex gap-3">
              <div className="px-4 py-2 rounded-lg border bg-white dark:bg-gray-900">
                <div className="text-xs opacity-70">Opening Balance</div>
                <div className="text-lg font-semibold">{fmtMoney(opening)}</div>
              </div>
              <div className="px-4 py-2 rounded-lg border bg-white dark:bg-gray-900">
                <div className="text-xs opacity-70">Ending Balance</div>
                <div className="text-lg font-semibold">{fmtMoney(endingBalance)}</div>
              </div>
            </div>
          )}
        </div>

        {/* Filters Card */}
        <div className="rounded-2xl border bg-white dark:bg-gray-900 shadow-sm">
          <div className="p-5">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
              {/* Account */}
              <div className="md:col-span-5">
                <label className="block text-sm mb-1">Account</label>
                <select
                  className="w-full rounded-lg border px-3 py-2 bg-transparent"
                  value={accountId}
                  onChange={(e) => setAccountId(e.target.value)}
                >
                  <option value="">— Select account —</option>
                  {accounts.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name} ({a.type})
                    </option>
                  ))}
                </select>
              </div>

              {/* From */}
              <div className="md:col-span-3">
                <label className="block text-sm mb-1">From</label>
                <input
                  type="date"
                  className="w-full rounded-lg border px-3 py-2 bg-transparent"
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                />
              </div>

              {/* To */}
              <div className="md:col-span-3">
                <label className="block text-sm mb-1">To</label>
                <input
                  type="date"
                  className="w-full rounded-lg border px-3 py-2 bg-transparent"
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                />
              </div>

              {/* Actions */}
              <div className="md:col-span-1 flex md:flex-col gap-2">
                <button
                  onClick={apply}
                  className="px-4 py-2 rounded-lg bg-black text-white dark:bg-white dark:text-black"
                >
                  Apply
                </button>
                <button
                  onClick={reset}
                  className="px-4 py-2 rounded-lg border"
                >
                  Reset
                </button>
              </div>
            </div>

            {/* Secondary actions */}
            <div className="mt-4 flex flex-wrap gap-2 items-center">
              <a
                href={exportUrl}
                className={`px-4 py-2 rounded-lg border ${hasAccount ? "" : "opacity-50 pointer-events-none"}`}
                title={hasAccount ? "Export current view to CSV" : "Select an account first"}
              >
                Export CSV
              </a>

              {selectedAccount && (
                <div className="text-sm opacity-70">
                  Viewing: <span className="font-medium">{selectedAccount.name}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        {!hasAccount ? (
          <div className="rounded-2xl border bg-white dark:bg-gray-900 p-6 shadow-sm">
            <div className="text-sm opacity-80">
              Select an account to load ledger lines.
            </div>
            <div className="text-xs opacity-70 mt-2">
              Tip: Mark an invoice as <b>Paid</b> to generate Cash/AR journal lines.
            </div>
          </div>
        ) : !hasRows ? (
          <div className="rounded-2xl border bg-white dark:bg-gray-900 p-6 shadow-sm">
            <div className="text-sm opacity-80">
              No journal lines found for this account (or within the selected date range).
            </div>
            <div className="text-xs opacity-70 mt-2">
              Try removing the date filter or choose a different account.
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border bg-white dark:bg-gray-900 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold">Ledger Lines</div>
                <div className="text-xs opacity-70">
                  {from || to ? (
                    <>
                      Date range: <span className="font-medium">{from || "…"}</span> →{" "}
                      <span className="font-medium">{to || "…"}</span>
                    </>
                  ) : (
                    "All dates"
                  )}
                </div>
              </div>

              <div className="text-xs opacity-70">
                Rows: <span className="font-medium">{rows.length}</span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-black/5 dark:bg-white/5">
                  <tr>
                    <th className="text-left p-3 whitespace-nowrap">Date</th>
                    <th className="text-left p-3 whitespace-nowrap">Journal #</th>
                    <th className="text-left p-3 min-w-[320px]">Memo / Description</th>
                    <th className="text-right p-3 whitespace-nowrap">Debit</th>
                    <th className="text-right p-3 whitespace-nowrap">Credit</th>
                    <th className="text-right p-3 whitespace-nowrap">Balance</th>
                  </tr>
                </thead>

                <tbody>
                  {/* Opening balance row */}
                  <tr className="border-b">
                    <td className="p-3 opacity-70">—</td>
                    <td className="p-3 opacity-70">—</td>
                    <td className="p-3 font-medium">Opening Balance</td>
                    <td className="p-3 text-right"></td>
                    <td className="p-3 text-right"></td>
                    <td className="p-3 text-right font-semibold">{fmtMoney(opening)}</td>
                  </tr>

                  {rows.map((line) => (
                    <tr key={line.id} className="border-b last:border-b-0 hover:bg-black/5 dark:hover:bg-white/5">
                      <td className="p-3 whitespace-nowrap">
                        {fmtDate(line.journal_entry?.date)}
                      </td>
                      <td className="p-3 whitespace-nowrap">
                        JE-{line.journal_entry_id}
                      </td>
                      <td className="p-3">
                        {line.memo || line.journal_entry?.description || ""}
                      </td>
                      <td className="p-3 text-right whitespace-nowrap">
                        {Number(line.debit || 0) ? fmtMoney(line.debit) : ""}
                      </td>
                      <td className="p-3 text-right whitespace-nowrap">
                        {Number(line.credit || 0) ? fmtMoney(line.credit) : ""}
                      </td>
                      <td className="p-3 text-right whitespace-nowrap font-semibold">
                        {fmtMoney(line._balance)}
                      </td>
                    </tr>
                  ))}

                  {/* Ending balance row */}
                  <tr className="border-t bg-black/5 dark:bg-white/5">
                    <td className="p-3 font-medium" colSpan={5}>
                      Ending Balance
                    </td>
                    <td className="p-3 text-right font-bold">
                      {fmtMoney(endingBalance)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </AuthenticatedLayout>
  );
}
