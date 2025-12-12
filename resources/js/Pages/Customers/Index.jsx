import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import { useTheme } from '@/Context/ThemeContext';

function Pill({ label, theme }) {
    const cls =
        label === 'VIP'
            ? theme === 'light'
                ? 'bg-amber-100 text-amber-800'
                : 'bg-amber-500/15 text-amber-200'
            : label === 'Active'
            ? theme === 'light'
                ? 'bg-emerald-100 text-emerald-800'
                : 'bg-emerald-500/15 text-emerald-200'
            : theme === 'light'
            ? 'bg-gray-100 text-gray-800'
            : 'bg-slate-700/35 text-slate-200';

    return <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${cls}`}>{label}</span>;
}

function StatCard({ title, value, icon, theme }) {
    const card =
        theme === 'light'
            ? 'bg-white border-gray-200'
            : theme === 'gold'
            ? 'bg-[#0b1220] border-amber-500/25'
            : 'bg-slate-900 border-slate-800';

    const text = theme === 'light' ? 'text-gray-900' : 'text-slate-50';
    const sub =
        theme === 'light' ? 'text-gray-600' : theme === 'gold' ? 'text-amber-100/70' : 'text-slate-300';

    return (
        <div className={`rounded-2xl border shadow-sm p-5 ${card}`}>
            <div className="flex items-start justify-between">
                <div>
                    <div className={`text-sm ${sub}`}>{title}</div>
                    <div className={`mt-2 text-3xl font-bold tracking-tight ${text}`}>{value}</div>
                </div>
                <div
                    className={
                        theme === 'light'
                            ? 'text-xl bg-gray-100 rounded-2xl h-11 w-11 flex items-center justify-center'
                            : theme === 'gold'
                            ? 'text-xl bg-amber-500/15 text-amber-200 rounded-2xl h-11 w-11 flex items-center justify-center'
                            : 'text-xl bg-slate-800 text-slate-200 rounded-2xl h-11 w-11 flex items-center justify-center'
                    }
                >
                    {icon}
                </div>
            </div>
        </div>
    );
}

export default function CustomersIndex({ customers: customersProp = [], filters = { q: '', status: 'All' } }) {
    const { theme } = useTheme();
    const isDark = theme !== 'light';

    const pageText = isDark ? 'text-slate-50' : 'text-gray-900';
    const subText =
        theme === 'light' ? 'text-gray-600' : theme === 'gold' ? 'text-amber-100/70' : 'text-slate-300';

    const panel =
        theme === 'light'
            ? 'bg-white border-gray-200'
            : theme === 'gold'
            ? 'bg-[#0b1220] border-amber-500/25'
            : 'bg-slate-900 border-slate-800';

    // ✅ Normalize backend fields -> UI fields
    const customers = useMemo(() => {
        return (customersProp || []).map((c) => ({
            id: c.id,
            name: c.name,
            email: c.email ?? '',
            phone: c.phone ?? '',
            city: c.city ?? '',
            status: c.status ?? 'Active',
            totalBookings: Number(c.total_bookings ?? 0),
            totalSpent: Number(c.total_spent ?? 0),
        }));
    }, [customersProp]);

    const [q, setQ] = useState(filters?.q ?? '');
    const [status, setStatus] = useState(filters?.status ?? 'All');

    // (Optional) If you want filters to call server:
    const applyFilters = () => {
        router.get(route('customers.index'), { q, status }, { preserveState: true, replace: true });
    };

    const filtered = useMemo(() => {
        const query = q.trim().toLowerCase();
        return customers.filter((c) => {
            const matchesQ =
                !query ||
                c.name.toLowerCase().includes(query) ||
                c.email.toLowerCase().includes(query) ||
                c.phone.toLowerCase().includes(query) ||
                c.city.toLowerCase().includes(query);

            const matchesStatus = status === 'All' || c.status === status;

            return matchesQ && matchesStatus;
        });
    }, [customers, q, status]);

    const totals = useMemo(() => {
        const totalCustomers = customers.length;
        const vip = customers.filter((c) => c.status === 'VIP').length;
        const active = customers.filter((c) => c.status === 'Active').length;
        const totalRevenue = customers.reduce((sum, c) => sum + c.totalSpent, 0);
        return { totalCustomers, vip, active, totalRevenue };
    }, [customers]);

    const actionBtnBase = 'px-3 py-1 text-xs rounded-lg font-semibold border transition';

    const actionBtnEdit =
        actionBtnBase +
        (theme === 'light'
            ? ' bg-white border-gray-200 text-gray-900 hover:bg-gray-50'
            : ' bg-transparent border-slate-700 text-slate-50 hover:bg-slate-800/60');

    const actionBtnDelete =
        actionBtnBase +
        (theme === 'light'
            ? ' bg-red-600 border-red-600 text-white hover:bg-red-700'
            : ' bg-red-600 border-red-600 text-white hover:bg-red-700');

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h2 className={`text-xl font-semibold leading-tight ${pageText}`}>Customers</h2>
                        <p className={`text-sm mt-1 ${subText}`}>
                            Manage customers, view booking history, and track spending.
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <Link
                            href={route('customers.create')}
                            className={
                                'px-3 py-2 rounded-xl text-sm font-semibold border transition ' +
                                (theme === 'light'
                                    ? 'bg-gray-900 text-white border-gray-900 hover:opacity-90'
                                    : theme === 'gold'
                                    ? 'bg-amber-400 text-slate-900 border-amber-400 hover:opacity-90'
                                    : 'bg-slate-50 text-slate-900 border-slate-50 hover:opacity-90')
                            }
                        >
                            + Add Customer
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title="Customers" />

            <div className="py-8">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 space-y-6">
                    {/* Stats */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <StatCard title="Total Customers" value={totals.totalCustomers} icon="👥" theme={theme} />
                        <StatCard title="Active" value={totals.active} icon="✅" theme={theme} />
                        <StatCard title="VIP" value={totals.vip} icon="⭐" theme={theme} />
                        <StatCard
                            title="Total Spent"
                            value={`$${totals.totalRevenue.toLocaleString()}`}
                            icon="💰"
                            theme={theme}
                        />
                    </div>

                    {/* Filters */}
                    <div className={`rounded-2xl border shadow-sm p-4 ${panel}`}>
                        <div className="flex flex-col md:flex-row md:items-center gap-3">
                            <div className="flex-1">
                                <input
                                    value={q}
                                    onChange={(e) => setQ(e.target.value)}
                                    placeholder="Search name, email, phone, city..."
                                    className={
                                        'w-full rounded-xl border px-3 py-2 text-sm outline-none ' +
                                        (theme === 'light'
                                            ? 'bg-white border-gray-200 text-gray-900 placeholder:text-gray-400'
                                            : 'bg-black/10 border-slate-700 text-slate-50 placeholder:text-slate-400')
                                    }
                                />
                            </div>

                            <div className="flex items-center gap-2">
                                <select
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                    className={
                                        'rounded-xl border px-3 py-2 text-sm outline-none ' +
                                        (theme === 'light'
                                            ? 'bg-white border-gray-200 text-gray-900'
                                            : 'bg-black/10 border-slate-700 text-slate-50')
                                    }
                                >
                                    <option>All</option>
                                    <option>Active</option>
                                    <option>VIP</option>
                                    <option>New</option>
                                </select>

                                <button
                                    type="button"
                                    onClick={() => applyFilters()}
                                    className={
                                        'rounded-xl border px-3 py-2 text-sm font-semibold transition ' +
                                        (theme === 'light'
                                            ? 'bg-white border-gray-200 text-gray-900 hover:bg-gray-50'
                                            : 'bg-transparent border-slate-700 text-slate-50 hover:bg-slate-800/60')
                                    }
                                >
                                    Apply
                                </button>

                                <button
                                    type="button"
                                    onClick={() => {
                                        setQ('');
                                        setStatus('All');
                                        router.get(route('customers.index'), {}, { preserveState: true, replace: true });
                                    }}
                                    className={
                                        'rounded-xl border px-3 py-2 text-sm font-semibold transition ' +
                                        (theme === 'light'
                                            ? 'bg-white border-gray-200 text-gray-900 hover:bg-gray-50'
                                            : 'bg-transparent border-slate-700 text-slate-50 hover:bg-slate-800/60')
                                    }
                                >
                                    Reset
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Table */}
                    <div className={`rounded-2xl border shadow-sm ${panel}`}>
                        <div className="p-5 flex items-center justify-between">
                            <div>
                                <h3 className={`text-lg font-semibold ${pageText}`}>Customer List</h3>
                                <p className={`text-sm ${subText}`}>{filtered.length} result(s)</p>
                            </div>
                        </div>

                        <div className="px-5 pb-5 overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className={theme === 'light' ? 'text-gray-500' : 'text-slate-300'}>
                                    <tr>
                                        <th className="text-left py-2">Customer</th>
                                        <th className="text-left py-2">Phone</th>
                                        <th className="text-left py-2">City</th>
                                        <th className="text-left py-2">Bookings</th>
                                        <th className="text-left py-2">Spent</th>
                                        <th className="text-left py-2">Status</th>
                                        <th className="text-right py-2">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filtered.map((c) => (
                                        <tr
                                            key={c.id}
                                            className={theme === 'light' ? 'border-t border-gray-100' : 'border-t border-slate-800'}
                                        >
                                            <td className={`py-3 ${pageText}`}>
                                                <div className="font-semibold">{c.name}</div>
                                                <div className={`text-xs ${subText}`}>{c.email}</div>
                                            </td>
                                            <td className={`py-3 ${subText}`}>{c.phone}</td>
                                            <td className={`py-3 ${subText}`}>{c.city}</td>
                                            <td className={`py-3 ${subText}`}>{c.totalBookings}</td>
                                            <td className={`py-3 ${subText}`}>${c.totalSpent.toLocaleString()}</td>
                                            <td className="py-3">
                                                <Pill label={c.status} theme={theme} />
                                            </td>

                                            <td className="py-3 text-right space-x-2 whitespace-nowrap">
                                                <button
                                                    onClick={() => router.get(route('customers.show', c.id))}
                                                    className={actionBtnEdit}
                                                >
                                                    View / Edit
                                                </button>

                                                <button
                                                    onClick={() => {
                                                        if (confirm('Are you sure you want to delete this customer?')) {
                                                            router.delete(route('customers.destroy', c.id));
                                                        }
                                                    }}
                                                    className={actionBtnDelete}
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}

                                    {filtered.length === 0 && (
                                        <tr>
                                            <td colSpan={7} className={`py-10 text-center ${subText}`}>
                                                No customers found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className={`text-xs ${subText}`}>
                        Next: connect booking history inside customer profile + auto-calc total_bookings and total_spent.
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
