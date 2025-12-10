// File: resources/js/Layouts/GuestLayout.jsx
import React, { useEffect, useState } from 'react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link, usePage } from '@inertiajs/react';

export default function GuestLayout({ children, tenant = null }) {
    const [quoteCount, setQuoteCount] = useState(0);
    const { url } = usePage();

    useEffect(() => {
        if (typeof window === 'undefined') return;
        try {
            const stored = JSON.parse(localStorage.getItem('quoteItems') ?? '[]');
            const total = stored.reduce((sum, item) => sum + (item.qty || 1), 0);
            setQuoteCount(total);
        } catch (e) {
            console.error(e);
        }
    }, []);

    if (!tenant) {
        return (
            <div className="flex min-h-screen flex-col items-center bg-gray-100 pt-6 sm:justify-center sm:pt-0">
                <div>
                    <Link href="/">
                        <ApplicationLogo className="h-20 w-20 fill-current text-gray-500" />
                    </Link>
                </div>

                <div className="mt-6 w-full overflow-hidden bg-white px-6 py-4 shadow-md sm:max-w-md sm:rounded-lg">
                    {children}
                </div>
            </div>
        );
    }

    const brandName = tenant?.name ?? 'Harbour Decor Rentals';
    const currentYear = new Date().getFullYear();

    const isActive = (path) => {
        if (path === '/') {
            return url === '/';
        }
        return url.startsWith(path);
    };

    const navLinkBase =
        'relative inline-flex items-center gap-1 px-1 pb-1 text-xs md:text-sm font-medium transition-colors';
    const navUnderlineBase =
        'absolute left-0 right-0 -bottom-0.5 h-[2px] rounded-full transition-transform origin-center';
    const navUnderlineInactive = 'scale-x-0 bg-amber-400/70';
    const navUnderlineActive = 'scale-x-100 bg-amber-400';

    return (
        <div className="min-h-screen flex flex-col bg-slate-950 text-slate-50">
            {/* HEADER */}
            <header className="sticky top-0 z-30 border-b border-slate-800 bg-slate-950/90 backdrop-blur shadow-md shadow-black/40">
                <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between flex-wrap gap-4">
                    {/* Logo / Brand */}
                    <Link href="/" className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-amber-500/10 border border-amber-500/40 flex items-center justify-center text-amber-400 font-semibold tracking-tight">
                            HD
                        </div>

                        <div className="leading-tight">
                            <div className="font-semibold tracking-wide text-sm md:text-base">
                                {brandName}
                            </div>
                            <div className="text-[11px] md:text-xs text-slate-400">
                                Luxury décor & event rentals
                            </div>
                        </div>
                    </Link>

                    {/* Nav */}
                    <nav className="flex items-center gap-5 text-slate-200">
                        <Link
                            href="/"
                            className={
                                navLinkBase +
                                ' ' +
                                (isActive('/')
                                    ? 'text-amber-300'
                                    : 'hover:text-amber-300')
                            }
                        >
                            <span>Home</span>
                            <span
                                className={
                                    navUnderlineBase +
                                    ' ' +
                                    (isActive('/')
                                        ? navUnderlineActive
                                        : navUnderlineInactive)
                                }
                            />
                        </Link>

                        <Link
                            href="/catalog"
                            className={
                                navLinkBase +
                                ' ' +
                                (isActive('/catalog')
                                    ? 'text-amber-300'
                                    : 'hover:text-amber-300')
                            }
                        >
                            <span>Catalog</span>
                            <span
                                className={
                                    navUnderlineBase +
                                    ' ' +
                                    (isActive('/catalog')
                                        ? navUnderlineActive
                                        : navUnderlineInactive)
                                }
                            />
                        </Link>

                        <Link
                            href="/quote"
                            className={
                                navLinkBase +
                                ' ' +
                                (isActive('/quote')
                                    ? 'text-amber-300'
                                    : 'hover:text-amber-300')
                            }
                        >
                            <span>Quote</span>
                            {quoteCount > 0 && (
                                <span
                                    className="
                                        inline-flex items-center justify-center
                                        min-w-[1.4rem] px-1.5
                                        text-[10px] font-semibold
                                        rounded-full
                                        bg-amber-500 text-slate-950
                                        shadow-sm
                                    "
                                >
                                    {quoteCount}
                                </span>
                            )}
                            <span
                                className={
                                    navUnderlineBase +
                                    ' ' +
                                    (isActive('/quote')
                                        ? navUnderlineActive
                                        : navUnderlineInactive)
                                }
                            />
                        </Link>

                        <Link
                            href="/login"
                            className="hidden sm:inline-flex items-center text-[11px] md:text-xs text-slate-400 hover:text-amber-300 transition-colors"
                        >
                            Admin Login
                        </Link>
                    </nav>
                </div>
            </header>

            {/* MAIN */}
            <main className="flex-1 bg-slate-950">
                {children}
            </main>

            {/* FOOTER */}
            <footer className="mt-10">
                {/* subtle gradient divider */}
                <div className="h-1 bg-gradient-to-r from-amber-500/40 via-transparent to-amber-500/40" />

                <div className="border-t border-slate-800 bg-slate-950/95 text-slate-300">
                    <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 sm:grid-cols-3 gap-8 text-xs md:text-sm">
                        <div className="space-y-2">
                            <h3 className="text-slate-50 font-semibold tracking-wide text-sm">
                                {brandName}
                            </h3>
                            <p className="text-slate-400 text-xs md:text-sm">
                                Curated sofas, backdrops, tables and centrepieces for
                                weddings, showers and modern celebrations.
                            </p>
                        </div>

                        <div>
                            <h4 className="text-slate-50 font-semibold mb-2 text-sm">
                                Quick links
                            </h4>
                            <ul className="space-y-1 text-slate-400">
                                <li>
                                    <Link href="/" className="hover:text-amber-300">
                                        Home
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/catalog" className="hover:text-amber-300">
                                        Catalog
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/quote" className="hover:text-amber-300">
                                        Quote
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-slate-50 font-semibold mb-2 text-sm">
                                Contact
                            </h4>
                            <p className="text-slate-400">
                                Email:{' '}
                                <a
                                    href="mailto:info@harbourdecor.com"
                                    className="hover:text-amber-300"
                                >
                                    info@harbourdecor.com
                                </a>
                            </p>
                            <p className="text-slate-400">
                                Phone:{' '}
                                <a
                                    href="tel:+15551234567"
                                    className="hover:text-amber-300"
                                >
                                    +1 (555) 123-4567
                                </a>
                            </p>
                            <p className="mt-2 text-slate-500 text-xs">
                                Toronto · Ontario
                            </p>
                        </div>
                    </div>

                    <div className="border-t border-slate-800">
                        <div className="max-w-7xl mx-auto px-4 py-4 text-center text-[11px] text-slate-500">
                            © {currentYear} {brandName} · All rights reserved.
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
