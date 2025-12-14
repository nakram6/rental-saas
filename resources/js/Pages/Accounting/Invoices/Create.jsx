import React, { useMemo, useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router, usePage } from "@inertiajs/react";

const emptyLine = () => ({
  description: "",
  qty: 1,
  unit_price: 0,
  category: "rental",
});

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

  const addLine = () =>
    setForm((p) => ({ ...p, lines: [...p.lines, emptyLine()] }));

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
      lines: form.lines.map((l) => ({
        description: l.description,
        qty: Number(l.qty),
        unit_price: Number(l.unit_price),
        category: l.category,
      })),
    };

    router.post(route("accounting.invoices.store"), payload);
  };

  /* ---------------- UI ---------------- */

  return (
    <AuthenticatedLayout>
      <Head title="Create Invoice" />

      <div className="max-w-6xl mx-auto p-4 space-y-4">
        {/* Header */}
        <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 shadow">
          <h1 className="text-xl font-semibold">Create Invoice</h1>
          <p className="text-sm opacity-70">
            Add line items, discounts, and tax. Totals update automatically.
          </p>
        </div>

        <form onSubmit={submit} className="space-y-4">
          {/* Invoice Info */}
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 shadow">
              <label className="text-sm opacity-70">Customer</label>
              <select
                className="mt-1 w-full rounded-lg border border-black/10 dark:border-white/10 bg-transparent p-2"
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
                <div className="text-sm text-red-500 mt-1">
                  {errors.customer_id}
                </div>
              )}
            </div>

            <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 shadow">
              <label className="text-sm opacity-70">Issue Date</label>
              <input
                type="date"
                className="mt-1 w-full rounded-lg border border-black/10 dark:border-white/10 bg-transparent p-2"
                value={form.issue_date}
                onChange={(e) => setField("issue_date", e.target.value)}
              />
            </div>

            <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 shadow">
              <label className="text-sm opacity-70">Due Date (optional)</label>
              <input
                type="date"
                className="mt-1 w-full rounded-lg border border-black/10 dark:border-white/10 bg-transparent p-2"
                value={form.due_date}
                onChange={(e) => setField("due_date", e.target.value)}
              />
            </div>
          </div>

          {/* Line Items */}
          <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 shadow space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold">Line Items</h2>
              <button
                type="button"
                onClick={addLine}
                className="px-3 py-2 rounded-lg border border-black/10 dark:border-white/10"
              >
                + Add Line
              </button>
            </div>

            <table className="w-full text-sm">
              <thead className="border-b border-black/10 dark:border-white/10">
                <tr>
                  <th className="p-2">Category</th>
                  <th className="p-2">Description</th>
                  <th className="p-2 text-right">Qty</th>
                  <th className="p-2 text-right">Unit Price</th>
                  <th className="p-2 text-right">Total</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {form.lines.map((l, idx) => (
                  <tr key={idx} className="border-b border-black/5">
                    <td className="p-2">
                      <select
                        className="w-full rounded-lg border border-black/10 dark:border-white/10 bg-transparent p-2"
                        value={l.category}
                        onChange={(e) =>
                          setLine(idx, { category: e.target.value })
                        }
                      >
                        <option value="rental">Rental</option>
                        <option value="delivery">Delivery</option>
                        <option value="deposit">Deposit</option>
                        <option value="latefee">Late Fee</option>
                        <option value="damage">Damage</option>
                      </select>
                    </td>

                    <td className="p-2">
                      <input
                        className="w-full rounded-lg border border-black/10 dark:border-white/10 bg-transparent p-2"
                        value={l.description}
                        onChange={(e) =>
                          setLine(idx, { description: e.target.value })
                        }
                        placeholder="Item description"
                      />
                    </td>

                    <td className="p-2 text-right">
                      <input
                        type="number"
                        className="w-24 text-right rounded-lg border border-black/10 dark:border-white/10 bg-transparent p-2"
                        value={l.qty}
                        onChange={(e) =>
                          setLine(idx, { qty: e.target.value })
                        }
                      />
                    </td>

                    <td className="p-2 text-right">
                      <input
                        type="number"
                        className="w-28 text-right rounded-lg border border-black/10 dark:border-white/10 bg-transparent p-2"
                        value={l.unit_price}
                        onChange={(e) =>
                          setLine(idx, { unit_price: e.target.value })
                        }
                      />
                    </td>

                    <td className="p-2 text-right font-semibold">
                      {(l.qty * l.unit_price).toFixed(2)}
                    </td>

                    <td className="p-2 text-right">
                      <button
                        type="button"
                        onClick={() => removeLine(idx)}
                        disabled={form.lines.length === 1}
                        className="px-3 py-2 rounded-lg border border-black/10 dark:border-white/10 disabled:opacity-40"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 shadow">
              <label className="text-sm opacity-70">Discount</label>
              <input
                type="number"
                className="mt-1 w-full rounded-lg border border-black/10 dark:border-white/10 bg-transparent p-2"
                value={form.discount}
                onChange={(e) => setField("discount", e.target.value)}
              />
            </div>

            <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 shadow">
              <label className="text-sm opacity-70">Tax Rate (%)</label>
              <input
                type="number"
                className="mt-1 w-full rounded-lg border border-black/10 dark:border-white/10 bg-transparent p-2"
                value={form.tax_rate}
                onChange={(e) => setField("tax_rate", e.target.value)}
              />
            </div>

            <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 shadow">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Discount</span>
                <span>- {discount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span>{tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg mt-2">
                <span>Total</span>
                <span>{total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Submit */}
          <div>
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-black text-white dark:bg-white dark:text-black"
            >
              Create Invoice
            </button>
          </div>
        </form>
      </div>
    </AuthenticatedLayout>
  );
}
