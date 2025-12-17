import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, usePage } from "@inertiajs/react";
import { useTheme } from "@/Context/ThemeContext";

function safeRoute(name, params = {}) {
  try {
    if (typeof route === "function" && route().has(name)) return route(name, params);
    return null;
  } catch {
    return null;
  }
}

export default function GuestLayout({ tenant, children }) {
  const { theme, toggleTheme } = useTheme();

  const page = usePage();
  const pageUrl = page?.url ?? "/";
  const isHome = pageUrl === "/";

  const authUser = page?.props?.auth?.user ?? null;
  const brand = tenant?.name ?? "Harbour Decor Rentals";

  const [openMenu, setOpenMenu] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);
  const [openCats, setOpenCats] = useState(false);

  const profileBtnRef = useRef(null);
  const profileDropRef = useRef(null);
  const catsBtnRef = useRef(null);
  const catsDropRef = useRef(null);

  /* ---------------- CART BADGE ---------------- */
  const CART_STORAGE_KEY = "cart";
  const [cartCount, setCartCount] = useState(0);

  const refreshCartCount = () => {
    try {
      const raw = localStorage.getItem(CART_STORAGE_KEY);
      if (!raw) return setCartCount(0);
      const items = JSON.parse(raw)?.items ?? [];
      setCartCount(items.reduce((s, i) => s + (i.qty || 1), 0));
    } catch {
      setCartCount(0);
    }
  };

  useEffect(() => {
    refreshCartCount();
    window.addEventListener("storage", refreshCartCount);
    window.addEventListener("cart:updated", refreshCartCount);
    return () => {
      window.removeEventListener("storage", refreshCartCount);
      window.removeEventListener("cart:updated", refreshCartCount);
    };
  }, []);

  useEffect(() => {
    setOpenMenu(false);
    setOpenProfile(false);
    setOpenCats(false);
  }, [pageUrl]);

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Catalog", href: "/catalog" },
    { label: "Shop", href: "/shop" },
    { label: "Get a Quote", href: "/quote" },
    { label: "Photography", href: "/photography" },
    { label: "Portfolio", href: "/portfolio" },
    { label: "Contact", href: "/contact" },
  ];

  const categories = [
    { label: "Wedding", value: "Wedding" },
    { label: "Birthday", value: "Birthday" },
    { label: "Corporate", value: "Corporate" },
    { label: "Mehndi / Nikkah", value: "Mehndi" },
    { label: "Stage & Backdrops", value: "Backdrops" },
  ];

  const ActionBtn =
    "inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-white/10 transition";

  return (
    <div className={theme === "dark" ? "dark" : ""}>
      <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100">

        {/* ================= HEADER ================= */}
        <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur border-b">
          <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
            <Link href="/" className="font-semibold">{brand}</Link>

            <nav className="hidden lg:flex gap-2">
              {navLinks.map(l => (
                <Link key={l.href} href={l.href}
                  className={`px-3 py-2 rounded-xl text-sm ${pageUrl === l.href ? "bg-black text-white" : "hover:bg-slate-100 dark:hover:bg-white/10"}`}>
                  {l.label}
                </Link>
              ))}
            </nav>

            <div className="flex gap-2">
              <Link href="/cart" className={ActionBtn}>
                🛒
                {cartCount > 0 && <span className="ml-1 text-xs">{cartCount}</span>}
              </Link>

              <button onClick={toggleTheme} className={ActionBtn}>
                {theme === "dark" ? "☀" : "🌙"}
              </button>
            </div>
          </div>
        </header>

        {/* ================= HOME HERO ONLY ================= */}
        {isHome && (
          <section className="max-w-7xl mx-auto px-6 mt-6">
            <div
              className="rounded-3xl overflow-hidden border bg-cover bg-center"
              style={{ backgroundImage: "url(/images/hero/wedding.jpg)" }}
            >
              <div className="bg-black/40 p-10">
                <h1 className="text-4xl font-bold text-white">
                  Luxury Wedding & Event Décor Rentals
                </h1>
                <p className="mt-3 text-white/80">
                  Browse rentals, check availability, and get a quote in minutes.
                </p>
                <div className="mt-6 flex gap-3">
                  <Link href="/shop" className="px-4 py-2 bg-white rounded-xl">Shop Now</Link>
                  <Link href="/quote" className="px-4 py-2 bg-white/20 text-white rounded-xl">Get Quote</Link>
                </div>
              </div>
            </div>

            {/* Home-only quick filters */}
            <div className="mt-4 flex gap-2 flex-wrap">
              <Link href="/shop" className="chip">All</Link>
              {categories.map(c => (
                <Link key={c.value} href={`/shop?category=${c.value}`} className="chip">
                  {c.label}
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* ================= PAGE CONTENT ================= */}
        <main className="max-w-7xl mx-auto px-6 py-10">
          {children}
        </main>

        {/* ================= FOOTER ================= */}
        <footer className="bg-slate-950 text-slate-400 text-center py-10">
          © {new Date().getFullYear()} {brand}
        </footer>

      </div>
    </div>
  );
}
