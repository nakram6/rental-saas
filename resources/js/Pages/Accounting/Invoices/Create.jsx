import React, { useMemo, useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router, usePage } from "@inertiajs/react";

const emptyLine = () => ({
  description: "",
  qty: 1,
  unit_price: 0,
  category: "rental",
});

function Card({ children, className = "" }) {
  return (
    <div className={`rounded-2xl bg-white dark:bg-zinc-900 shadow ${className}`}>
      {children}
    </div>
  );
}

function FieldLabel({ children }) {
  return <label className="text-sm opacity-70">{children}</label>;
}

export default function Create({ customers }) {
  const { errors } = usePage().props;

  const today = new Date().toISOString().slice(0, 10);

  const [form, setForm] = useState({
    customer_id: "",
    booking_id: null,
    issue_date: today,
    due_date: "",
    discount: 0,
    tax_rate: 13, // HST default
    notes: "",
    lines: [emptyLine()],
  });

  /* ---------------- Calculations ---------------- */
  const subtotal = useMemo(() => {
    return form.lines.reduce((sum, l) => {
      return sum + Number(l.qty || 0) * Number(l.unit_price || 0);
    }, 0);
  }, [form.lines]);

  const discount = Number(form.discount || 0);
  const taxableBase = Math.max(0, subtotal - discount);

  const tax = useMemo(() => {
    return (taxableBase * Number(form.tax_rate || 0)) / 100;
  }, [taxableBase, form.tax_rate]);

  const total = useMemo(() => taxableBase + tax, [taxableBase, tax]);

  /* ---------------- Helpers ---------------- */
  const setField = (key, val) => setForm((p) => ({ ...p, [key]: val }));

  const setLine = (idx, patch) => {
    setForm((p) => {
      const lines = [...p.lines];
      lines[idx] = { ...lines[idx], ...patch };
      return { ...p, lines };
    });
  };

  const addLine = () => setForm((p) => ({ ...p, lines: [...p.lines, emptyLine()] }));

  const removeLine = (idx) =>
    setForm((p) => ({
      ...p,
      lines: p.lines.filter((_, i) => i !== idx),
    }));

  /* ---------------- Submit ---------------- */
  const submit = (e) => {
    e.preventDefault();

    const payload = {
      customer_id: form.customer_id,
      booking_id: form.booking_id || null,
      issue_date: form.issue_date,
      due_date: form.due_date || null,
      discount: Number(discount.toFixed(2)),
      tax: Number(tax.toFixed(2)),
      notes: form.notes || null,
      lines: form.lines.map((l) => ({
        description: l.description,
        qty: Number(l.qty),
        unit_price: Number(l.unit_price),
        category: l.category,
      })),
    };

    router.post(route("accounting.invoices.store"), payload);
  };

  return (
    <AuthenticatedLayout
      header={
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold leading-tight">Create Invoice</h2>
            <div className="text-sm opacity-70">
              Accounting • Create and send professional invoices
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href={route("accounting.invoices.index")}
              className="px-4 py-2 rounded-xl border border-black/10 dark:border-white/10 hover:opacity-90 transition"
            >
              ← Back
            </Link>
          </div>
        </div>
      }
    >
      <Head title="Create Invoice" />

      <form onSubmit={submit} className="max-w-6xl mx-auto p-4">
        <div className="grid lg:grid-cols-3 gap-4 items-start">
          {/* LEFT (Main Form) */}
          <div className="lg:col-span-2 space-y-4">
            {/* Invoice Info */}
            <Card>
              <div className="p-5 border-b border-black/10 dark:border-white/10">
                <div className="font-semibold">Invoice Details</div>
                <div className="text-sm opacity-70">Select customer and dates.</div>
              </div>

              <div className="p-5 grid md:grid-cols-3 gap-4">
                <div>
                  <FieldLabel>Customer</FieldLabel>
                  <select
                    className="mt-1 w-full rounded-xl border border-black/10 dark:border-white/10 bg-transparent p-2.5"
                    value={form.customer_id}
                    onChange={(e) => setField("customer_id", e.target.value)}
                  >
                    <option value="">Select customer…</option>
                    {customers.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} {c.email ? `— ${c.email}` : ""}
                      </option>
                    ))}
                  </select>
                  {errors?.customer_id && (
                    <div className="text-sm text-red-500 mt-1">{errors.customer_id}</div>
                  )}
                </div>

                <div>
                  <FieldLabel>Issue Date</FieldLabel>
                  <input
                    type="date"
                    className="mt-1 w-full rounded-xl border border-black/10 dark:border-white/10 bg-transparent p-2.5"
                    value={form.issue_date}
                    onChange={(e) => setField("issue_date", e.target.value)}
                  />
                  {errors?.issue_date && (
                    <div className="text-sm text-red-500 mt-1">{errors.issue_date}</div>
                  )}
                </div>

                <div>
                  <FieldLabel>Due Date (optional)</FieldLabel>
                  <input
                    type="date"
                    className="mt-1 w-full rounded-xl border border-black/10 dark:border-white/10 bg-transparent p-2.5"
                    value={form.due_date}
                    onChange={(e) => setField("due_date", e.target.value)}
                  />
                  {errors?.due_date && (
                    <div className="text-sm text-red-500 mt-1">{errors.due_date}</div>
                  )}
                </div>
              </div>
            </Card>

            {/* Line Items */}
            <Card>
              <div className="p-5 border-b border-black/10 dark:border-white/10 flex items-center justify-between gap-3">
                <div>
                  <div className="font-semibold">Line Items</div>
                  <div className="text-sm opacity-70">Add rentals, delivery, deposits, fees, etc.</div>
                </div>

                <button
                  type="button"
                  onClick={addLine}
                  className="px-4 py-2 rounded-xl bg-black text-white dark:bg-white dark:text-black hover:opacity-90 transition"
                >
                  + Add Line
                </button>
              </div>

              <div className="p-5 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="text-left border-b border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5">
                    <tr>
                      <th className="p-3">Category</th>
                      <th className="p-3">Description</th>
                      <th className="p-3 text-right">Qty</th>
                      <th className="p-3 text-right">Unit Price</th>
                      <th className="p-3 text-right">Line Total</th>
                      <th className="p-3 text-right"> </th>
                    </tr>
                  </thead>

                  <tbody>
                    {form.lines.map((l, idx) => {
                      const lineTotal = Number(l.qty || 0) * Number(l.unit_price || 0);
                      return (
                        <tr key={idx} className="border-b border-black/5 dark:border-white/5 align-top">
                          <td className="p-3">
                            <select
                              className="w-full rounded-xl border border-black/10 dark:border-white/10 bg-transparent p-2.5"
                              value={l.category}
                              onChange={(e) => setLine(idx, { category: e.target.value })}
                            >
                              <option value="rental">Rental</option>
                              <option value="delivery">Delivery</option>
                              <option value="deposit">Deposit</option>
                              <option value="latefee">Late Fee</option>
                              <option value="damage">Damage</option>
                            </select>
                          </td>

                          <td className="p-3">
                            <input
                              className="w-full rounded-xl border border-black/10 dark:border-white/10 bg-transparent p-2.5"
                              value={l.description}
                              onChange={(e) => setLine(idx, { description: e.target.value })}
                              placeholder="e.g., White Velvet Sofa (2 days)"
                            />
                            {errors?.[`lines.${idx}.description`] && (
                              <div className="text-sm text-red-500 mt-1">
                                {errors[`lines.${idx}.description`]}
                              </div>
                            )}
                          </td>

                          <td className="p-3 text-right">
                            <input
                              type="number"
                              step="0.01"
                              className="w-24 text-right rounded-xl border border-black/10 dark:border-white/10 bg-transparent p-2.5"
                              value={l.qty}
                              onChange={(e) => setLine(idx, { qty: e.target.value })}
                            />
                          </td>

                          <td className="p-3 text-right">
                            <input
                              type="number"
                              step="0.01"
                              className="w-32 text-right rounded-xl border border-black/10 dark:border-white/10 bg-transparent p-2.5"
                              value={l.unit_price}
                              onChange={(e) => setLine(idx, { unit_price: e.target.value })}
                            />
                          </td>

                          <td className="p-3 text-right font-semibold">
                            ${lineTotal.toFixed(2)}
                          </td>

                          <td className="p-3 text-right">
                            <button
                              type="button"
                              onClick={() => removeLine(idx)}
                              disabled={form.lines.length === 1}
                              className="px-3 py-2 rounded-xl border border-black/10 dark:border-white/10 disabled:opacity-40 hover:opacity-90 transition"
                              title="Remove line"
                            >
                              Remove
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>

                {errors?.lines && <div className="text-sm text-red-500 mt-2">{errors.lines}</div>}
              </div>
            </Card>

            {/* Notes */}
            <Card>
              <div className="p-5 border-b border-black/10 dark:border-white/10">
                <div className="font-semibold">Notes</div>
                <div className="text-sm opacity-70">Optional message for the customer.</div>
              </div>
              <div className="p-5">
                <textarea
                  className="w-full rounded-xl border border-black/10 dark:border-white/10 bg-transparent p-3"
                  rows={4}
                  value={form.notes}
                  onChange={(e) => setField("notes", e.target.value)}
                  placeholder="Payment terms, delivery notes, thank you message…"
                />
              </div>
            </Card>
          </div>

          {/* RIGHT (Sticky Summary) */}
          <div className="space-y-4 lg:sticky lg:top-6">
            <Card>
              <div className="p-5 border-b border-black/10 dark:border-white/10">
                <div className="font-semibold">Summary</div>
                <div className="text-sm opacity-70">Totals update automatically.</div>
              </div>

              <div className="p-5 space-y-4">
                <div>
                  <FieldLabel>Discount (amount)</FieldLabel>
                  <input
                    type="number"
                    step="0.01"
                    className="mt-1 w-full rounded-xl border border-black/10 dark:border-white/10 bg-transparent p-2.5"
                    value={form.discount}
                    onChange={(e) => setField("discount", e.target.value)}
                  />
                </div>

                <div>
                  <FieldLabel>Tax Rate (%)</FieldLabel>
                  <input
                    type="number"
                    step="0.01"
                    className="mt-1 w-full rounded-xl border border-black/10 dark:border-white/10 bg-transparent p-2.5"
                    value={form.tax_rate}
                    onChange={(e) => setField("tax_rate", e.target.value)}
                  />
                </div>

                <div className="rounded-2xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 p-4">
                  <div className="flex justify-between text-sm opacity-80">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm opacity-80 mt-1">
                    <span>Discount</span>
                    <span>- ${discount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm opacity-80 mt-1">
                    <span>Tax</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>

                  <div className="h-px bg-black/10 dark:bg-white/10 my-3" />

                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full px-6 py-3 rounded-2xl bg-black text-white dark:bg-white dark:text-black hover:opacity-90 transition"
                >
                  Create Invoice
                </button>

                <div className="text-xs opacity-60">
                  Tip: After creating, go to Invoices list and click <b>Preview</b> / <b>Download</b> PDF.
                </div>
              </div>
            </Card>

            <Card className="border border-black/10 dark:border-white/10">
              <div className="p-5">
                <div className="font-semibold">Professional touch</div>
                <div className="text-sm opacity-70 mt-1">
                  Next we can add: invoice logo/branding, customer address, email invoice, and “mark as paid”.
                </div>
              </div>
            </Card>
          </div>
        </div>
      </form>
    </AuthenticatedLayout>
  );
}
