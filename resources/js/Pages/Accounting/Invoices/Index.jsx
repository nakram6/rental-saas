import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import Toast from "@/Components/Toast";
import { usePage } from "@inertiajs/react";

export default function Index({ invoices }) {
  return (
    <AuthenticatedLayout
      header={
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold leading-tight">Invoices</h2>
          <Link
            href={route("accounting.invoices.create")}
            className="px-4 py-2 rounded-xl bg-black text-white dark:bg-white dark:text-black"
          >
            + Create Invoice
          </Link>
        </div>
      }
    >
      <Head title="Invoices" />

      <div className="max-w-6xl mx-auto p-4">
        <div className="rounded-xl bg-white dark:bg-zinc-900 shadow overflow-hidden">
          <div className="p-4 border-b border-black/10 dark:border-white/10 flex items-center justify-between">
            <div className="font-semibold">Invoices</div>
            <div className="text-sm opacity-70">
              {invoices?.total ?? 0} total
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left border-b border-black/10 dark:border-white/10">
                <tr>
                  <th className="p-3">Invoice #</th>
                  <th className="p-3">Issue Date</th>
                  <th className="p-3">Due Date</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {invoices?.data?.map((inv) => (
                  <tr key={inv.id} className="border-b border-black/5 dark:border-white/5">
                    <td className="p-3 font-medium">{inv.invoice_no}</td>
                    <td className="p-3">{inv.issue_date ?? "-"}</td>
                    <td className="p-3">{inv.due_date ?? "-"}</td>
                    <td className="p-3">
                      <span className="px-2 py-1 rounded-full text-xs border border-black/10 dark:border-white/10">
                        {inv.status}
                      </span>
                    </td>
                    <td className="p-3 text-right font-semibold">
                      {Number(inv.total ?? 0).toFixed(2)}
                    </td>
                  </tr>
                ))}

                {!invoices?.data?.length && (
                  <tr>
                    <td colSpan="5" className="p-8 text-center opacity-70">
                      No invoices yet. Create your first one.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Basic pagination */}
          {invoices?.links?.length > 3 && (
            <div className="p-4 flex flex-wrap gap-2 border-t border-black/10 dark:border-white/10">
              {invoices.links.map((l) => (
                <Link
                  key={l.label}
                  href={l.url || "#"}
                  className={
                    "px-3 py-2 rounded-lg text-sm border border-black/10 dark:border-white/10 " +
                    (l.active ? "font-bold" : "opacity-80") +
                    (!l.url ? " pointer-events-none opacity-40" : "")
                  }
                  dangerouslySetInnerHTML={{ __html: l.label }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
