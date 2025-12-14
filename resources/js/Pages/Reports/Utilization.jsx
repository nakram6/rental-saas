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

function ProgressBar({ pct, theme }) {
    const track =
        theme === 'light' ? 'bg-gray-100' : theme === 'gold' ? 'bg-white/10' : 'bg-slate-800';
    const fill =
        theme === 'light'
            ? 'bg-gray-900'
            : theme === 'gold'
            ? 'bg-amber-400'
            : 'bg-slate-100';

    return (
        <div className={`w-full h-2 rounded-full ${track}`}>
            <div className={`h-2 rounded-full ${fill}`} style={{ width: `${pct}%` }} />
        </div>
    );
}

export default function UtilizationReport() {
    const { theme } = useTheme();

    const items = useMemo(
        () => [
            { id: 1, item: 'White Sofa 3-seater', category: 'Stage', rentedDays: 21, availableDays: 30 },
            { id: 2, item: 'Round Table (8 chairs)', category: 'Guests', rentedDays: 15, availableDays: 30 },
            { id: 3, item: 'Gold Arch Backdrop', category: 'Stage', rentedDays: 9, availableDays: 30 },
            { id: 4, item: 'Chair (Gold)', category: 'Guests', rentedDays: 24, availableDays: 30 },
        ],
        []
    );

    const rows = useMemo(() => {
        return items
            .map((x) => ({
                ...x,
                pct: Math.round((x.rentedDays / x.availableDays) * 100),
            }))
            .sort((a, b) => b.pct - a.pct);
    }, [items]);

    const avg = useMemo(() => {
        const sumPct = rows.reduce((s, r) => s + r.pct, 0);
        return rows.length ? Math.round(sumPct / rows.length) : 0;
    }, [rows]);

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold">Utilization Report</h2>}>
            <Head title="Reports - Utilization" />

            <div className="max-w-7xl mx-auto space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard theme={theme} title="Avg Utilization" value={`${avg}%`} icon="📊" />
                    <StatCard theme={theme} title="High Utilization Items" value="2" icon="🔥" />
                    <StatCard theme={theme} title="Low Utilization Items" value="1" icon="🧊" />
                    <StatCard theme={theme} title="Total Track Days" value="120" icon="📅" />
                </div>

                <Panel theme={theme}>
                    <div className="p-5">
                        <div className="text-lg font-semibold">Utilization by Item</div>
                        <div className="text-sm opacity-70 mt-1">
                            Dummy calculation: rentedDays / availableDays (connect to bookings later).
                        </div>
                    </div>

                    <div className="px-5 pb-5 overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="opacity-70">
                                <tr>
                                    <th className="text-left py-2">Item</th>
                                    <th className="text-left py-2">Category</th>
                                    <th className="text-left py-2">Rented Days</th>
                                    <th className="text-left py-2">Available Days</th>
                                    <th className="text-left py-2">Utilization</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rows.map((r) => (
                                    <tr
                                        key={r.id}
                                        className="border-t border-black/5 dark:border-white/10"
                                    >
                                        <td className="py-3 font-semibold">{r.item}</td>
                                        <td className="py-3">{r.category}</td>
                                        <td className="py-3">{r.rentedDays}</td>
                                        <td className="py-3">{r.availableDays}</td>
                                        <td className="py-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-40">
                                                    <ProgressBar pct={r.pct} theme={theme} />
                                                </div>
                                                <div className="font-semibold">{r.pct}%</div>
                                            </div>
                                        </td>
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
