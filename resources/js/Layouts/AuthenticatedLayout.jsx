import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { useTheme } from '@/Context/ThemeContext'; // ✅ use theme

function SideNavLink({ href, active, children, theme }) {
    const isDark = theme !== 'light';

    return (
        <Link
            href={href}
            className={
                'flex items-center gap-2 px-4 py-2 text-sm rounded-lg mb-1 transition ' +
                (active
                    ? (isDark
                        ? 'bg-slate-800 text-amber-300 font-semibold'
                        : 'bg-gray-900 text-white font-semibold')
                    : (isDark
                        ? 'text-slate-200 hover:bg-slate-800/60'
                        : 'text-gray-700 hover:bg-gray-100'))
            }
        >
            {children}
        </Link>
    );
}

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;
    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);

    const { theme, setTheme } = useTheme(); // ✅ get current theme

    // Simple theme config
    const themeConfig = {
        light: {
            root: 'bg-gray-100 text-gray-900',
            nav: 'bg-white border-gray-100',
            sidebar: 'bg-white border-gray-200',
            header: 'bg-white',
        },
        dark: {
            root: 'bg-slate-950 text-slate-50',
            nav: 'bg-slate-900 border-slate-800',
            sidebar: 'bg-slate-950 border-slate-800',
            header: 'bg-slate-900',
        },
        gold: {
            // dark blue + gold
            root: 'bg-[#020617] text-amber-50',
            nav: 'bg-[#020617] border-slate-800',
            sidebar: 'bg-[#020617] border-slate-800',
            header: 'bg-[#020617]',
        },
    };

    const t = themeConfig[theme] ?? themeConfig.dark;

    return (
        <div className={`min-h-screen flex flex-col ${t.root}`}>
            {/* ========== TOP NAV (original Breeze style, themed) ========== */}
            <nav className={`border-b ${t.nav}`}>
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 justify-between">
                        <div className="flex">
                            <div className="flex shrink-0 items-center">
                                <Link href="/">
                                    <ApplicationLogo className="block h-9 w-auto fill-current text-gray-800" />
                                </Link>
                            </div>

                            <div className="hidden space-x-8 sm:-my-px sm:ms-10 sm:flex">
                                <NavLink
                                    href={route('dashboard')}
                                    active={route().current('dashboard')}
                                >
                                    Dashboard
                                </NavLink>

                                <NavLink
                                    href={route('items.index')}
                                    active={route().current('items.index')}
                                >
                                    Items
                                </NavLink>

                                {/* Planner */}
                                <NavLink
                                    href={route('planner')} // change route name if needed
                                    active={route().current('planner')}
                                >
                                    Planner
                                </NavLink>

                                {/* Bookings */}
                                <NavLink
                                    href={route('bookings.index')} // change if needed
                                    active={route().current('bookings.index')}
                                >
                                    Bookings
                                </NavLink>
                            </div>
                        </div>

                        <div className="hidden sm:ms-6 sm:flex sm:items-center gap-3">
                            {/* THEME SWITCHER */}
                            <div className="flex items-center gap-1 text-xs">
                                <button
                                    type="button"
                                    onClick={() => setTheme('light')}
                                    className={
                                        'px-2 py-1 rounded-full border ' +
                                        (theme === 'light'
                                            ? 'bg-white text-gray-900 border-gray-400'
                                            : 'bg-transparent text-gray-400 border-gray-300')
                                    }
                                >
                                    Light
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setTheme('dark')}
                                    className={
                                        'px-2 py-1 rounded-full border ' +
                                        (theme === 'dark'
                                            ? 'bg-slate-800 text-slate-100 border-slate-500'
                                            : 'bg-transparent text-gray-400 border-gray-300')
                                    }
                                >
                                    Dark
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setTheme('gold')}
                                    className={
                                        'px-2 py-1 rounded-full border ' +
                                        (theme === 'gold'
                                            ? 'bg-amber-400 text-slate-900 border-amber-500'
                                            : 'bg-transparent text-gray-400 border-gray-300')
                                    }
                                >
                                    Gold
                                </button>
                            </div>

                            {/* USER DROPDOWN */}
                            <div className="relative ms-3">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <span className="inline-flex rounded-md">
                                            <button
                                                type="button"
                                                className="inline-flex items-center rounded-md border border-transparent bg-white/90 px-3 py-2 text-sm font-medium leading-4 text-gray-500 transition duration-150 ease-in-out hover:text-gray-700 focus:outline-none"
                                            >
                                                {user.name}

                                                <svg
                                                    className="-me-0.5 ms-2 h-4 w-4"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </button>
                                        </span>
                                    </Dropdown.Trigger>

                                    <Dropdown.Content>
                                        <Dropdown.Link href={route('profile.edit')}>
                                            Profile
                                        </Dropdown.Link>
                                        <Dropdown.Link
                                            href={route('logout')}
                                            method="post"
                                            as="button"
                                        >
                                            Log Out
                                        </Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>

                        {/* Mobile burger */}
                        <div className="-me-2 flex items-center sm:hidden">
                            <button
                                onClick={() =>
                                    setShowingNavigationDropdown((previous) => !previous)
                                }
                                className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 transition duration-150 ease-in-out hover:bg-gray-100 hover:text-gray-500 focus:bg-gray-100 focus:text-gray-500 focus:outline-none"
                            >
                                <svg
                                    className="h-6 w-6"
                                    stroke="currentColor"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        className={
                                            !showingNavigationDropdown ? 'inline-flex' : 'hidden'
                                        }
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                    <path
                                        className={
                                            showingNavigationDropdown ? 'inline-flex' : 'hidden'
                                        }
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

                {/* MOBILE NAV LINKS (with Planner + Bookings) */}
                <div
                    className={
                        (showingNavigationDropdown ? 'block' : 'hidden') + ' sm:hidden'
                    }
                >
                    <div className="space-y-1 pb-3 pt-2">
                        <ResponsiveNavLink
                            href={route('dashboard')}
                            active={route().current('dashboard')}
                        >
                            Dashboard
                        </ResponsiveNavLink>

                        <ResponsiveNavLink
                            href={route('items.index')}
                            active={route().current('items.index')}
                        >
                            Items
                        </ResponsiveNavLink>

                        <ResponsiveNavLink
                            href={route('planner')}
                            active={route().current('planner')}
                        >
                            Planner
                        </ResponsiveNavLink>

                        <ResponsiveNavLink
                            href={route('bookings.index')}
                            active={route().current('bookings.index')}
                        >
                            Bookings
                        </ResponsiveNavLink>
                    </div>

                    <div className="border-t border-gray-200 pb-1 pt-4">
                        <div className="px-4">
                            <div className="text-base font-medium text-gray-800">
                                {user.name}
                            </div>
                            <div className="text-sm font-medium text-gray-500">
                                {user.email}
                            </div>
                        </div>

                        <div className="mt-3 space-y-1">
                            <ResponsiveNavLink href={route('profile.edit')}>
                                Profile
                            </ResponsiveNavLink>
                            <ResponsiveNavLink
                                method="post"
                                href={route('logout')}
                                as="button"
                            >
                                Log Out
                            </ResponsiveNavLink>
                        </div>
                    </div>
                </div>
            </nav>

            {/* ========== MAIN LAYOUT: sidebar at extreme left + header + content ========== */}
            <div className="flex flex-1">
                {/* Sidebar */}
                <aside
                    className={`hidden md:block w-64 min-h-[calc(100vh-4rem)] pt-6 border-r ${t.sidebar}`}
                >
                    <div className="px-4 text-xs font-semibold uppercase tracking-wide text-gray-400 mb-3">
                        Admin navigation
                    </div>
                    <nav className="px-2">
                        <SideNavLink
                            href={route('dashboard')}
                            active={route().current('dashboard')}
                            theme={theme}
                        >
                            <span className="text-lg">🏠</span>
                            <span>Dashboard</span>
                        </SideNavLink>

                        <SideNavLink
                            href={route('planner')}
                            active={route().current('planner')}
                            theme={theme}
                        >
                            <span className="text-lg">🛋️</span>
                            <span>Decoration planner</span>
                        </SideNavLink>

                        <SideNavLink
                            href={route('bookings.index')}
                            active={route().current('bookings.index')}
                            theme={theme}
                        >
                            <span className="text-lg">📅</span>
                            <span>Event bookings</span>
                        </SideNavLink>
                    </nav>
                </aside>

                {/* Right side: old header + main content, full width after sidebar */}
                <div className="flex-1 flex flex-col">
                    {header && (
                        <header className={`${t.header} shadow`}>
                            <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                                {header}
                            </div>
                        </header>
                    )}

                    <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
                        {children}
                    </main>
                </div>
            </div>
        </div>
    );
}
