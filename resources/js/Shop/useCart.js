import { useEffect, useMemo, useState } from "react";

const KEY = "rental_cart_v1";

function readCart() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : { items: [] };
  } catch {
    return { items: [] };
  }
}

function writeCart(cart) {
  try {
    localStorage.setItem(KEY, JSON.stringify(cart));
  } catch {}
}

export function useCart() {
  const [cart, setCart] = useState(() => readCart());

  useEffect(() => {
    writeCart(cart);
  }, [cart]);

  const totals = useMemo(() => {
    const subtotal = cart.items.reduce(
      (sum, it) => sum + Number(it.line_total || 0),
      0
    );
    const deposit = cart.items.reduce(
      (sum, it) => sum + Number(it.deposit_total || 0),
      0
    );
    return { subtotal, deposit };
  }, [cart]);

  function addItem(payload) {
    const price = Number(payload.price_per_day || 0);
    const dep = Number(payload.security_deposit || 0);
    const qty = Number(payload.qty || 1);
    const days = Number(payload.days || 1);

    const line_total = price * qty * days;
    const deposit_total = dep * qty;

    setCart((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        { ...payload, qty, days, line_total, deposit_total },
      ],
    }));
  }

  function updateItem(index, updates) {
    setCart((prev) => {
      const items = [...prev.items];
      if (!items[index]) return prev;

      const current = { ...items[index], ...updates };
      const price = Number(current.price_per_day || 0);
      const dep = Number(current.security_deposit || 0);
      const qty = Number(current.qty || 1);
      const days = Number(current.days || 1);

      current.line_total = price * qty * days;
      current.deposit_total = dep * qty;

      items[index] = current;
      return { ...prev, items };
    });
  }

  function removeItem(index) {
    setCart((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  }

  function clear() {
    setCart({ items: [] });
  }

  return { cart, totals, addItem, updateItem, removeItem, clear };
}
