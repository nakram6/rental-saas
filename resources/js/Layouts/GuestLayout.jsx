import React, { useState } from "react";
import { Link } from "@inertiajs/react";
import { useTheme } from "@/Context/ThemeContext";

export default function GuestLayout({ tenant, children }) {
    const { theme, toggleTheme } = useTheme();
    const [openProfile, setOpenProfile] = useState(false);

    return (
        <div className={theme === "dark" ? "dark" : ""}>
            <div className="min-h-screen bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100 transition-colors">
                
                {/* HEADER */}
                <header className="sticky top-0 z-50 border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-950/90 backdrop-blur">
                    <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
                        
                        {/* Brand */}
                        <Link href="/" className="font-semibold tracking-wide">
                            {tenant?.name ?? "Harbour Decor"}
                        </Link>

                        {/* Right actions */}
                        <div className="relative">
                            <button
                                type="button"
                                onClick={() => setOpenProfile((s) => !s)}
                                className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-white/10"
                            >
                                <span className="text-sm">Profile</span>
                                <span className="text-xs">▾</span>
                            </button>

                            {/* Profile dropdown */}
                            {openProfile && (
                                <div
                                    className="absolute right-0 mt-2 w-48 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-lg overflow-hidden"
                                >
                                    <Link
                                        href="/catalog"
                                        className="block px-4 py-2 text-sm hover:bg-slate-100 dark:hover:bg-white/10"
                                    >
                                        Browse Catalog
                                    </Link>

                                    <button
                                        type="button"
                                        onClick={() => {
                                            toggleTheme();
                                            setOpenProfile(false);
                                        }}
                                        className="w-full text-left px-4 py-2 text-sm hover:bg-slate-100 dark:hover:bg-white/10"
                                    >
                                        Theme:{" "}
                                        <span className="font-semibold">
                                            {theme === "dark" ? "Dark" : "Light"}
                                        </span>
                                    </button>

                                    <a
                                        href="mailto:info@harbourdecor.com"
                                        className="block px-4 py-2 text-sm hover:bg-slate-100 dark:hover:bg-white/10"
                                    >
                                        Contact
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                {/* PAGE */}
                <main>{children}</main>
            </div>
        </div>
    );
}
