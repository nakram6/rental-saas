import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { useTheme } from '@/Context/ThemeContext';

export default function Show({ customer }) {
    const { theme } = useTheme();
    const isDark = theme !== 'light';

    const pageText = isDark ? 'text-slate-50' : 'text-gray-900';
    const subText = theme === 'light' ? 'text-gray-600' : theme === 'gold' ? 'text-amber-100/70' : 'text-slate-300';

    const panel =
        theme === 'light'
            ? 'bg-white border-gray-200'
            : theme === 'gold'
            ? 'bg-[#0b1220] border-amber-500/25'
            : 'bg-slate-900 border-slate-800';

    const input =
        'w-full rounded-xl border px-3 py-2 text-sm outline-none ' +
        (theme === 'light'
            ? 'bg-white border-gray-200 text-gray-900 placeholder:text-gray-400'
            : 'bg-black/10 border-slate-700 text-slate-50 placeholder:text-slate-400');

    const { data, setData, put, processing, errors } = useForm({
        name: customer?.name ?? '',
        email: customer?.email ?? '',
        phone: customer?.phone ?? '',
        city: customer?.city ?? '',
        address: customer?.address ?? '',
        notes: customer?.notes ?? '',
        status: customer?.status ?? 'Active',
    });

    const submit = (e) => {
        e.preventDefault();
        put(route('customers.update', customer.id));
    };

    const deleteCustomer = () => {
        if (confirm('Are you sure you want to delete this customer?')) {
            router.delete(route('customers.destroy', customer.id));
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <h2 className={`text-xl font-semibold leading-tight ${pageText}`}>Customer Profile</h2>
                        <p className={`text-sm mt-1 ${subText}`}>View and edit customer details.</p>
                    </div>

                    <button
                        onClick={deleteCustomer}
                        className="px-4 py-2 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700"
                    >
                        Delete
                    </button>
                </div>
            }
        >
            <Head title={`Customer: ${customer?.name ?? ''}`} />

            <div className="py-8">
                <div className="mx-auto max-w-3xl sm:px-6 lg:px-8 space-y-4">
                    <div className="flex items-center justify-between">
                        <Link
                            href={route('customers.index')}
                            className={
                                'text-sm font-semibold underline underline-offset-4 ' +
                                (theme === 'light' ? 'text-gray-900' : 'text-amber-200')
                            }
                        >
                            ← Back to Customers
                        </Link>

                        <div className={`text-xs ${subText}`}>
                            Total Bookings: <span className={`font-semibold ${pageText}`}>{customer?.total_bookings ?? 0}</span>
                            {'  '}•{'  '}
                            Total Spent: <span className={`font-semibold ${pageText}`}>${Number(customer?.total_spent ?? 0).toLocaleString()}</span>
                        </div>
                    </div>

                    <div className={`rounded-2xl border shadow-sm ${panel}`}>
                        <form onSubmit={submit} className="p-6 space-y-4">
                            <div>
                                <label className={`text-sm font-semibold ${pageText}`}>Name *</label>
                                <input
                                    className={input}
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                />
                                {errors.name && <div className="text-sm text-red-600 mt-1">{errors.name}</div>}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label className={`text-sm font-semibold ${pageText}`}>Email</label>
                                    <input
                                        className={input}
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                    />
                                    {errors.email && <div className="text-sm text-red-600 mt-1">{errors.email}</div>}
                                </div>

                                <div>
                                    <label className={`text-sm font-semibold ${pageText}`}>Phone</label>
                                    <input
                                        className={input}
                                        value={data.phone}
                                        onChange={(e) => setData('phone', e.target.value)}
                                    />
                                    {errors.phone && <div className="text-sm text-red-600 mt-1">{errors.phone}</div>}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label className={`text-sm font-semibold ${pageText}`}>City</label>
                                    <input
                                        className={input}
                                        value={data.city}
                                        onChange={(e) => setData('city', e.target.value)}
                                    />
                                </div>

                                <div>
                                    <label className={`text-sm font-semibold ${pageText}`}>Status</label>
                                    <select
                                        className={input}
                                        value={data.status}
                                        onChange={(e) => setData('status', e.target.value)}
                                    >
                                        <option value="Active">Active</option>
                                        <option value="VIP">VIP</option>
                                        <option value="New">New</option>
                                    </select>
                                    {errors.status && <div className="text-sm text-red-600 mt-1">{errors.status}</div>}
                                </div>
                            </div>

                            <div>
                                <label className={`text-sm font-semibold ${pageText}`}>Address</label>
                                <input
                                    className={input}
                                    value={data.address}
                                    onChange={(e) => setData('address', e.target.value)}
                                />
                            </div>

                            <div>
                                <label className={`text-sm font-semibold ${pageText}`}>Notes</label>
                                <textarea
                                    className={`${input} min-h-[110px]`}
                                    value={data.notes}
                                    onChange={(e) => setData('notes', e.target.value)}
                                />
                            </div>

                            <div className="flex items-center gap-2 pt-2">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className={
                                        'px-4 py-2 rounded-xl text-sm font-semibold border transition disabled:opacity-50 ' +
                                        (theme === 'light'
                                            ? 'bg-gray-900 text-white border-gray-900 hover:opacity-90'
                                            : theme === 'gold'
                                            ? 'bg-amber-400 text-slate-900 border-amber-400 hover:opacity-90'
                                            : 'bg-slate-50 text-slate-900 border-slate-50 hover:opacity-90')
                                    }
                                >
                                    {processing ? 'Saving...' : 'Save Changes'}
                                </button>

                                <Link
                                    href={route('customers.index')}
                                    className={
                                        'px-4 py-2 rounded-xl text-sm font-semibold border transition ' +
                                        (theme === 'light'
                                            ? 'bg-white text-gray-900 border-gray-200 hover:bg-gray-50'
                                            : 'bg-transparent text-slate-50 border-slate-700 hover:bg-slate-800/60')
                                    }
                                >
                                    Back
                                </Link>
                            </div>
                        </form>
                    </div>

                    <div className={`text-xs ${subText}`}>
                        Next: show customer booking history on this page (table + KPIs).
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
