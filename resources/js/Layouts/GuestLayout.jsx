import React from 'react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';

export default function GuestLayout({ children, tenant = null }) {
    // If no tenant is passed → use old centered card layout (for login/register/etc.)
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

    // If tenant IS passed → use full site layout (header + footer)
    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
                    {/* Logo / Brand */}
                    <Link href="/" className="flex items-center gap-2">
                        <ApplicationLogo className="h-10 w-10 fill-current text-indigo-600" />
                        <span className="text-xl font-bold text-indigo-700">
                            {tenant?.name ?? 'Event Decor Rentals'}
                        </span>
                    </Link>

                    {/* Nav */}
                    <nav className="space-x-6 text-sm font-medium text-gray-700">
                        <Link href="/" className="hover:text-indigo-600">
                            Home
                        </Link>
                        <Link href="/catalog" className="hover:text-indigo-600">
                            Catalog
                        </Link>
                        {/* You can later create these pages */}
                        {/* <Link href="/about" className="hover:text-indigo-600">About</Link> */}
                        <Link href="/login" className="hover:text-indigo-600">
                            Admin Login
                        </Link>
                    </nav>
                </div>
            </header>

            {/* Main content */}
            <main className="flex-1">
                {children}
            </main>

            {/* Footer */}
            <footer className="bg-gray-900 text-gray-300 py-8 mt-8">
                <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm">
                    <div>
                        <h3 className="text-white font-semibold mb-2">
                            {tenant?.name ?? 'Event Decor Rentals'}
                        </h3>
                        <p>
                            Premium décor rentals for weddings, parties, and corporate events.
                        </p>
                    </div>

                    <div>
                        <h4 className="text-white font-semibold mb-2">Quick Links</h4>
                        <ul className="space-y-1">
                            <li><Link href="/" className="hover:text-white">Home</Link></li>
                            <li><Link href="/catalog" className="hover:text-white">Catalog</Link></li>
                            {/* <li><Link href="/contact" className="hover:text-white">Contact</Link></li> */}
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-semibold mb-2">Contact</h4>
                        <p>Email: info@harbourdecor.com</p>
                        <p>Phone: +1 (555) 123-4567</p>
                        <p className="mt-2">Toronto, Ontario</p>
                    </div>
                </div>

                <div className="text-center text-xs text-gray-500 mt-6">
                    © {new Date().getFullYear()} {tenant?.name ?? 'Event Decor Rentals'} — All rights reserved.
                </div>
            </footer>
        </div>
    );
}
