import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { useEffect, useMemo, useState } from 'react';
import { useTheme } from '@/Context/ThemeContext';

/** Smooth count-up animation */
function useCountUp(target, duration = 900) {
    const [value, setValue] = useState(0);

    useEffect(() => {
        const end = Number(target || 0);
        const startTime = performance.now();

        const tick = (now) => {
            const progress = Math.min((now - startTime) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
            setValue(Math.round(end * eased));
            if (progress < 1) requestAnimationFrame(tick);
        };

        requestAnimationFrame(tick);
    }, [target, duration]);

    return value;
}

/** Tiny inline sparkline (no lib needed) */
function Sparkline({ data, theme }) {
    const width = 120;
    const height = 28;
    const padding = 2;

    if (!data?.length) return null;

    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = Math.max(1, max - min);

    const points = data
        .map((v, i) => {
            const x = padding + (i * (width - padding * 2)) / (data.length - 1);
            const y = padding + (1 - (v - min) / range) * (height - padding * 2);
            return `${x},${y}`;
        })
        .join(' ');

    const stroke =
        theme === 'light' ? '#111827' : theme === 'gold' ? '#fbbf24' : '#e2e8f0';
    const fill =
        theme === 'light'
            ? 'rgba(17,24,39,0.08)'
            : theme === 'gold'
            ? 'rgba(251,191,36,0.12)'
            : 'rgba(226,232,240,0.10)';

    // Area under curve
    const area = `M ${points.replaceAll(' ', ' L ')} L ${width - padding},${height - padding} L ${padding},${height - padding} Z`;

    return (
        <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="mt-3">
            <path d={area} fill={fill} />
            <polyline
                points={points}
                fill="none"
                stroke={stroke}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

function Chip({ children, theme, tone = 'neutral' }) {
    const cls =
        tone === 'up'
            ? theme === 'light'
                ? 'bg-emerald-100 text-emerald-800'
                : 'bg-emerald-500/15 text-emerald-200'
            : tone === 'down'
              ? theme === 'light'
                  ? 'bg-rose-100 text-rose-800'
                  : 'bg-rose-500/15 text-rose-200'
              : theme === 'light'
                  ? 'bg-gray-100 text-gray-800'
                  : 'bg-slate-700/35 text-slate-200';

    return <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${cls}`}>{children}</span>;
}

function KpiCard({ title, value, icon, theme, suffix = '', hint = '', chip = null, accent = 'default', spark = [] }) {
    const count = useCountUp(value, 950);
    const isDark = theme !== 'light';

    const card =
        theme === 'light'
            ? 'bg-white border-gray-200'
            : theme === 'gold'
            ? 'bg-[#0b1220] border-amber-500/25'
            : 'bg-slate-900 border-slate-800';

    const subtle =
        theme === 'light'
            ? 'text-gray-600'
            : theme === 'gold'
            ? 'text-amber-100/70'
            : 'text-slate-300';

    const accentBar =
        accent === 'gold'
            ? 'bg-amber-400'
            : accent === 'blue'
              ? theme === 'light'
                  ? 'bg-blue-600'
                  : 'bg-blue-400'
              : accent === 'green'
                  ? theme === 'light'
                      ? 'bg-emerald-600'
                      : 'bg-emerald-400'
                  : accent === 'rose'
                      ? theme === 'light'
                          ? 'bg-rose-600'
                          : 'bg-rose-400'
                      : theme === 'light'
                          ? 'bg-gray-900'
                          : 'bg-slate-200';

    return (
        <div className={`relative overflow-hidden rounded-2xl border shadow-sm p-5 ${card}`}>
            <div className={`absolute left-0 top-0 h-full w-1 ${accentBar}`} />

            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <div className={`text-sm ${subtle}`}>{title}</div>
                    <div className="mt-2 flex items-baseline gap-2">
                        <div className={`text-3xl font-bold tracking-tight ${isDark ? 'text-slate-50' : 'text-gray-900'}`}>
                            {count.toLocaleString()}
                        </div>
                        {suffix ? <div className={`text-sm ${subtle}`}>{suffix}</div> : null}
                    </div>

                    <div className="mt-3 flex items-center gap-2">
                        {chip}
                        {hint ? <span className={`text-xs ${subtle} truncate`}>{hint}</span> : null}
                    </div>

                    <Sparkline data={spark} theme={theme} />
                </div>

                <div
                    className={
                        'shrink-0 h-11 w-11 rounded-2xl flex items-center justify-center text-xl ' +
                        (theme === 'light'
                            ? 'bg-gray-100'
                            : theme === 'gold'
                            ? 'bg-amber-500/15 text-amber-200'
                            : 'bg-slate-800 text-slate-200')
                    }
                >
                    {icon}
                </div>
            </div>
        </div>
    );
}

function Panel({ title, subtitle, theme, right = null, children }) {
    const isDark = theme !== 'light';

    const panel =
        theme === 'light'
            ? 'bg-white border-gray-200'
            : theme === 'gold'
            ? 'bg-[#0b1220] border-amber-500/25'
            : 'bg-slate-900 border-slate-800';

    const titleCls = isDark ? 'text-slate-50' : 'text-gray-900';
    const sub =
        theme === 'light'
            ? 'text-gray-600'
            : theme === 'gold'
            ? 'text-amber-100/70'
            : 'text-slate-300';

    return (
        <div className={`rounded-2xl border shadow-sm ${panel}`}>
            <div className="p-5 flex items-start justify-between gap-3">
                <div>
                    <h3 className={`text-lg font-semibold ${titleCls}`}>{title}</h3>
                    {subtitle ? <p className={`text-sm mt-1 ${sub}`}>{subtitle}</p> : null}
                </div>
                {right ? <div className="shrink-0">{right}</div> : null}
            </div>
            <div className="px-5 pb-5">{children}</div>
        </div>
    );
}

function StatusPill({ label, theme }) {
    const cls =
        label === 'Confirmed'
            ? theme === 'light'
                ? 'bg-emerald-100 text-emerald-800'
                : 'bg-emerald-500/15 text-emerald-200'
            : label === 'Pending'
              ? theme === 'light'
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-amber-500/15 text-amber-200'
              : label === 'Overdue'
                  ? theme === 'light'
                      ? 'bg-rose-100 text-rose-800'
                      : 'bg-rose-500/15 text-rose-200'
                  : theme === 'light'
                      ? 'bg-gray-100 text-gray-800'
                      : 'bg-slate-700/35 text-slate-200';

    return <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${cls}`}>{label}</span>;
}

function Segmented({ value, setValue, theme }) {
    const wrap =
        theme === 'light'
            ? 'bg-gray-100 border-gray-200'
            : theme === 'gold'
            ? 'bg-amber-500/10 border-amber-500/20'
            : 'bg-slate-800/60 border-slate-700';

    const btn = (v) =>
        'px-3 py-1.5 rounded-xl text-sm font-semibold transition ' +
        (value === v
            ? theme === 'light'
                ? 'bg-white text-gray-900 shadow border border-gray-200'
                : theme === 'gold'
                ? 'bg-amber-400 text-slate-900 shadow'
                : 'bg-slate-50 text-slate-900 shadow'
            : theme === 'light'
              ? 'text-gray-600 hover:text-gray-900'
              : 'text-slate-200 hover:bg-white/5');

    return (
        <div className={`inline-flex p-1 border rounded-2xl ${wrap}`}>
            <button type="button" className={btn('today')} onClick={() => setValue('today')}>
                Today
            </button>
            <button type="button" className={btn('7d')} onClick={() => setValue('7d')}>
                7 Days
            </button>
            <button type="button" className={btn('30d')} onClick={() => setValue('30d')}>
                30 Days
            </button>
        </div>
    );
}

export default function Dashboard() {
    const { theme } = useTheme();
    const isDark = theme !== 'light';

    const pageText = isDark ? 'text-slate-50' : 'text-gray-900';
    const subText =
        theme === 'light'
            ? 'text-gray-600'
            : theme === 'gold'
            ? 'text-amber-100/70'
            : 'text-slate-300';

    const [range, setRange] = useState('7d');

    // ✅ Dummy “range-based” KPI values + sparkline data
    const dataByRange = useMemo(() => {
        return {
            today: {
                k: {
                    totalItems: 120,
                    availableItems: 84,
                    onRent: 36,
                    bookings: 3,
                    revenue: 650,
                    pickups: 2,
                    returns: 1,
                    overdue: 1,
                    quotes: 2,
                    damage: 1,
                    utilization: 64,
                    customers: 1,
                },
                s: {
                    totalItems: [110, 112, 114, 116, 118, 119, 120],
                    availableItems: [80, 79, 82, 81, 85, 86, 84],
                    onRent: [30, 31, 32, 33, 34, 34, 36],
                    bookings: [1, 1, 2, 2, 2, 3, 3],
                    revenue: [100, 180, 250, 310, 400, 520, 650],
                    overdue: [0, 0, 0, 1, 1, 1, 1],
                },
            },
            '7d': {
                k: {
                    totalItems: 120,
                    availableItems: 86,
                    onRent: 34,
                    bookings: 12,
                    revenue: 5400,
                    pickups: 8,
                    returns: 7,
                    overdue: 2,
                    quotes: 5,
                    damage: 1,
                    utilization: 62,
                    customers: 6,
                },
                s: {
                    totalItems: [110, 112, 114, 116, 118, 119, 120],
                    availableItems: [92, 89, 88, 90, 87, 86, 86],
                    onRent: [28, 29, 31, 32, 33, 34, 34],
                    bookings: [6, 7, 9, 10, 11, 12, 12],
                    revenue: [3000, 3200, 3500, 4100, 4700, 5100, 5400],
                    overdue: [0, 1, 1, 1, 2, 2, 2],
                },
            },
            '30d': {
                k: {
                    totalItems: 120,
                    availableItems: 88,
                    onRent: 32,
                    bookings: 44,
                    revenue: 16800,
                    pickups: 28,
                    returns: 25,
                    overdue: 4,
                    quotes: 14,
                    damage: 3,
                    utilization: 58,
                    customers: 18,
                },
                s: {
                    totalItems: [102, 105, 108, 110, 113, 116, 120],
                    availableItems: [95, 92, 90, 88, 87, 88, 88],
                    onRent: [22, 25, 27, 29, 30, 31, 32],
                    bookings: [18, 22, 26, 30, 35, 40, 44],
                    revenue: [9000, 10200, 11500, 12800, 14200, 15600, 16800],
                    overdue: [1, 1, 2, 2, 3, 4, 4],
                },
            },
        };
    }, []);

    const k = dataByRange[range].k;
    const s = dataByRange[range].s;

    const topBtnPrimary =
        theme === 'light'
            ? 'bg-gray-900 text-white border-gray-900 hover:opacity-90'
            : theme === 'gold'
            ? 'bg-amber-400 text-slate-900 border-amber-400 hover:opacity-90'
            : 'bg-slate-50 text-slate-900 border-slate-50 hover:opacity-90';

    const topBtnGhost =
        theme === 'light'
            ? 'bg-white text-gray-900 border-gray-200 hover:bg-gray-50'
            : 'bg-transparent text-slate-50 border-slate-700 hover:bg-slate-800/60';

    const recentBookings = [
        { id: 1, event: 'Wedding – Sarah', date: 'Dec 14, 2025', customer: 'Sarah M.', status: 'Confirmed' },
        { id: 2, event: 'Birthday – Ali', date: 'Dec 16, 2025', customer: 'Ali K.', status: 'Pending' },
        { id: 3, event: 'Corporate Event', date: 'Dec 20, 2025', customer: 'NorthCo', status: 'Confirmed' },
        { id: 4, event: 'Engagement Party', date: 'Dec 22, 2025', customer: 'Ayesha', status: 'Pending' },
    ];

    const onRentItems = [
        { id: 1, name: 'White Sofa 3-Seater', qty: 2, due: 'Dec 15, 2025', status: 'Confirmed' },
        { id: 2, name: 'Round Table (8 chairs)', qty: 6, due: 'Dec 16, 2025', status: 'Pending' },
        { id: 3, name: 'Gold Arch', qty: 1, due: 'Dec 14, 2025', status: 'Overdue' },
    ];

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h2 className={`text-xl font-semibold leading-tight ${pageText}`}>Dashboard</h2>
                        <p className={`text-sm mt-1 ${subText}`}>
                            Beautiful overview (dummy data for now). Next: tenant-scoped real KPIs from DB.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <Segmented value={range} setValue={setRange} theme={theme} />

                        <Link
                            href={route().has('items.create') ? route('items.create') : '#'}
                            className={`px-3 py-2 rounded-xl text-sm font-semibold border transition ${topBtnPrimary}`}
                        >
                            + Add Item
                        </Link>

                        <Link
                            href={route().has('planner') ? route('planner') : '#'}
                            className={`px-3 py-2 rounded-xl text-sm font-semibold border transition ${topBtnGhost}`}
                        >
                            Open Planner
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title="Dashboard" />

            <div className="py-8">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 space-y-6">
                    {/* KPI GRID */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                        <KpiCard title="Total Items" value={k.totalItems} icon="📦" theme={theme}
                            chip={<Chip theme={theme} tone="up">+4%</Chip>} hint="inventory growth" accent="blue" spark={s.totalItems} />

                        <KpiCard title="Available" value={k.availableItems} icon="✅" theme={theme}
                            chip={<Chip theme={theme}>In stock</Chip>} hint="ready to rent" accent="green" spark={s.availableItems} />

                        <KpiCard title="On Rent" value={k.onRent} icon="🚚" theme={theme}
                            chip={<Chip theme={theme} tone="up">Active</Chip>} hint="currently out" accent="gold" spark={s.onRent} />

                        <KpiCard title={`Bookings (${range})`} value={k.bookings} icon="📅" theme={theme}
                            chip={<Chip theme={theme} tone="up">Trending</Chip>} hint="new/active" accent="blue" spark={s.bookings} />

                        <KpiCard title="Revenue" value={k.revenue} icon="💰" theme={theme}
                            suffix="CAD" chip={<Chip theme={theme} tone="up">+12%</Chip>} hint="estimated" accent="green" spark={s.revenue} />

                        <KpiCard title="Overdue" value={k.overdue} icon="⏰" theme={theme}
                            chip={<Chip theme={theme} tone="down">Alert</Chip>} hint="needs action" accent="rose" spark={s.overdue} />

                        <KpiCard title="Pickups" value={k.pickups} icon="📦" theme={theme}
                            chip={<Chip theme={theme}>Upcoming</Chip>} hint="scheduled" accent="gold" spark={[1,2,2,3,2,3,4]} />

                        <KpiCard title="Returns" value={k.returns} icon="↩️" theme={theme}
                            chip={<Chip theme={theme}>Upcoming</Chip>} hint="scheduled" accent="gold" spark={[1,1,2,2,3,2,3]} />

                        <KpiCard title="Quotes Pending" value={k.quotes} icon="🧾" theme={theme}
                            chip={<Chip theme={theme}>Pipeline</Chip>} hint="not confirmed" accent="blue" spark={[3,4,4,5,6,5,5]} />

                        <KpiCard title="Damage Open" value={k.damage} icon="🛠️" theme={theme}
                            chip={<Chip theme={theme} tone="down">Check</Chip>} hint="maintenance" accent="rose" spark={[0,1,1,1,2,2,3]} />

                        <KpiCard title="Utilization" value={k.utilization} icon="⚡" theme={theme}
                            suffix="%" chip={<Chip theme={theme} tone="up">Good</Chip>} hint="inventory usage" accent="green" spark={[48,50,52,55,57,60,62]} />

                        <KpiCard title="New Customers" value={k.customers} icon="👥" theme={theme}
                            chip={<Chip theme={theme}>New</Chip>} hint="in this range" accent="blue" spark={[1,2,2,3,4,5,6]} />
                    </div>

                    {/* PANELS */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <Panel
                            title="Recent Bookings"
                            subtitle="Latest activity in your tenant."
                            theme={theme}
                            right={
                                <Link
                                    href={route().has('bookings.index') ? route('bookings.index') : '#'}
                                    className={
                                        'text-sm font-semibold underline underline-offset-4 ' +
                                        (theme === 'light' ? 'text-gray-900' : 'text-amber-200')
                                    }
                                >
                                    View all
                                </Link>
                            }
                        >
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead className={theme === 'light' ? 'text-gray-500' : 'text-slate-300'}>
                                        <tr>
                                            <th className="text-left py-2">Event</th>
                                            <th className="text-left py-2">Date</th>
                                            <th className="text-left py-2">Customer</th>
                                            <th className="text-left py-2">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {recentBookings.map((b) => (
                                            <tr key={b.id} className={theme === 'light' ? 'border-t border-gray-100' : 'border-t border-slate-800'}>
                                                <td className={isDark ? 'py-3 text-slate-50' : 'py-3 text-gray-900'}>{b.event}</td>
                                                <td className={`py-3 ${subText}`}>{b.date}</td>
                                                <td className={`py-3 ${subText}`}>{b.customer}</td>
                                                <td className="py-3">
                                                    <StatusPill label={b.status} theme={theme} />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </Panel>

                        <Panel title="Quick Actions" subtitle="Shortcuts to common tasks." theme={theme}>
                            <div className="grid grid-cols-1 gap-3">
                                {[
                                    { title: 'Manage Inventory', desc: 'View items, stock, maintenance.', icon: '📦', href: route().has('items.index') ? route('items.index') : '#' },
                                    { title: 'Bookings', desc: 'Confirm pending events quickly.', icon: '📅', href: route().has('bookings.index') ? route('bookings.index') : '#' },
                                    { title: 'Open Planner', desc: 'Design layout and export PDF.', icon: '🛋️', href: route().has('planner') ? route('planner') : '#' },
                                    { title: 'Decor Library', desc: 'Upload decor items for planner.', icon: '🧩', href: route().has('decor-library.index') ? route('decor-library.index') : '#' },
                                ].map((a, i) => (
                                    <Link
                                        key={i}
                                        href={a.href}
                                        className={
                                            'rounded-xl p-4 border transition ' +
                                            (theme === 'light'
                                                ? 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                                                : 'border-slate-800 hover:bg-slate-800/60')
                                        }
                                    >
                                        <div className="flex items-center justify-between gap-3">
                                            <div className="min-w-0">
                                                <div className={isDark ? 'font-semibold text-slate-50' : 'font-semibold text-gray-900'}>{a.title}</div>
                                                <div className={`text-sm ${subText} truncate`}>{a.desc}</div>
                                            </div>
                                            <div className="text-xl">{a.icon}</div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </Panel>

                        <Panel title="Items On Rent" subtitle="Due dates and priority returns." theme={theme}>
                            <div className="space-y-3">
                                {onRentItems.map((it) => (
                                    <div
                                        key={it.id}
                                        className={
                                            'rounded-xl p-4 border ' +
                                            (theme === 'light'
                                                ? 'bg-white border-gray-200'
                                                : 'border-slate-800 bg-black/10')
                                        }
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className={isDark ? 'font-semibold text-slate-50' : 'font-semibold text-gray-900'}>
                                                {it.name}
                                            </div>
                                            <StatusPill label={it.status} theme={theme} />
                                        </div>
                                        <div className={`text-sm mt-1 ${subText}`}>
                                            Qty: {it.qty} • Due: {it.due}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Panel>
                    </div>

                    <div className={`text-xs ${subText}`}>
                        Next: I can connect these KPIs to real DB values (tenant scoped) by adding a `/dashboard/metrics` endpoint or passing props from controller.
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
