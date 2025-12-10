import React from "react";

export default function ClientFooter({ tenant }) {
    return (
        <footer className="bg-gray-900 text-gray-300 py-10 mt-12">
            <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-3 gap-8">

                <div>
                    <h3 className="text-lg font-semibold text-white mb-3">
                        {tenant?.name ?? "Event Decor Rentals"}
                    </h3>
                    <p className="text-sm">
                        Premium event décor rentals for weddings, parties, and corporate events.
                    </p>
                </div>

                <div>
                    <h4 className="font-semibold text-white mb-2">Quick Links</h4>
                    <ul className="space-y-1 text-sm">
                        <li><a href="/" className="hover:text-white">Home</a></li>
                        <li><a href="/catalog" className="hover:text-white">Catalog</a></li>
                        <li><a href="/contact" className="hover:text-white">Contact</a></li>
                    </ul>
                </div>

                <div>
                    <h4 className="font-semibold text-white mb-2">Contact</h4>
                    <p className="text-sm">Email: info@harbourdecor.com</p>
                    <p className="text-sm">Phone: +1 (555) 123-4567</p>
                    <p className="text-sm mt-2">Toronto, Ontario</p>
                </div>

            </div>

            <div className="text-center text-gray-500 text-xs mt-10">
                © {new Date().getFullYear()} {tenant?.name ?? "Event Decor Rentals"} — All rights reserved.
            </div>
        </footer>
    );
}
