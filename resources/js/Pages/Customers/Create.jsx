import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useTheme } from '@/Context/ThemeContext';

export default function Create() {
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

    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        phone: '',
        city: '',
        address: '',
        notes: '',
        status: 'Active',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('customers.store'));
    };

    return (
        <AuthenticatedLayout
            header={
                <div>
                    <h2 className={`text-xl font-semibold leading-tight ${pageText}`}>Add Customer</h2>
                    <p className={`text-sm mt-1 ${subText}`}>Create a new customer profile.</p>
                </div>
            }
        >
            <Head title="Add Customer" />

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
                    </div>

                    <div className={`rounded-2xl border shadow-sm ${panel}`}>
                        <form onSubmit={submit} className="p-6 space-y-4">
                            <div>
                                <label className={`text-sm font-semibold ${pageText}`}>Name *</label>
                                <input
                                    className={input}
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="Customer name"
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
                                        placeholder="email@example.com"
                                    />
                                    {errors.email && <div className="text-sm text-red-600 mt-1">{errors.email}</div>}
                                </div>

                                <div>
                                    <label className={`text-sm font-semibold ${pageText}`}>Phone</label>
                                    <input
                                        className={input}
                                        value={data.phone}
                                        onChange={(e) => setData('phone', e.target.value)}
                                        placeholder="(519) 000-0000"
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
                                        placeholder="Windsor"
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
                                    placeholder="Street address"
                                />
                            </div>

                            <div>
                                <label className={`text-sm font-semibold ${pageText}`}>Notes</label>
                                <textarea
                                    className={`${input} min-h-[110px]`}
                                    value={data.notes}
                                    onChange={(e) => setData('notes', e.target.value)}
                                    placeholder="Notes about this customer..."
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
                                    {processing ? 'Saving...' : 'Save Customer'}
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
                                    Cancel
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
