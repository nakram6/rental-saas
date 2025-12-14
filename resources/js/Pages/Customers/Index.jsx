import React, { useMemo, useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, usePage } from "@inertiajs/react";
import Toast from "@/Components/Toast";
 import { useTheme } from "@/Context/ThemeContext";

function Kpi({ label, value }) {
  return (
    <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 shadow">
      <div className="text-sm opacity-70">{label}</div>
      <div className="text-2xl font-bold mt-1">{value}</div>
    </div>
  );
}

export default function Index({ customers = [], filters = { q: "", status: "All" } }) {
  const { flash } = usePage().props;
  const { theme } = useTheme();

  const [q, setQ] = useState(filters.q || "");
  const [status, setStatus] = useState(filters.status || "All");

  const filtered = useMemo(() => {
    const s = (q || "").toLowerCase().trim();
    return (customers || []).filter((c) => {
      const matchSearch =
        !s ||
        (c.name || "").toLowerCase().includes(s) ||
        (c.email || "").toLowerCase().includes(s) ||
        (c.phone || "").toLowerCase().includes(s) ||
        (c.city || "").toLowerCase().includes(s);

      const matchStatus = status === "All" ? true : c.status === status;
      return matchSearch && matchStatus;
    });
  }, [customers, q, status]);

  const total = customers.length;
  const vip = customers.filter((c) => c.status === "VIP").length;
  const active = customers.filter((c) => c.status === "Active").length;

  const headerText = theme === "light" ? "text-gray-900" : "text-slate-50";
  const subText =
    theme === "light" ? "text-gray-600" : theme === "gold" ? "text-amber-100/70" : "text-slate-300";

  return (
    <AuthenticatedLayout
      header={
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className={`text-xl font-semibold leading-tight ${headerText}`}>Customers</h2>
            <div className={`text-sm ${subText}`}>Manage customers • Print PDF • Email profile</div>
          </div>

          <Link
            href={route("customers.create")}
            className="px-4 py-2 rounded-xl bg-black text-white dark:bg-white dark:text-black hover:opacity-90 transition"
          >
            + Add Customer
          </Link>
        </div>
      }
    >
      <Head title="Customers" />

      <Toast message={flash?.success} type="success" />
      <Toast message={flash?.error} type="error" />

      <div className="max-w-6xl mx-auto p-4 space-y-4">
        <div className="grid md:grid-cols-3 gap-4">
          <Kpi label="Total customers" value={total} />
          <Kpi label="Active" value={active} />
          <Kpi label="VIP" value={vip} />
        </div>

        <div className="rounded-2xl bg-white dark:bg-zinc-900 shadow overflow-hidden">
          <div className="p-4 border-b border-black/10 dark:border-white/10 flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
            <div>
              <div className="font-semibold">Customer List</div>
              <div className="text-sm opacity-70">Search by name, email, phone, city.</div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search customer…"
                className="w-full sm:w-72 rounded-xl border border-black/10 dark:border-white/10 bg-transparent px-3 py-2"
              />

              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full sm:w-44 rounded-xl border border-black/10 dark:border-white/10 bg-transparent px-3 py-2"
              >
                <option value="All">All</option>
                <option value="Active">Active</option>
                <option value="VIP">VIP</option>
                <option value="New">New</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left border-b border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5">
                <tr>
                  <th className="p-3">Name</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Phone</th>
                  <th className="p-3">City</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>

              <tbody>
                {filtered.map((c) => (
                  <tr key={c.id} className="border-b border-black/5 dark:border-white/5 hover:bg-black/5 dark:hover:bg-white/5 transition">
                    <td className="p-3 font-semibold">{c.name}</td>
                    <td className="p-3">{c.email || "—"}</td>
                    <td className="p-3">{c.phone || "—"}</td>
                    <td className="p-3">{c.city || "—"}</td>
                    <td className="p-3">
                      <span className="px-2 py-1 rounded-full text-xs border border-black/10 dark:border-white/10">
                        {c.status || "Active"}
                      </span>
                    </td>
                    <td className="p-3 text-right whitespace-nowrap">
                      <Link
                        href={route("customers.show", c.id)}
                        className="inline-flex items-center px-3 py-2 rounded-xl border border-black/10 dark:border-white/10 hover:opacity-90 transition"
                      >
                        Open
                      </Link>
                      <a
                        href={route("customers.pdf", c.id)}
                        target="_blank"
                        rel="noreferrer"
                        className="ml-2 inline-flex items-center px-3 py-2 rounded-xl border border-black/10 dark:border-white/10 hover:opacity-90 transition"
                      >
                        PDF
                      </a>
                      <a
                        href={route("customers.pdf.download", c.id)}
                        className="ml-2 inline-flex items-center px-3 py-2 rounded-xl bg-black text-white dark:bg-white dark:text-black hover:opacity-90 transition"
                      >
                        Download
                      </a>
                    </td>
                  </tr>
                ))}

                {!filtered.length && (
                  <tr>
                    <td colSpan="6" className="p-10 text-center opacity-70">
                      No customers found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="p-4 text-sm opacity-70 border-t border-black/10 dark:border-white/10">
            Showing {filtered.length} of {customers.length}
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
