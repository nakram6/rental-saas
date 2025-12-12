import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useTheme } from '@/Context/ThemeContext';
import { useMemo } from 'react';

function Panel({ children, theme }) {
    const cls =
        theme === 'light'
            ? 'bg-white border-gray-200'
            : theme === 'gold'
            ? 'bg-[#0b1220] border-amber-500/25'
            : 'bg-slate-900 border-slate-800';
    return <div className={`rounded-2xl border shadow-sm ${cls}`}>{children}</div>;
}

function StatCard({ title, value, icon, theme }) {
    const cls =
        theme === 'light'
            ? 'bg-white border-gray-200'
            : theme === 'gold'
            ? 'bg-[#0b1220] border-amber-500/25'
            : 'bg-slate-900 border-slate-800';
    return (
        <div className={`rounded-2xl border shadow-sm p-5 ${cls}`}>
            <div className="flex items-start justify-between">
                <div>
                    <div className="text-sm opacity-70">{title}</div>
                    <div className="mt-2 text-3xl font-bold">{value}</div>
                </div>
                <div className="text-2xl">{icon}</div>
            </div>
        </div>
    );
}

export default function QuotesReport() {
    const { theme } = useTheme();

    const rows = useMemo(
        () => [
            { id: 1, quote: 'Q-5001', customer: 'Ayesha Qureshi', eventDate: '2025-12-20', value: 950, status: 'New', last: '2025-12-11' },
            { id: 2, quote: 'Q-5002', customer: 'NorthCo Events', eventDate: '2025-12-28', value: 3200, status: 'Sent', last: '2025-12-10' },
            { id: 3, quote: 'Q-5003', customer: 'Ali Khan', eventDate: '2026-01-05', value: 620, status: 'Approved', last: '2025-12-09' },
            { id: 4, quote: 'Q-5004', customer: 'Sarah Malik', eventDate: '2025-12-18', value: 450, status: 'Rejected', last: '2025-12-08' },
        ],
        []
    );

    const totals = useMemo(() => {
        const total = rows.length;
        const newCount = rows.filter((r) => r.status === 'New').length;
        const sent = rows.filter((r) => r.status === 'Sent').length;
        const approved = rows.filter((r) => r.status === 'Approved').length;
        const conversion = total ? Math.round((approved / total) * 100) : 0;
        return { total, newCount, sent, approved, conversion };
    }, [rows]);

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold">Quotes Report</h2>}>
            <Head title="Reports - Quotes" />

            <div className="max-w-7xl mx-auto space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard theme={theme} title="Total Quotes" value={totals.total} icon="🧾" />
                    <StatCard theme={theme} title="New" value={totals.newCount} icon="🆕" />
                    <StatCard theme={theme} title="Approved" value={totals.approved} icon="✅" />
                    <StatCard theme={theme} title="Conversion (dummy)" value={`${totals.conversion}%`} icon="🎯" />
                </div>

                <Panel theme={theme}>
                    <div className="p-5">
                        <div className="text-lg font-semibold">Quotes Funnel</div>
                        <div className="text-sm opacity-70 mt-1">Dummy quotes list (later connect to /quote public page)</div>
                    </div>

                    <div className="px-5 pb-5 overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="opacity-70">
                                <tr>
                                    <th className="text-left py-2">Quote</th>
                                    <th className="text-left py-2">Customer</th>
                                    <th className="text-left py-2">Event Date</th>
                                    <th className="text-left py-2">Value</th>
                                    <th className="text-left py-2">Status</th>
                                    <th className="text-left py-2">Last Update</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rows.map((r) => (
                                    <tr key={r.id} className="border-t border-black/5 dark:border-white/10">
                                        <td className="py-3 font-semibold">{r.quote}</td>
                                        <td className="py-3">{r.customer}</td>
                                        <td className="py-3">{r.eventDate}</td>
                                        <td className="py-3">${r.value.toLocaleString()}</td>
                                        <td className="py-3">{r.status}</td>
                                        <td className="py-3">{r.last}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Panel>
            </div>
        </AuthenticatedLayout>
    );
}
