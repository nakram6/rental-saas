import ApplicationLogo from "@/Components/ApplicationLogo";
import Dropdown from "@/Components/Dropdown";
import NavLink from "@/Components/NavLink";
import ResponsiveNavLink from "@/Components/ResponsiveNavLink";
import { Link, usePage } from "@inertiajs/react";
import { useMemo, useState } from "react";
import { useTheme } from "@/Context/ThemeContext";

/**
 * Safe helpers so your layout does NOT crash if a route doesn't exist yet.
 * When you create the route later, the link will start working automatically.
 */
function safeHref(name, params = {}) {
    try {
        if (route().has(name)) return route(name, params);
        return "#";
    } catch {
        return "#";
    }
}

function hasRoute(name) {
    try {
        return route().has(name);
    } catch {
        return false;
    }
}

function isActive(pattern) {
    try {
        return route().current(pattern);
    } catch {
        return false;
    }
}

/**
 * A cleaner sidebar link that supports disabled state + theme styling.
 */
function SideNavLink({ href, active, children, theme, onClick, isButton = false, disabled = false }) {
    const isDark = theme !== "light";

    const base =
        "flex items-center gap-2 px-3 py-2 text-sm rounded-xl mb-1 transition w-full text-left select-none ";

    const activeCls = isDark
        ? "bg-white/10 text-amber-200 font-semibold ring-1 ring-white/10"
        : "bg-gray-900 text-white font-semibold";

    const idleCls = isDark
        ? "text-slate-200 hover:bg-white/5"
        : "text-gray-700 hover:bg-gray-100";

    const disabledCls = disabled ? "opacity-45 cursor-not-allowed pointer-events-none" : "";

    const cls = base + (active ? activeCls : idleCls) + " " + disabledCls;

    if (isButton) {
        return (
            <button type="button" onClick={onClick} className={cls} disabled={disabled}>
                {children}
            </button>
        );
    }

    return (
        <Link
            href={disabled ? "#" : href}
            className={cls}
            onClick={(e) => {
                if (disabled) e.preventDefault();
            }}
        >
            {children}
        </Link>
    );
}

