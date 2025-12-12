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

export default function DamagedReport() {
    const { theme } = useTheme();

    const rows = useMemo(
        () => [
            {
                id: 1,
                item: 'White Sofa 3-seater',
                booking: 'BK-10012',
                customer: 'Sarah Malik',
                issue: 'Small tear on seat edge',
                status: 'Needs Repair',
                cost: 120,
                date: '2025-12-05',
            },
            {
                id: 2,
                item: 'Gold Arch Backdrop',
                booking: 'BK-10008',
                customer: 'NorthCo Events',
                issue: 'Scratch marks',
                status: 'Resolved',
                cost: 40,
                date: '2025-12-02',
            },
            {
                id: 3,
                item: 'Chair (Gold)',
                booking: 'BK-10018',
                customer: 'Ali Khan',
                issue: 'Missing cap (lost)',
                status: 'Lost',
                cost: 25,
                date: '2025-12-09',
            },
        ],
        []
    );

    const totals = useMemo(() => {
        const totalCases = rows.length;
        const lost = rows.filter((r) => r.status === 'Lost').length;
        const repair = rows.filter((r) => r.status === 'Needs Repair').length;
        const totalCost = rows.reduce((s, r) => s + r.cost, 0);
        return { totalCases, lost, repair, totalCost };
    }, [rows]);

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold">Damaged / Loss Report</h2>}>
            <Head title="Reports - Damaged/Loss" />

            <div className="max-w-7xl mx-auto space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard theme={theme} title="Total Cases" value={totals.totalCases} icon="🧾" />
                    <StatCard theme={theme} title="Needs Repair" value={totals.repair} icon="🛠️" />
                    <StatCard theme={theme} title="Lost" value={totals.lost} icon="❌" />
                    <StatCard theme={theme} title="Estimated Cost" value={`$${totals.totalCost}`} icon="💸" />
                </div>

                <Panel theme={theme}>
                    <div className="p-5">
                        <div className="text-lg font-semibold">Damage & Loss Log</div>
                        <div className="text-sm opacity-70 mt-1">
                            Dummy data (later connect to returns + inspections).
                        </div>
                    </div>

                    <div className="px-5 pb-5 overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="opacity-70">
                                <tr>
                                    <th className="text-left py-2">Item</th>
                                    <th className="text-left py-2">Booking</th>
                                    <th className="text-left py-2">Customer</th>
                                    <th className="text-left py-2">Issue</th>
                                    <th className="text-left py-2">Status</th>
                                    <th className="text-left py-2">Cost</th>
                                    <th className="text-left py-2">Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rows.map((r) => (
                                    <tr key={r.id} className="border-t border-black/5 dark:border-white/10">
                                        <td className="py-3 font-semibold">{r.item}</td>
                                        <td className="py-3">{r.booking}</td>
                                        <td className="py-3">{r.customer}</td>
                                        <td className="py-3">{r.issue}</td>
                                        <td className="py-3">{r.status}</td>
                                        <td className="py-3">${r.cost}</td>
                                        <td className="py-3">{r.date}</td>
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
