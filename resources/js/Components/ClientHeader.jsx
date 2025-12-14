import React from "react";
import { Link } from "@inertiajs/react";

export default function ClientHeader({ tenant }) {
    return (
        <header className="bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
                {/* Logo / Name */}
                <Link href="/" className="text-2xl font-bold text-indigo-600">
                    {tenant?.name ?? "Event Decor Rentals"}
                </Link>

                {/* Navigation */}
                <nav className="space-x-6 text-gray-700 font-medium">
                    <Link href="/" className="hover:text-indigo-600">Home</Link>
                    <Link href="/catalog" className="hover:text-indigo-600">Catalog</Link>
                    <Link href="/contact" className="hover:text-indigo-600">Contact</Link>
                    <Link href="/login" className="hover:text-indigo-600">Admin Login</Link>
                </nav>
            </div>
        </header>
    );
}
