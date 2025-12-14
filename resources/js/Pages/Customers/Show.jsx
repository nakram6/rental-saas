import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm, router, usePage } from "@inertiajs/react";
import { useTheme } from "@/Context/ThemeContext";
import Toast from "@/Components/Toast";

export default function Show({ customer }) {
  const { theme } = useTheme();
  const { flash } = usePage().props;

  const isDark = theme !== "light";
  const pageText = isDark ? "text-slate-50" : "text-gray-900";
  const subText =
    theme === "light" ? "text-gray-600" : theme === "gold" ? "text-amber-100/70" : "text-slate-300";

  const panel =
    theme === "light"
      ? "bg-white border-gray-200"
      : theme === "gold"
      ? "bg-[#0b1220] border-amber-500/25"
      : "bg-slate-900 border-slate-800";

  const input =
    "w-full rounded-xl border px-3 py-2 text-sm outline-none " +
    (theme === "light"
      ? "bg-white border-gray-200 text-gray-900 placeholder:text-gray-400"
      : "bg-black/10 border-slate-700 text-slate-50 placeholder:text-slate-400");

  const btnPrimary =
    "px-4 py-2 rounded-xl text-sm font-semibold border transition " +
    (theme === "light"
      ? "bg-gray-900 text-white border-gray-900 hover:opacity-90"
      : theme === "gold"
      ? "bg-amber-400 text-slate-900 border-amber-400 hover:opacity-90"
      : "bg-slate-50 text-slate-900 border-slate-50 hover:opacity-90");

  const btnOutline =
    "px-4 py-2 rounded-xl text-sm font-semibold border transition " +
    (theme === "light"
      ? "bg-white text-gray-900 border-gray-200 hover:bg-gray-50"
      : theme === "gold"
      ? "bg-transparent text-amber-100 border-amber-500/25 hover:bg-amber-400/10"
      : "bg-transparent text-slate-50 border-slate-700 hover:bg-slate-800/60");

  // Edit form
  const { data, setData, put, processing, errors } = useForm({
    name: customer?.name ?? "",
    email: customer?.email ?? "",
    phone: customer?.phone ?? "",
    city: customer?.city ?? "",
    address: customer?.address ?? "",
    notes: customer?.notes ?? "",
    status: customer?.status ?? "Active",
  });

  const submit = (e) => {
    e.preventDefault();
    put(route("customers.update", customer.id), { preserveScroll: true });
  };

  const deleteCustomer = () => {
    if (confirm("Are you sure you want to delete this customer?")) {
      router.delete(route("customers.destroy", customer.id));
    }
  };

  // Email PDF form
  const emailForm = useForm({
    to: customer?.email ?? "",
    subject: customer?.name ? `Customer Profile: ${customer.name}` : "Customer Profile",
    message: "Hi, please find the customer profile PDF attached.",
  });

  const sendEmail = (e) => {
    e.preventDefault();
    emailForm.post(route("customers.email", customer.id), {
      preserveScroll: true,
    });
  };

  return (
    <AuthenticatedLayout
      header={
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className={`text-xl font-semibold leading-tight ${pageText}`}>Customer Profile</h2>
            <p className={`text-sm mt-1 ${subText}`}>Edit details • Export PDF • Send Email</p>
          </div>

          <div className="flex items-center gap-2">
            <a href={route("customers.pdf", customer.id)} target="_blank" rel="noreferrer" className={btnOutline}>
              Preview PDF
            </a>
            <a href={route("customers.pdf.download", customer.id)} className={btnPrimary}>
              Download PDF
            </a>
            <button onClick={deleteCustomer} className="px-4 py-2 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700">
              Delete
            </button>
          </div>
        </div>
      }
    >
      <Head title={`Customer: ${customer?.name ?? ""}`} />

      <Toast message={flash?.success} type="success" />
      <Toast message={flash?.error} type="error" />

      <div className="py-8">
        <div className="mx-auto max-w-3xl sm:px-6 lg:px-8 space-y-4">
          <div className="flex items-center justify-between">
            <Link
              href={route("customers.index")}
              className={"text-sm font-semibold underline underline-offset-4 " + (theme === "light" ? "text-gray-900" : "text-amber-200")}
            >
              ← Back to Customers
            </Link>

            <div className={`text-xs ${subText}`}>
              Total Bookings: <span className={`font-semibold ${pageText}`}>{customer?.total_bookings ?? 0}</span>
              {"  "}•{"  "}
              Total Spent:{" "}
              <span className={`font-semibold ${pageText}`}>${Number(customer?.total_spent ?? 0).toLocaleString()}</span>
            </div>
          </div>

          {/* Email PDF */}
          <div className={`rounded-2xl border shadow-sm ${panel}`}>
            <div className="p-6">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className={`text-base font-semibold ${pageText}`}>Email Customer PDF</div>
                  <div className={`text-sm mt-1 ${subText}`}>Sends a branded customer profile PDF as attachment.</div>
                </div>

                <button type="button" onClick={() => window.open(route("customers.pdf", customer.id), "_blank")} className={btnOutline}>
                  Open Preview
                </button>
              </div>

              <form onSubmit={sendEmail} className="mt-4 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className={`text-sm font-semibold ${pageText}`}>To</label>
                    <input className={input} value={emailForm.data.to} onChange={(e) => emailForm.setData("to", e.target.value)} />
                    {emailForm.errors.to && <div className="text-sm text-red-600 mt-1">{emailForm.errors.to}</div>}
                  </div>

                  <div>
                    <label className={`text-sm font-semibold ${pageText}`}>Subject</label>
                    <input className={input} value={emailForm.data.subject} onChange={(e) => emailForm.setData("subject", e.target.value)} />
                    {emailForm.errors.subject && <div className="text-sm text-red-600 mt-1">{emailForm.errors.subject}</div>}
                  </div>
                </div>

                <div>
                  <label className={`text-sm font-semibold ${pageText}`}>Message</label>
                  <textarea className={`${input} min-h-[100px]`} value={emailForm.data.message} onChange={(e) => emailForm.setData("message", e.target.value)} />
                  {emailForm.errors.message && <div className="text-sm text-red-600 mt-1">{emailForm.errors.message}</div>}
                </div>

                <div className="flex items-center gap-2">
                  <button type="submit" disabled={emailForm.processing} className={btnPrimary + (emailForm.processing ? " opacity-60 cursor-not-allowed" : "")}>
                    {emailForm.processing ? "Sending…" : "Send Email"}
                  </button>

                  <a href={route("customers.pdf.download", customer.id)} className={btnOutline}>
                    Download instead
                  </a>
                </div>
              </form>
            </div>
          </div>

          {/* Edit customer */}
          <div className={`rounded-2xl border shadow-sm ${panel}`}>
            <form onSubmit={submit} className="p-6 space-y-4">
              <div>
                <label className={`text-sm font-semibold ${pageText}`}>Name *</label>
                <input className={input} value={data.name} onChange={(e) => setData("name", e.target.value)} />
                {errors.name && <div className="text-sm text-red-600 mt-1">{errors.name}</div>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className={`text-sm font-semibold ${pageText}`}>Email</label>
                  <input className={input} value={data.email} onChange={(e) => setData("email", e.target.value)} />
                  {errors.email && <div className="text-sm text-red-600 mt-1">{errors.email}</div>}
                </div>

                <div>
                  <label className={`text-sm font-semibold ${pageText}`}>Phone</label>
                  <input className={input} value={data.phone} onChange={(e) => setData("phone", e.target.value)} />
                  {errors.phone && <div className="text-sm text-red-600 mt-1">{errors.phone}</div>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className={`text-sm font-semibold ${pageText}`}>City</label>
                  <input className={input} value={data.city} onChange={(e) => setData("city", e.target.value)} />
                </div>

                <div>
                  <label className={`text-sm font-semibold ${pageText}`}>Status</label>
                  <select className={input} value={data.status} onChange={(e) => setData("status", e.target.value)}>
                    <option value="Active">Active</option>
                    <option value="VIP">VIP</option>
                    <option value="New">New</option>
                  </select>
                  {errors.status && <div className="text-sm text-red-600 mt-1">{errors.status}</div>}
                </div>
              </div>

              <div>
                <label className={`text-sm font-semibold ${pageText}`}>Address</label>
                <input className={input} value={data.address} onChange={(e) => setData("address", e.target.value)} />
              </div>

              <div>
                <label className={`text-sm font-semibold ${pageText}`}>Notes</label>
                <textarea className={`${input} min-h-[110px]`} value={data.notes} onChange={(e) => setData("notes", e.target.value)} />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button type="submit" disabled={processing} className={btnPrimary + (processing ? " opacity-60" : "")}>
                  {processing ? "Saving..." : "Save Changes"}
                </button>

                <Link href={route("customers.index")} className={btnOutline}>
                  Back
                </Link>
              </div>
            </form>
          </div>

          <div className={`text-xs ${subText}`}>Next: show customer booking history (table + KPIs).</div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