function SidebarGroup({ title, icon, theme, open, onToggle, children }) {
    const isDark = theme !== "light";

    return (
        <div className="mb-2">
            <button
                type="button"
                onClick={onToggle}
                className={
                    "w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm transition " +
                    (isDark ? "text-slate-100 hover:bg-white/5" : "text-gray-800 hover:bg-gray-100")
                }
            >
                <span className="flex items-center gap-2">
                    <span className="text-lg">{icon}</span>
                    <span className="font-semibold">{title}</span>
                </span>

                <span
                    className={
                        "text-xs opacity-70 transition-transform " + (open ? "rotate-90" : "")
                    }
                >
                    ▶
                </span>
            </button>

            {open && <div className="mt-1 pl-2">{children}</div>}
        </div>
    );
}

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth?.user;
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);

    const { theme, setTheme } = useTheme();

    // Theme config (layout-level)
    const themeConfig = {
        light: {
            root: "bg-gray-100 text-gray-900",
            nav: "bg-white border-gray-200",
            sidebar: "bg-white border-gray-200",
            header: "bg-white",
            card: "bg-white border-gray-200",
            subtleText: "text-gray-500",
            mobilePanel: "bg-white border-gray-200",
        },
        dark: {
            root: "bg-slate-950 text-slate-50",
            nav: "bg-slate-900 border-slate-800",
            sidebar: "bg-slate-950 border-slate-800",
            header: "bg-slate-900",
            card: "bg-slate-900 border-slate-800",
            subtleText: "text-slate-400",
            mobilePanel: "bg-slate-900 border-slate-800",
        },
        gold: {
            root: "bg-[#020617] text-amber-50",
            nav: "bg-[#020617] border-slate-800",
            sidebar: "bg-[#020617] border-slate-800",
            header: "bg-[#020617]",
            card: "bg-[#071027] border-slate-800",
            subtleText: "text-amber-200/60",
            mobilePanel: "bg-[#020617] border-slate-800",
        },
    };

    const t = themeConfig[theme] ?? themeConfig.dark;

    /**
     * Default open state: open any group if a route inside it is active.
     * (This runs once because useMemo has no deps)
     */
    const defaultOpen = useMemo(() => {
        return {
            planner: isActive("planner") || isActive("decor-library.*") || isActive("layouts.*"),
            inventory: isActive("items.*") || isActive("categories.*") || isActive("maintenance.*"),
            bookings:
                isActive("bookings.*") ||
                isActive("calendar.*") ||
                isActive("quotes.*") ||
                isActive("returns.*"),
            rentals: isActive("rentals.*") || isActive("due.*") || isActive("overdue.*"),
            customers: isActive("customers.*"),
            reports: isActive("reports.*"),
            accounting:
                isActive("accounting.invoices.*") ||
                isActive("accounting.general-ledger") ||
                isActive("accounting.trial-balance") ||
                isActive("accounting.journal-entries.*") ||
                isActive("accounting.*"),
            settings: isActive("settings.*") || isActive("team.*") || isActive("branding.*"),
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const [openGroups, setOpenGroups] = useState(defaultOpen);

    const toggleGroup = (key) => {
        setOpenGroups((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    // Small helper for top nav button styles
    const themePill = (key) => {
        const active = theme === key;
        if (key === "light") {
            return active
                ? "bg-gray-900 text-white border-gray-900"
                : "bg-transparent text-gray-500 border-gray-300 hover:bg-gray-50";
        }
        if (key === "dark") {
            return active
                ? "bg-slate-800 text-white border-slate-600"
                : "bg-transparent text-slate-400 border-slate-600/50 hover:bg-white/5";
        }
        // gold
        return active
            ? "bg-amber-400 text-slate-900 border-amber-500"
            : "bg-transparent text-amber-200/70 border-amber-200/30 hover:bg-white/5";
    };

    return (
        <div className={`min-h-screen flex flex-col ${t.root}`}>
            {/* TOP NAV */}
            <nav className={`border-b ${t.nav}`}>
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 justify-between items-center">
                        {/* Left */}
                        <div className="flex items-center gap-4">
                            <Link href={safeHref("home")} className="flex items-center gap-2">
                                <ApplicationLogo className="block h-9 w-auto fill-current" />
                                <span className={`hidden md:inline text-sm font-semibold ${t.subtleText}`}>
                                    Harbour Decor Rentals
                                </span>
                            </Link>

                            {/* Desktop Top Nav */}
                            <div className="hidden sm:flex items-center gap-1">
                                <NavLink href={safeHref("dashboard")} active={isActive("dashboard")}>
                                    Dashboard
                                </NavLink>

                                <NavLink href={safeHref("items.index")} active={isActive("items.*")}>
                                    Items
                                </NavLink>

                                <NavLink href={safeHref("planner")} active={isActive("planner")}>
                                    Planner
                                </NavLink>

                                <NavLink href={safeHref("bookings.index")} active={isActive("bookings.*")}>
                                    Bookings
                                </NavLink>

                                <NavLink href={safeHref("customers.index")} active={isActive("customers.*")}>
                                    Customers
                                </NavLink>

                                <NavLink href={safeHref("reports.index")} active={isActive("reports.*")}>
                                    Reports
                                </NavLink>

                                {/* Accounting shortcuts (safe) */}
                                <NavLink
                                    href={safeHref("accounting.invoices.index")}
                                    active={isActive("accounting.invoices.*")}
                                >
                                    Invoices
                                </NavLink>

                                <NavLink
                                    href={safeHref("accounting.general-ledger")}
                                    active={isActive("accounting.general-ledger")}
                                >
                                    Ledger
                                </NavLink>

                                <NavLink
                                    href={safeHref("accounting.trial-balance")}
                                    active={isActive("accounting.trial-balance")}
                                >
                                    Trial Balance
                                </NavLink>
                            </div>
                        </div>

                        {/* Right */}
                        <div className="hidden sm:flex items-center gap-3">
                            {/* Theme Switcher */}
                            <div className="flex items-center gap-1 text-xs">
                                <button
                                    type="button"
                                    onClick={() => setTheme("light")}
                                    className={`px-2 py-1 rounded-full border transition ${themePill("light")}`}
                                >
                                    Light
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setTheme("dark")}
                                    className={`px-2 py-1 rounded-full border transition ${themePill("dark")}`}
                                >
                                    Dark
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setTheme("gold")}
                                    className={`px-2 py-1 rounded-full border transition ${themePill("gold")}`}
                                >
                                    Gold
                                </button>
                            </div>

                            {/* User Dropdown */}
                            <div className="relative ms-2">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <span className="inline-flex rounded-md">
                                            <button
                                                type="button"
                                                className={
                                                    "inline-flex items-center rounded-xl border border-transparent " +
                                                    "bg-white/80 dark:bg-white/10 px-3 py-2 text-sm font-medium " +
                                                    "leading-4 transition hover:opacity-90 focus:outline-none"
                                                }
                                            >
                                                {user?.name ?? "User"}
                                                <svg
                                                    className="-me-0.5 ms-2 h-4 w-4"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M5.293 7.293a1 0 011.414 0L10 10.586l3.293-3.293a1 0 111.414 1.414l-4 4a1 0 01-1.414 0l-4-4a1 0 010-1.414z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </button>
                                        </span>
                                    </Dropdown.Trigger>

                                    <Dropdown.Content>
                                        <Dropdown.Link href={safeHref("profile.edit")}>Profile</Dropdown.Link>
                                        <Dropdown.Link href={safeHref("logout")} method="post" as="button">
                                            Log Out
                                        </Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>

                        {/* Mobile burger */}
                        <div className="sm:hidden">
                            <button
                                onClick={() => setShowingNavigationDropdown((p) => !p)}
                                className="inline-flex items-center justify-center rounded-xl p-2 transition hover:bg-black/5 dark:hover:bg-white/5"
                            >
                                <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                                    <path
                                        className={!showingNavigationDropdown ? "inline-flex" : "hidden"}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                    <path
                                        className={showingNavigationDropdown ? "inline-flex" : "hidden"}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* MOBILE PANEL */}
                <div className={(showingNavigationDropdown ? "block" : "hidden") + " sm:hidden"}>
                    <div className={`border-t ${t.mobilePanel}`}>
                        <div className="px-4 pt-3 pb-2">
                            <div className="text-base font-semibold">{user?.name ?? "User"}</div>
                            <div className={`text-sm ${t.subtleText}`}>{user?.email ?? ""}</div>

                            {/* Theme toggles on mobile */}
                            <div className="mt-3 flex items-center gap-2 text-xs">
                                <button
                                    type="button"
                                    onClick={() => setTheme("light")}
                                    className={`px-2 py-1 rounded-full border transition ${themePill("light")}`}
                                >
                                    Light
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setTheme("dark")}
                                    className={`px-2 py-1 rounded-full border transition ${themePill("dark")}`}
                                >
                                    Dark
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setTheme("gold")}
                                    className={`px-2 py-1 rounded-full border transition ${themePill("gold")}`}
                                >
                                    Gold
                                </button>
                            </div>
                        </div>

                        <div className="space-y-1 pb-3 pt-2 px-2">
                            <ResponsiveNavLink href={safeHref("dashboard")} active={isActive("dashboard")}>
                                Dashboard
                            </ResponsiveNavLink>
                            <ResponsiveNavLink href={safeHref("items.index")} active={isActive("items.*")}>
                                Items
                            </ResponsiveNavLink>
                            <ResponsiveNavLink href={safeHref("planner")} active={isActive("planner")}>
                                Planner
                            </ResponsiveNavLink>
                            <ResponsiveNavLink href={safeHref("bookings.index")} active={isActive("bookings.*")}>
                                Bookings
                            </ResponsiveNavLink>
                            <ResponsiveNavLink href={safeHref("customers.index")} active={isActive("customers.*")}>
                                Customers
                            </ResponsiveNavLink>
                            <ResponsiveNavLink href={safeHref("reports.index")} active={isActive("reports.*")}>
                                Reports
                            </ResponsiveNavLink>

                            {/* Accounting */}
                            <ResponsiveNavLink
                                href={safeHref("accounting.invoices.index")}
                                active={isActive("accounting.invoices.*")}
                            >
                                Invoices
                            </ResponsiveNavLink>
                            <ResponsiveNavLink
                                href={safeHref("accounting.general-ledger")}
                                active={isActive("accounting.general-ledger")}
                            >
                                General Ledger
                            </ResponsiveNavLink>
                            <ResponsiveNavLink
                                href={safeHref("accounting.trial-balance")}
                                active={isActive("accounting.trial-balance")}
                            >
                                Trial Balance
                            </ResponsiveNavLink>

                            <div className="border-t border-black/10 dark:border-white/10 my-2" />

                            <ResponsiveNavLink href={safeHref("profile.edit")}>Profile</ResponsiveNavLink>
                            <ResponsiveNavLink method="post" href={safeHref("logout")} as="button">
                                Log Out
                            </ResponsiveNavLink>
                        </div>
                    </div>
                </div>
            </nav>

            {/* MAIN LAYOUT */}
            <div className="flex flex-1">
                {/* Sidebar */}
                <aside className={`hidden md:block w-72 min-h-[calc(100vh-4rem)] pt-6 border-r ${t.sidebar}`}>
                    <div className="px-4">
                        <div className="flex items-center justify-between">
                            <div className={`text-xs font-semibold uppercase tracking-wide ${t.subtleText}`}>
                                Admin Navigation
                            </div>
                            <div className="text-xs opacity-60">v1</div>
                        </div>

                        <div className="mt-4 rounded-2xl border p-3 shadow-sm" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                            <div className="text-sm font-semibold">{user?.name ?? "User"}</div>
                            <div className={`text-xs ${t.subtleText}`}>Tenant #{user?.tenant_id ?? "-"}</div>
                        </div>
                    </div>

                    <nav className="px-3 mt-4">
                        {/* Dashboard */}
                        <SideNavLink href={safeHref("dashboard")} active={isActive("dashboard")} theme={theme}>
                            <span className="text-lg">📊</span>
                            <span>Dashboard</span>
                        </SideNavLink>

                        {/* Planner */}
                        <SidebarGroup
                            title="Planner"
                            icon="🛋️"
                            theme={theme}
                            open={openGroups.planner}
                            onToggle={() => toggleGroup("planner")}
                        >
                            <SideNavLink href={safeHref("planner")} active={isActive("planner")} theme={theme}>
                                <span>•</span>
                                <span>Decoration Planner</span>
                            </SideNavLink>

                            <SideNavLink
                                href={safeHref("decor-library.index")}
                                active={isActive("decor-library.*")}
                                theme={theme}
                                disabled={!hasRoute("decor-library.index")}
                            >
                                <span>•</span>
                                <span>Decor Library</span>
                            </SideNavLink>

                            <SideNavLink
                                href={safeHref("layouts.index")}
                                active={isActive("layouts.*")}
                                theme={theme}
                                disabled={!hasRoute("layouts.index")}
                            >
                                <span>•</span>
                                <span>Saved Layouts</span>
                            </SideNavLink>
                        </SidebarGroup>

                        {/* Inventory */}
                        <SidebarGroup
                            title="Inventory"
                            icon="📦"
                            theme={theme}
                            open={openGroups.inventory}
                            onToggle={() => toggleGroup("inventory")}
                        >
                            <SideNavLink href={safeHref("items.index")} active={isActive("items.*")} theme={theme}>
                                <span>•</span>
                                <span>Items</span>
                            </SideNavLink>

                            <SideNavLink
                                href={safeHref("categories.index")}
                                active={isActive("categories.*")}
                                theme={theme}
                                disabled={!hasRoute("categories.index")}
                            >
                                <span>•</span>
                                <span>Categories / Tags</span>
                            </SideNavLink>

                            <SideNavLink
                                href={safeHref("maintenance.index")}
                                active={isActive("maintenance.*")}
                                theme={theme}
                                disabled={!hasRoute("maintenance.index")}
                            >
                                <span>•</span>
                                <span>Maintenance</span>
                            </SideNavLink>
                        </SidebarGroup>

                        {/* Bookings */}
                        <SidebarGroup
                            title="Bookings"
                            icon="📅"
                            theme={theme}
                            open={openGroups.bookings}
                            onToggle={() => toggleGroup("bookings")}
                        >
                            <SideNavLink href={safeHref("bookings.index")} active={isActive("bookings.*")} theme={theme}>
                                <span>•</span>
                                <span>All Bookings</span>
                            </SideNavLink>

                            <SideNavLink
                                href={safeHref("calendar.index")}
                                active={isActive("calendar.*")}
                                theme={theme}
                                disabled={!hasRoute("calendar.index")}
                            >
                                <span>•</span>
                                <span>Calendar View</span>
                            </SideNavLink>

                            <SideNavLink
                                href={safeHref("quotes.index")}
                                active={isActive("quotes.*")}
                                theme={theme}
                                disabled={!hasRoute("quotes.index")}
                            >
                                <span>•</span>
                                <span>Quotes / Inquiries</span>
                            </SideNavLink>

                            <SideNavLink
                                href={safeHref("returns.index")}
                                active={isActive("returns.*")}
                                theme={theme}
                                disabled={!hasRoute("returns.index")}
                            >
                                <span>•</span>
                                <span>Returns</span>
                            </SideNavLink>
                        </SidebarGroup>

                        {/* Rentals */}
                        <SidebarGroup
                            title="Rentals"
                            icon="🚚"
                            theme={theme}
                            open={openGroups.rentals}
                            onToggle={() => toggleGroup("rentals")}
                        >
                            <SideNavLink
                                href={safeHref("rentals.onrent")}
                                active={isActive("rentals.onrent")}
                                theme={theme}
                                disabled={!hasRoute("rentals.onrent")}
                            >
                                <span>•</span>
                                <span>On Rent</span>
                            </SideNavLink>

                            <SideNavLink
                                href={safeHref("due.today")}
                                active={isActive("due.today")}
                                theme={theme}
                                disabled={!hasRoute("due.today")}
                            >
                                <span>•</span>
                                <span>Due Today</span>
                            </SideNavLink>

                            <SideNavLink
                                href={safeHref("overdue.index")}
                                active={isActive("overdue.*")}
                                theme={theme}
                                disabled={!hasRoute("overdue.index")}
                            >
                                <span>•</span>
                                <span>Overdue</span>
                            </SideNavLink>
                        </SidebarGroup>

                        {/* Customers */}
                        <SidebarGroup
                            title="Customers"
                            icon="👥"
                            theme={theme}
                            open={openGroups.customers}
                            onToggle={() => toggleGroup("customers")}
                        >
                            <SideNavLink
                                href={safeHref("customers.index")}
                                active={isActive("customers.*")}
                                theme={theme}
                                disabled={!hasRoute("customers.index")}
                            >
                                <span>•</span>
                                <span>Customers List</span>
                            </SideNavLink>

                            <SideNavLink
                                href={safeHref("customers.create")}
                                active={isActive("customers.create")}
                                theme={theme}
                                disabled={!hasRoute("customers.create")}
                            >
                                <span>•</span>
                                <span>Add Customer</span>
                            </SideNavLink>
                        </SidebarGroup>

                        {/* Reports */}
                        <SidebarGroup
                            title="Reports"
                            icon="📈"
                            theme={theme}
                            open={openGroups.reports}
                            onToggle={() => toggleGroup("reports")}
                        >
                            <SideNavLink
                                href={safeHref("reports.index")}
                                active={isActive("reports.index")}
                                theme={theme}
                                disabled={!hasRoute("reports.index")}
                            >
                                <span>•</span>
                                <span>Reports Home</span>
                            </SideNavLink>

                            <SideNavLink href={safeHref("reports.sales")} active={isActive("reports.sales")} theme={theme} disabled={!hasRoute("reports.sales")}>
                                <span>•</span><span>Sales</span>
                            </SideNavLink>

                            <SideNavLink href={safeHref("reports.customers")} active={isActive("reports.customers")} theme={theme} disabled={!hasRoute("reports.customers")}>
                                <span>•</span><span>Customers</span>
                            </SideNavLink>

                            <SideNavLink href={safeHref("reports.inventory")} active={isActive("reports.inventory")} theme={theme} disabled={!hasRoute("reports.inventory")}>
                                <span>•</span><span>Inventory</span>
                            </SideNavLink>

                            <SideNavLink href={safeHref("reports.bookings")} active={isActive("reports.bookings")} theme={theme} disabled={!hasRoute("reports.bookings")}>
                                <span>•</span><span>Bookings</span>
                            </SideNavLink>

                            <SideNavLink href={safeHref("reports.planner")} active={isActive("reports.planner")} theme={theme} disabled={!hasRoute("reports.planner")}>
                                <span>•</span><span>Planner</span>
                            </SideNavLink>

                            <SideNavLink href={safeHref("reports.overdue")} active={isActive("reports.overdue")} theme={theme} disabled={!hasRoute("reports.overdue")}>
                                <span>•</span><span>Overdue</span>
                            </SideNavLink>

                            <SideNavLink href={safeHref("reports.payments")} active={isActive("reports.payments")} theme={theme} disabled={!hasRoute("reports.payments")}>
                                <span>•</span><span>Payments</span>
                            </SideNavLink>

                            <SideNavLink href={safeHref("reports.utilization")} active={isActive("reports.utilization")} theme={theme} disabled={!hasRoute("reports.utilization")}>
                                <span>•</span><span>Utilization</span>
                            </SideNavLink>

                            <SideNavLink href={safeHref("reports.damaged")} active={isActive("reports.damaged")} theme={theme} disabled={!hasRoute("reports.damaged")}>
                                <span>•</span><span>Damaged / Loss</span>
                            </SideNavLink>

                            <SideNavLink href={safeHref("reports.maintenance")} active={isActive("reports.maintenance")} theme={theme} disabled={!hasRoute("reports.maintenance")}>
                                <span>•</span><span>Maintenance</span>
                            </SideNavLink>

                            <SideNavLink href={safeHref("reports.quotes")} active={isActive("reports.quotes")} theme={theme} disabled={!hasRoute("reports.quotes")}>
                                <span>•</span><span>Quotes</span>
                            </SideNavLink>

                            <SideNavLink href={safeHref("reports.catalog")} active={isActive("reports.catalog")} theme={theme} disabled={!hasRoute("reports.catalog")}>
                                <span>•</span><span>Item Catalog</span>
                            </SideNavLink>
                        </SidebarGroup>

                        {/* Accounting */}
                        <SidebarGroup
                            title="Accounting"
                            icon="🧾"
                            theme={theme}
                            open={openGroups.accounting}
                            onToggle={() => toggleGroup("accounting")}
                        >
                            <SideNavLink
                                href={safeHref("accounting.invoices.index")}
                                active={isActive("accounting.invoices.index")}
                                theme={theme}
                                disabled={!hasRoute("accounting.invoices.index")}
                            >
                                <span>•</span>
                                <span>Invoices</span>
                            </SideNavLink>

                            <SideNavLink
                                href={safeHref("accounting.invoices.create")}
                                active={isActive("accounting.invoices.create")}
                                theme={theme}
                                disabled={!hasRoute("accounting.invoices.create")}
                            >
                                <span>•</span>
                                <span>Create Invoice</span>
                            </SideNavLink>

                            <SideNavLink
                                href={safeHref("accounting.general-ledger")}
                                active={isActive("accounting.general-ledger")}
                                theme={theme}
                                disabled={!hasRoute("accounting.general-ledger")}
                            >
                                <span>•</span>
                                <span>General Ledger</span>
                            </SideNavLink>

                            <SideNavLink
                                href={safeHref("accounting.trial-balance")}
                                active={isActive("accounting.trial-balance")}
                                theme={theme}
                                disabled={!hasRoute("accounting.trial-balance")}
                            >
                                <span>•</span>
                                <span>Trial Balance</span>
                            </SideNavLink>

                            {/* Journal Entry detail route exists as "accounting.journal-entries.show" (if you added it) */}
                            <SideNavLink
                                href={safeHref("accounting.journal-entries.index")}
                                active={isActive("accounting.journal-entries.*")}
                                theme={theme}
                                disabled={!hasRoute("accounting.journal-entries.index")}
                            >
                                <span>•</span>
                                <span>Journal Entries</span>
                            </SideNavLink>
                        </SidebarGroup>

                        {/* Settings */}
                        <SidebarGroup
                            title="Settings"
                            icon="⚙️"
                            theme={theme}
                            open={openGroups.settings}
                            onToggle={() => toggleGroup("settings")}
                        >
                            <SideNavLink
                                href={safeHref("branding.index")}
                                active={isActive("branding.*")}
                                theme={theme}
                                disabled={!hasRoute("branding.index")}
                            >
                                <span>•</span>
                                <span>Branding</span>
                            </SideNavLink>

                            <SideNavLink
                                href={safeHref("team.index")}
                                active={isActive("team.*")}
                                theme={theme}
                                disabled={!hasRoute("team.index")}
                            >
                                <span>•</span>
                                <span>Team / Roles</span>
                            </SideNavLink>

                            <SideNavLink
                                href={safeHref("settings.rules")}
                                active={isActive("settings.rules")}
                                theme={theme}
                                disabled={!hasRoute("settings.rules")}
                            >
                                <span>•</span>
                                <span>Booking Rules</span>
                            </SideNavLink>
                        </SidebarGroup>
                    </nav>
                </aside>

                {/* Right side: header + main content */}
                <div className="flex-1 flex flex-col">
                    {header && (
                        <header className={`${t.header} shadow-sm`}>
                            <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">{header}</div>
                        </header>
                    )}

                    <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">{children}</main>
                </div>
            </div>
        </div>
    );
}
