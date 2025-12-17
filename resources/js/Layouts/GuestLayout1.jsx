import React, { useEffect, useMemo, useState } from "react";
import { Link, usePage } from "@inertiajs/react";
import { useTheme } from "@/Context/ThemeContext";

/**
 * GuestLayout (Public)
 * - Full-width layout
 * - Modern header/nav + cart badge
 * - ✅ Adds Profile dropdown (Login/Profile/Logout)
 * - Taller multi-column footer
 */

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

    const [openMenu, setOpenMenu] = useState(false);
    const [openProfile, setOpenProfile] = useState(false);

    // Inertia page object (safe)
    const page = usePage?.();
    const pageUrl =
        page?.url ??
        (typeof window !== "undefined" ? window.location.pathname : "/");

    const authUser = page?.props?.auth?.user ?? null;

    // --- Cart badge (client-side) ---
    const CART_STORAGE_KEY = "cart";
    const [cartCount, setCartCount] = useState(0);

    const computeCartCount = () => {
        if (typeof window === "undefined") return 0;
        try {
            const raw = window.localStorage.getItem(CART_STORAGE_KEY);
            if (!raw) return 0;

            const data = JSON.parse(raw);
            const items = Array.isArray(data)
                ? data
                : Array.isArray(data?.items)
                ? data.items
                : Array.isArray(data?.lines)
                ? data.lines
                : [];

            const qtySum = items.reduce((sum, it) => sum + (Number(it?.qty) || 0), 0);
            return qtySum > 0 ? qtySum : items.length;
        } catch {
            return 0;
        }
    };

    useEffect(() => {
        setCartCount(computeCartCount());
        if (typeof window === "undefined") return;

        const onStorage = (e) => {
            if (e.key === CART_STORAGE_KEY) setCartCount(computeCartCount());
        };
        const onFocus = () => setCartCount(computeCartCount());

        window.addEventListener("storage", onStorage);
        window.addEventListener("focus", onFocus);
        return () => {
            window.removeEventListener("storage", onStorage);
            window.removeEventListener("focus", onFocus);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Close mobile menu when route changes
    useEffect(() => {
        setOpenMenu(false);
        setOpenProfile(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pageUrl]);

    // Close dropdown when clicking outside
    useEffect(() => {
        if (!openProfile) return;
        const onDown = (e) => {
            const el = document.getElementById("guest-profile-dropdown");
            const btn = document.getElementById("guest-profile-button");
            if (!el || !btn) return;
            if (el.contains(e.target) || btn.contains(e.target)) return;
            setOpenProfile(false);
        };
        window.addEventListener("mousedown", onDown);
        return () => window.removeEventListener("mousedown", onDown);
    }, [openProfile]);

    const brand = tenant?.name ?? "Harbour Decor Rentals";

    const isActive = (href) => {
        if (!href) return false;
        if (href === "/") return pageUrl === "/";
        return pageUrl.startsWith(href);
    };

    const navLinks = useMemo(
        () => [
            { label: "Home", href: "/" },
            { label: "Catalog", href: "/catalog" },
            { label: "Shop", href: "/shop" },
            { label: "Get a Quote", href: "/quote" },
            { label: "Photography", href: "/photography" },
            { label: "Portfolio", href: "/portfolio" },
            { label: "Contact", href: "/contact" },
        ],
        []
    );

    // Auth routes (Breeze)
    const loginHref = safeRoute("login") ?? "/login";
    const registerHref = safeRoute("register"); // may be null if disabled
    const dashboardHref = safeRoute("dashboard") ?? "/dashboard";
    const profileHref = safeRoute("profile.edit") ?? "/profile";
    const logoutHref = safeRoute("logout"); // POST

    return (
        <div className={theme === "dark" ? "dark" : ""}>
            <div className="min-h-screen w-full bg-gradient-to-b from-slate-50 to-white text-slate-900 dark:from-slate-950 dark:to-slate-900 dark:text-slate-100 transition-colors">
                {/* HEADER */}
                <header className="sticky top-0 z-50 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur">
                    <div className="w-full px-4 sm:px-6 py-3 flex items-center justify-between">
                        {/* Brand */}
                        <Link href="/" className="flex items-center gap-3 hover:opacity-95">
                            <div className="h-9 w-9 rounded-2xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 grid place-items-center shadow-sm">
                                <span className="text-sm font-bold">HD</span>
                            </div>
                            <div className="leading-tight">
                                <div className="text-base sm:text-lg font-semibold tracking-tight">
                                    {brand}
                                </div>
                                <div className="text-xs text-slate-500 dark:text-slate-400">
                                    Event décor rentals
                                </div>
                            </div>
                        </Link>

                        {/* Desktop navigation */}
                        <nav className="hidden md:flex items-center gap-2">
                            {navLinks.map((l) => (
                                <Link
                                    key={l.href}
                                    href={l.href}
                                    className={
                                        "px-3 py-2 rounded-xl text-sm transition " +
                                        (isActive(l.href)
                                            ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                                            : "text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-white/10")
                                    }
                                >
                                    {l.label}
                                </Link>
                            ))}
                        </nav>

                        {/* Actions */}
                        <div className="flex items-center gap-2 relative">
                            {/* Cart */}
                            <Link
                                href="/cart"
                                className="relative inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-white/10 transition"
                                aria-label="Open cart"
                            >
                                <span className="text-sm">🛒</span>
                                <span className="hidden sm:inline text-sm">Cart</span>

                                {cartCount > 0 && (
                                    <span className="absolute -top-2 -right-2 min-w-5 h-5 px-1 rounded-full bg-indigo-600 text-white text-[11px] font-semibold grid place-items-center shadow">
                                        {cartCount > 99 ? "99+" : cartCount}
                                    </span>
                                )}
                            </Link>

                            {/* Theme */}
                            <button
                                type="button"
                                onClick={toggleTheme}
                                className="px-3 py-2 rounded-xl text-sm border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-white/10 transition"
                                aria-label="Toggle theme"
                            >
                                {theme === "dark" ? "☀ Light" : "🌙 Dark"}
                            </button>

                            {/* ✅ Profile dropdown */}
                            <div className="relative hidden md:block">
                                <button
                                    id="guest-profile-button"
                                    type="button"
                                    onClick={() => setOpenProfile((v) => !v)}
                                    className="inline-flex items-center gap-2 px-3 py-2 rounded-xl text-sm border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-white/10 transition"
                                    aria-label="Open profile menu"
                                >
                                    <span className="text-sm">👤</span>
                                    <span className="hidden lg:inline">
                                        {authUser ? (authUser.name ?? "Account") : "Login"}
                                    </span>
                                    <span className="text-xs opacity-70">▾</span>
                                </button>

                                {openProfile && (
                                    <div
                                        id="guest-profile-dropdown"
                                        className="absolute right-0 top-full mt-2 w-56 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl overflow-hidden"
                                    >
                                        <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-800">
                                            <div className="text-sm font-semibold">
                                                {authUser ? "Your account" : "Welcome"}
                                            </div>
                                            <div className="text-xs text-slate-500 dark:text-slate-400">
                                                {authUser ? authUser.email : "Sign in to manage admin features"}
                                            </div>
                                        </div>

                                        <div className="p-2">
                                            <Link
                                                href="/catalog"
                                                className="block px-3 py-2 rounded-xl text-sm hover:bg-slate-100 dark:hover:bg-white/10 transition"
                                                onClick={() => setOpenProfile(false)}
                                            >
                                                Browse Catalog
                                            </Link>

                                            {authUser ? (
                                                <>
                                                    <Link
                                                        href={dashboardHref}
                                                        className="block px-3 py-2 rounded-xl text-sm hover:bg-slate-100 dark:hover:bg-white/10 transition"
                                                        onClick={() => setOpenProfile(false)}
                                                    >
                                                        Dashboard
                                                    </Link>

                                                    <Link
                                                        href={profileHref}
                                                        className="block px-3 py-2 rounded-xl text-sm hover:bg-slate-100 dark:hover:bg-white/10 transition"
                                                        onClick={() => setOpenProfile(false)}
                                                    >
                                                        Profile
                                                    </Link>

                                                    {logoutHref ? (
                                                        <Link
                                                            href={logoutHref}
                                                            method="post"
                                                            as="button"
                                                            className="w-full text-left px-3 py-2 rounded-xl text-sm hover:bg-slate-100 dark:hover:bg-white/10 transition"
                                                            onClick={() => setOpenProfile(false)}
                                                        >
                                                            Logout
                                                        </Link>
                                                    ) : (
                                                        <Link
                                                            href="/logout"
                                                            className="block px-3 py-2 rounded-xl text-sm hover:bg-slate-100 dark:hover:bg-white/10 transition"
                                                            onClick={() => setOpenProfile(false)}
                                                        >
                                                            Logout
                                                        </Link>
                                                    )}
                                                </>
                                            ) : (
                                                <>
                                                    <Link
                                                        href={loginHref}
                                                        className="block px-3 py-2 rounded-xl text-sm hover:bg-slate-100 dark:hover:bg-white/10 transition"
                                                        onClick={() => setOpenProfile(false)}
                                                    >
                                                        Login
                                                    </Link>

                                                    {registerHref && (
                                                        <Link
                                                            href={registerHref}
                                                            className="block px-3 py-2 rounded-xl text-sm hover:bg-slate-100 dark:hover:bg-white/10 transition"
                                                            onClick={() => setOpenProfile(false)}
                                                        >
                                                            Register
                                                        </Link>
                                                    )}
                                                </>
                                            )}

                                            <button
                                                type="button"
                                                onClick={() => {
                                                    toggleTheme();
                                                    setOpenProfile(false);
                                                }}
                                                className="w-full text-left px-3 py-2 rounded-xl text-sm hover:bg-slate-100 dark:hover:bg-white/10 transition"
                                            >
                                                Theme:{" "}
                                                <span className="font-semibold">
                                                    {theme === "dark" ? "Dark" : "Light"}
                                                </span>
                                            </button>

                                            <a
                                                href="mailto:info@harbourdecor.com"
                                                className="block px-3 py-2 rounded-xl text-sm hover:bg-slate-100 dark:hover:bg-white/10 transition"
                                                onClick={() => setOpenProfile(false)}
                                            >
                                                Contact
                                            </a>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Mobile menu */}
                            <button
                                type="button"
                                onClick={() => setOpenMenu((v) => !v)}
                                className="md:hidden px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-white/10 transition"
                                aria-label="Open menu"
                            >
                                ☰
                            </button>

                            {openMenu && (
                                <div className="absolute right-0 top-full mt-2 w-72 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl overflow-hidden md:hidden">
                                    <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-800">
                                        <div className="text-sm font-semibold">Menu</div>
                                        <div className="text-xs text-slate-500 dark:text-slate-400">
                                            {authUser ? `Signed in as ${authUser.email}` : "Quick links"}
                                        </div>
                                    </div>

                                    <div className="p-2">
                                        {navLinks.map((l) => (
                                            <Link
                                                key={l.href}
                                                href={l.href}
                                                className="block px-3 py-2 rounded-xl text-sm hover:bg-slate-100 dark:hover:bg-white/10 transition"
                                            >
                                                {l.label}
                                            </Link>
                                        ))}

                                        <Link
                                            href="/cart"
                                            className="flex items-center justify-between px-3 py-2 rounded-xl text-sm hover:bg-slate-100 dark:hover:bg-white/10 transition"
                                        >
                                            <span>Cart</span>
                                            <span className="text-xs opacity-70">
                                                {cartCount > 0 ? cartCount : ""}
                                            </span>
                                        </Link>

                                        <div className="my-2 border-t border-slate-200 dark:border-slate-800" />

                                        {authUser ? (
                                            <>
                                                <Link
                                                    href={dashboardHref}
                                                    className="block px-3 py-2 rounded-xl text-sm hover:bg-slate-100 dark:hover:bg-white/10 transition"
                                                >
                                                    Dashboard
                                                </Link>
                                                <Link
                                                    href={profileHref}
                                                    className="block px-3 py-2 rounded-xl text-sm hover:bg-slate-100 dark:hover:bg-white/10 transition"
                                                >
                                                    Profile
                                                </Link>
                                                {logoutHref ? (
                                                    <Link
                                                        href={logoutHref}
                                                        method="post"
                                                        as="button"
                                                        className="w-full text-left px-3 py-2 rounded-xl text-sm hover:bg-slate-100 dark:hover:bg-white/10 transition"
                                                    >
                                                        Logout
                                                    </Link>
                                                ) : (
                                                    <Link
                                                        href="/logout"
                                                        className="block px-3 py-2 rounded-xl text-sm hover:bg-slate-100 dark:hover:bg-white/10 transition"
                                                    >
                                                        Logout
                                                    </Link>
                                                )}
                                            </>
                                        ) : (
                                            <>
                                                <Link
                                                    href={loginHref}
                                                    className="block px-3 py-2 rounded-xl text-sm hover:bg-slate-100 dark:hover:bg-white/10 transition"
                                                >
                                                    Login
                                                </Link>
                                                {registerHref && (
                                                    <Link
                                                        href={registerHref}
                                                        className="block px-3 py-2 rounded-xl text-sm hover:bg-slate-100 dark:hover:bg-white/10 transition"
                                                    >
                                                        Register
                                                    </Link>
                                                )}
                                            </>
                                        )}

                                        <button
                                            type="button"
                                            onClick={toggleTheme}
                                            className="w-full text-left px-3 py-2 rounded-xl text-sm hover:bg-slate-100 dark:hover:bg-white/10 transition"
                                        >
                                            Theme:{" "}
                                            <span className="font-semibold">
                                                {theme === "dark" ? "Dark" : "Light"}
                                            </span>
                                        </button>

                                        <a
                                            href="mailto:info@harbourdecor.com"
                                            className="block px-3 py-2 rounded-xl text-sm hover:bg-slate-100 dark:hover:bg-white/10 transition"
                                        >
                                            Contact
                                        </a>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                {/* PAGE CONTENT */}
                <main className="w-full px-4 sm:px-6 py-6">{children}</main>

                {/* FOOTER */}
                <footer className="mt-20 bg-slate-950 text-slate-300">
                    {/* Top */}
                    <div className="w-full px-6 sm:px-10 py-16 grid gap-12 md:grid-cols-4">
                        {/* Brand */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-2xl bg-white text-slate-900 grid place-items-center font-bold">
                                    HD
                                </div>
                                <div>
                                    <div className="font-semibold text-white">{brand}</div>
                                    <div className="text-xs text-slate-400">
                                        Event décor rentals
                                    </div>
                                </div>
                            </div>

                            <p className="text-sm text-slate-400 max-w-xs leading-relaxed">
                                Luxury event décor, rentals, and styling for weddings, cultural
                                celebrations, and milestone events across Canada.
                            </p>
                        </div>

                        {/* Explore */}
                        <div>
                            <h4 className="text-sm font-semibold text-white mb-4 tracking-wide">
                                Explore
                            </h4>
                            <ul className="space-y-2 text-sm">
                                <li><Link href="/" className="hover:text-white">Home</Link></li>
                                <li><Link href="/catalog" className="hover:text-white">Catalog</Link></li>
                                <li><Link href="/shop" className="hover:text-white">Shop</Link></li>
                                <li><Link href="/quote" className="hover:text-white">Get a Quote</Link></li>
                            </ul>
                        </div>

                        {/* Services */}
                        <div>
                            <h4 className="text-sm font-semibold text-white mb-4 tracking-wide">
                                Services
                            </h4>
                            <ul className="space-y-2 text-sm text-slate-400">
                                <li>Wedding Décor</li>
                                <li>Event Rentals</li>
                                <li>Stage & Backdrops</li>
                                <li>Setup & Teardown</li>
                            </ul>
                        </div>

                        {/* Contact */}
                        <div>
                            <h4 className="text-sm font-semibold text-white mb-4 tracking-wide">
                                Contact
                            </h4>
                            <ul className="space-y-2 text-sm">
                                <li className="text-slate-400">Ontario, Canada</li>
                                <li>
                                    <a href="mailto:info@harbourdecor.com" className="hover:text-white">
                                        info@harbourdecor.com
                                    </a>
                                </li>

                                <li className="flex gap-3 pt-3 text-lg">
                                    <a href="#" className="hover:text-white" aria-label="Instagram">📷</a>
                                    <a href="#" className="hover:text-white" aria-label="Facebook">📘</a>
                                    <a href="#" className="hover:text-white" aria-label="WhatsApp">💬</a>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Bottom */}
                    <div className="border-t border-slate-800 py-8 text-center text-sm text-slate-400">
                        © 2025 {brand}. All rights reserved.
                    </div>
                </footer>
            </div>
        </div>
    );
}