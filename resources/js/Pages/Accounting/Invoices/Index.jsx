import React, { useMemo, useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, usePage, router } from "@inertiajs/react";
import Toast from "@/Components/Toast";

function Kpi({ label, value, sub }) {
  return (
    <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 shadow">
      <div className="text-sm opacity-70">{label}</div>
      <div className="text-2xl font-bold mt-1">{value}</div>
      {sub ? <div className="text-xs opacity-60 mt-1">{sub}</div> : null}
    </div>
  );
}

export default function Index({ invoices }) {
  const { flash } = usePage().props;
  const rows = invoices?.data ?? [];

  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // all, paid, unpaid, sent, draft, void

  const filtered = useMemo(() => {
    const s = (q || "").toLowerCase().trim();

    return rows.filter((r) => {
      const matchSearch =
        !s ||
        (r.invoice_no || "").toLowerCase().includes(s) ||
        (r.customer_name || "").toLowerCase().includes(s);

      const st = (r.status || "draft").toLowerCase();

      const matchStatus =
        statusFilter === "all"
          ? true
          : statusFilter === "unpaid"
          ? st !== "paid" && st !== "void"
          : st === statusFilter;

      return matchSearch && matchStatus;
    });
  }, [rows, q, statusFilter]);

  const paidCount = useMemo(
    () => rows.filter((r) => (r.status || "").toLowerCase() === "paid").length,
    [rows]
  );

  const unpaidCount = useMemo(
    () => rows.filter((r) => !["paid", "void"].includes((r.status || "").toLowerCase())).length,
    [rows]
  );

  const sumTotal = useMemo(
    () => filtered.reduce((sum, r) => sum + Number(r.total || 0), 0),
    [filtered]
  );

  const updateStatus = (inv, nextStatus) => {
    const currentStatus = (inv.status || "draft").toLowerCase();
    const target = (nextStatus || "draft").toLowerCase();

    // 🔒 Frontend lock: paid invoices can't be changed
    if (currentStatus === "paid") return;

    // ✅ Confirm when marking paid
    if (target === "paid") {
      const ok = window.confirm(
        `Mark ${inv.invoice_no} as PAID?\n\nThis will lock the invoice and you won't be able to change it later.`
      );
      if (!ok) return;
    }

    router.patch(
      route("accounting.invoices.status", inv.id),
      { status: target },
      { preserveScroll: true }
    );
  };

  return (
    <AuthenticatedLayout
      header={
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold leading-tight">Invoices</h2>
            <div className="text-sm opacity-70">
              Accounting • Export branded PDFs • Track paid/unpaid
            </div>
          </div>

          <Link
            href={route("accounting.invoices.create")}
            className="px-4 py-2 rounded-xl bg-black text-white dark:bg-white dark:text-black hover:opacity-90 transition"
          >
            + Create Invoice
          </Link>
        </div>
      }
    >
      <Head title="Invoices" />
      <Toast message={flash?.success} type="success" />

      <div className="max-w-6xl mx-auto p-4 space-y-4">
        {/* KPI */}
        <div className="grid md:grid-cols-4 gap-4">
          <Kpi label="Total invoices" value={invoices?.total ?? rows.length} />
          <Kpi label="Paid" value={paidCount} />
          <Kpi label="Unpaid" value={unpaidCount} sub="Draft + Sent (not Void)" />
          <Kpi label="Total shown amount" value={`$${sumTotal.toFixed(2)}`} />
        </div>

        {/* Table Card */}
        <div className="rounded-2xl bg-white dark:bg-zinc-900 shadow overflow-hidden">
          {/* Toolbar */}
          <div className="p-4 border-b border-black/10 dark:border-white/10 flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
            <div>
              <div className="font-semibold">Invoice List</div>
              <div className="text-sm opacity-70">Tip: search by invoice # or customer name.</div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search invoice # or customer…"
                className="w-full sm:w-72 rounded-xl border border-black/10 dark:border-white/10 bg-transparent px-3 py-2"
              />

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full sm:w-48 rounded-xl border border-black/10 dark:border-white/10 bg-transparent px-3 py-2"
              >
                <option value="all">All</option>
                <option value="unpaid">Unpaid</option>
                <option value="paid">Paid</option>
                <option value="sent">Sent</option>
                <option value="draft">Draft</option>
                <option value="void">Void</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left border-b border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5">
                <tr>
                  <th className="p-3">Invoice</th>
                  <th className="p-3">Customer</th>
                  <th className="p-3">Issue</th>
                  <th className="p-3">Due</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Total</th>
                  <th className="p-3 text-right">PDF</th>
                </tr>
              </thead>

              <tbody>
                {filtered.map((inv) => {
                  const currentStatus = (inv.status || "draft").toLowerCase();
                  const isPaid = currentStatus === "paid";

                  return (
                    <tr
                      key={inv.id}
                      className="border-b border-black/5 dark:border-white/5 hover:bg-black/5 dark:hover:bg-white/5 transition"
                    >
                      <td className="p-3">
                        <div className="font-semibold">{inv.invoice_no}</div>
                        <div className="text-xs opacity-70">#{inv.id}</div>
                      </td>

                      <td className="p-3">
                        <div className="font-medium">{inv.customer_name || "—"}</div>
                        <div className="text-xs opacity-70">Customer</div>
                      </td>

                      <td className="p-3">{inv.issue_date ?? "-"}</td>
                      <td className="p-3">{inv.due_date ?? "-"}</td>

                      <td className="p-3">
                        <select
                          value={currentStatus}
                          disabled={isPaid}
                          onChange={(e) => updateStatus(inv, e.target.value)}
                          className={
                            "rounded-xl border border-black/10 dark:border-white/10 bg-transparent px-2 py-1 text-sm " +
                            (isPaid ? "opacity-50 cursor-not-allowed" : "")
                          }
                          title={isPaid ? "Paid invoices are locked" : ""}
                        >
                          <option value="draft">Draft</option>
                          <option value="sent">Sent</option>
                          <option value="paid">Paid</option>
                          <option value="void">Void</option>
                        </select>
                      </td>

                      <td className="p-3 text-right font-bold">
                        ${Number(inv.total ?? 0).toFixed(2)}
                      </td>

                      <td className="p-3 text-right whitespace-nowrap">
                        <a
                          href={route("accounting.invoices.pdf", inv.id)}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center px-3 py-2 rounded-xl border border-black/10 dark:border-white/10 hover:opacity-90 transition"
                        >
                          Preview
                        </a>

                        <a
                          href={route("accounting.invoices.pdf.download", inv.id)}
                          className="ml-2 inline-flex items-center px-3 py-2 rounded-xl bg-black text-white dark:bg-white dark:text-black hover:opacity-90 transition"
                        >
                          Download
                        </a>
                      </td>
                    </tr>
                  );
                })}

                {!filtered.length && (
                  <tr>
                    <td colSpan="7" className="p-10 text-center opacity-70">
                      No invoices found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {invoices?.links?.length > 3 && (
            <div className="p-4 flex flex-wrap gap-2 border-t border-black/10 dark:border-white/10">
              {invoices.links.map((l) => (
                <Link
                  key={l.label}
                  href={l.url || "#"}
                  className={
                    "px-3 py-2 rounded-xl text-sm border border-black/10 dark:border-white/10 " +
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
