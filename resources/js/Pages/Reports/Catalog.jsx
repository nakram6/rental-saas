import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { useTheme } from '@/Context/ThemeContext';

export default function Catalog({ items }) {
    const { theme } = useTheme();
    const { flash = {} } = usePage().props;

    const [email, setEmail] = useState('');
    const [sending, setSending] = useState(false);
    const [localMsg, setLocalMsg] = useState(null);

    const card =
        theme === 'light'
            ? 'bg-white border-gray-200'
            : theme === 'gold'
            ? 'bg-[#0b1220] border-amber-500/25'
            : 'bg-slate-900 border-slate-800';

    const text = theme === 'light' ? 'text-gray-900' : 'text-white';
    const sub = theme === 'light' ? 'text-gray-600' : theme === 'gold' ? 'text-amber-100/70' : 'text-white/70';

    const inputCls =
        theme === 'light'
            ? 'bg-white border-gray-200 text-gray-900 placeholder:text-gray-400'
            : 'bg-black/10 border-white/10 text-white placeholder:text-white/40';

    const toastOk =
        theme === 'light'
            ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
            : 'bg-emerald-500/10 text-emerald-200 border-emerald-500/25';

    const toastErr =
        theme === 'light'
            ? 'bg-rose-50 text-rose-900 border-rose-200'
            : 'bg-rose-500/10 text-rose-200 border-rose-500/25';

    // Show flash success from backend
    useEffect(() => {
        if (flash.success) {
            setLocalMsg({ type: 'success', text: flash.success });
            const t = setTimeout(() => setLocalMsg(null), 4000);
            return () => clearTimeout(t);
        }
        if (flash.error) {
            setLocalMsg({ type: 'error', text: flash.error });
            const t = setTimeout(() => setLocalMsg(null), 5000);
            return () => clearTimeout(t);
        }
    }, [flash.success, flash.error]);

    const sendCatalog = () => {
        const cleanEmail = email.trim();

        if (!cleanEmail) {
            setLocalMsg({ type: 'error', text: 'Please enter customer email.' });
            return;
        }

        setSending(true);

        router.post(
            route('reports.catalog.email'),
            { email: cleanEmail },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setSending(false);
                    setEmail('');
                    // success toast comes from backend flash.success
                },
                onError: (errors) => {
                    setSending(false);
                    const msg =
                        errors?.email?.[0] ||
                        'Failed to send catalog. Please check email settings.';
                    setLocalMsg({ type: 'error', text: msg });
                },
            }
        );
    };

    return (
        <AuthenticatedLayout
            header={
                <div>
                    <h2 className={`text-2xl font-bold ${text}`}>Item Catalog</h2>
                    <p className={`text-sm mt-1 ${sub}`}>
                        Send a customer-ready catalog (email link + PDF attachment).
                    </p>
                </div>
            }
        >
            <Head title="Catalog Report" />

            <div className="py-6">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 space-y-6">
                    {/* Toast */}
                    {localMsg && (
                        <div
                            className={
                                `rounded-2xl border px-4 py-3 text-sm flex items-center justify-between ` +
                                (localMsg.type === 'success' ? toastOk : toastErr)
                            }
                        >
                            <div>{localMsg.text}</div>
                            <button
                                type="button"
                                onClick={() => setLocalMsg(null)}
                                className="text-xs font-semibold underline underline-offset-4"
                            >
                                Close
                            </button>
                        </div>
                    )}

                    {/* Email send bar */}
                    <div className={`rounded-2xl border p-4 flex flex-col md:flex-row gap-3 ${card}`}>
                        <input
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="customer@email.com"
                            className={`flex-1 rounded-xl border px-3 py-2 text-sm outline-none ${inputCls}`}
                        />

                        <button
                            type="button"
                            onClick={sendCatalog}
                            disabled={sending}
                            className={
                                'px-4 py-2 rounded-xl text-white font-semibold transition flex items-center justify-center gap-2 ' +
                                (sending ? 'bg-emerald-600/70 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-700')
                            }
                        >
                            {sending && (
                                <span className="h-4 w-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                            )}
                            {sending ? 'Sending…' : 'Send Catalog'}
                        </button>
                    </div>

                    {/* Catalog grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {items.map((item) => (
                            <div
                                key={item.id}
                                className={`rounded-2xl overflow-hidden border shadow-sm hover:shadow-lg transition ${card}`}
                            >
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    className="h-56 w-full object-cover"
                                />

                                <div className="p-4">
                                    <div className={`font-bold text-lg ${text}`}>{item.name}</div>
                                    <div className={`text-sm ${sub}`}>{item.category}</div>

                                    <div className="mt-3 flex items-center justify-between">
                                        <div className={`font-semibold ${text}`}>${item.price}</div>
                                        <span className="text-xs px-2 py-1 rounded-full bg-amber-500/15 text-amber-300">
                                            Rental
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Footer */}
                    <div className={`text-xs mt-10 text-center ${sub}`}>
                        Powered by Harbour Decor Rentals · Catalog generated automatically
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
