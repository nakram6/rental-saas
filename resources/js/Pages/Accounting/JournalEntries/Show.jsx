import React from "react";
import { Head, Link } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

const money = (n) =>
  Number(n || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export default function Show({ entry, lines, totals }) {
  return (
    <AuthenticatedLayout>
      <Head title={`Journal Entry JE-${entry.id}`} />

      <div className="max-w-5xl mx-auto p-6 space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold">Journal Entry</h1>
            <div className="text-sm opacity-70">JE-{entry.id}</div>
          </div>

          <Link
            href="/accounting/general-ledger"
            className="px-4 py-2 rounded-lg border"
          >
            Back to Ledger
          </Link>
        </div>

        <div className="rounded-2xl border bg-white dark:bg-gray-900 shadow-sm p-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <div className="opacity-70">Entry Date</div>
              <div className="font-medium">{entry.entry_date || "-"}</div>
            </div>
            <div>
              <div className="opacity-70">Reference</div>
              <div className="font-medium">
                {entry.reference_type ? `${entry.reference_type} #${entry.reference_id}` : "-"}
              </div>
            </div>
            <div className="md:col-span-2">
              <div className="opacity-70">Memo</div>
              <div className="font-medium">{entry.memo || "-"}</div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border bg-white dark:bg-gray-900 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b flex items-center justify-between">
            <div className="font-semibold text-sm">Lines</div>
            <div className="text-xs opacity-70">
              Debit: <span className="font-medium">{money(totals.debit)}</span>{" "}
              | Credit: <span className="font-medium">{money(totals.credit)}</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-black/5 dark:bg-white/5">
                <tr>
                  <th className="text-left p-3">Account</th>
                  <th className="text-left p-3">Memo</th>
                  <th className="text-right p-3">Debit</th>
                  <th className="text-right p-3">Credit</th>
                </tr>
              </thead>
              <tbody>
                {lines.map((l) => (
                  <tr key={l.id} className="border-b last:border-b-0 hover:bg-black/5 dark:hover:bg-white/5">
                    <td className="p-3">
                      <div className="font-medium">{l.account_name}</div>
                      <div className="text-xs opacity-70 capitalize">{l.account_type}</div>
                    </td>
                    <td className="p-3">{l.memo || ""}</td>
                    <td className="p-3 text-right">{l.debit ? money(l.debit) : ""}</td>
                    <td className="p-3 text-right">{l.credit ? money(l.credit) : ""}</td>
                  </tr>
                ))}
                <tr className="bg-black/5 dark:bg-white/5 font-semibold">
                  <td className="p-3" colSpan={2}>Totals</td>
                  <td className="p-3 text-right">{money(totals.debit)}</td>
                  <td className="p-3 text-right">{money(totals.credit)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {Number(totals.debit || 0) !== Number(totals.credit || 0) && (
          <div className="p-4 rounded-lg border bg-red-50 dark:bg-red-950">
            <div className="font-semibold">Warning</div>
            <div className="text-sm opacity-80">This journal entry is not balanced.</div>
          </div>
        )}
      </div>
    </AuthenticatedLayout>
  );
}
