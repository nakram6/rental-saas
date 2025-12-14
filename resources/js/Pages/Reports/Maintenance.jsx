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

export default function MaintenanceReport() {
    const { theme } = useTheme();

    const rows = useMemo(
        () => [
            { id: 1, item: 'White Sofa 3-seater', task: 'Deep clean', due: '2025-12-13', priority: 'High', cost: 60, status: 'Scheduled' },
            { id: 2, item: 'Round Table (8 chairs)', task: 'Inspect legs', due: '2025-12-16', priority: 'Medium', cost: 0, status: 'Pending' },
            { id: 3, item: 'Gold Arch Backdrop', task: 'Touch-up paint', due: '2025-12-20', priority: 'Low', cost: 25, status: 'Pending' },
        ],
        []
    );

    const totals = useMemo(() => {
        const scheduled = rows.filter((r) => r.status === 'Scheduled').length;
        const pending = rows.filter((r) => r.status === 'Pending').length;
        const totalCost = rows.reduce((s, r) => s + r.cost, 0);
        return { scheduled, pending, totalCost };
    }, [rows]);

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold">Maintenance Report</h2>}>
            <Head title="Reports - Maintenance" />

            <div className="max-w-7xl mx-auto space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard theme={theme} title="Scheduled" value={totals.scheduled} icon="🗓️" />
                    <StatCard theme={theme} title="Pending" value={totals.pending} icon="⏳" />
                    <StatCard theme={theme} title="Monthly Cost (dummy)" value={`$${totals.totalCost}`} icon="💰" />
                    <StatCard theme={theme} title="Priority High" value="1" icon="⚠️" />
                </div>

                <Panel theme={theme}>
                    <div className="p-5">
                        <div className="text-lg font-semibold">Maintenance Tasks</div>
                        <div className="text-sm opacity-70 mt-1">Dummy schedule (later connect to items + maintenance logs)</div>
                    </div>

                    <div className="px-5 pb-5 overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="opacity-70">
                                <tr>
                                    <th className="text-left py-2">Item</th>
                                    <th className="text-left py-2">Task</th>
                                    <th className="text-left py-2">Due</th>
                                    <th className="text-left py-2">Priority</th>
                                    <th className="text-left py-2">Cost</th>
                                    <th className="text-left py-2">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rows.map((r) => (
                                    <tr key={r.id} className="border-t border-black/5 dark:border-white/10">
                                        <td className="py-3 font-semibold">{r.item}</td>
                                        <td className="py-3">{r.task}</td>
                                        <td className="py-3">{r.due}</td>
                                        <td className="py-3">{r.priority}</td>
                                        <td className="py-3">${r.cost}</td>
                                        <td className="py-3">{r.status}</td>
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
