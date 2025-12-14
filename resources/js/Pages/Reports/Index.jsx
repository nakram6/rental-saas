import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { useEffect, useMemo, useState } from 'react';
import { useTheme } from '@/Context/ThemeContext';

const RECENT_KEY = 'reports_recent_v1';
const FAV_KEY = 'reports_fav_v1';

function safeHas(name) {
    try {
        return route().has(name);
    } catch {
        return false;
    }
}
function safeHref(name) {
    try {
        return route().has(name) ? route(name) : '#';
    } catch {
        return '#';
    }
}

function Chip({ active, children, onClick, theme }) {
    const base = 'px-3 py-1.5 rounded-full text-xs font-semibold border transition';
    const cls =
        theme === 'light'
            ? active
                ? 'bg-gray-900 text-white border-gray-900'
                : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
            : active
            ? 'bg-white/10 text-white border-white/15'
            : 'bg-transparent text-white/70 border-white/10 hover:bg-white/5';

    return (
        <button type="button" onClick={onClick} className={`${base} ${cls}`}>
            {children}
        </button>
    );
}

function MiniBars({ values = [40, 60, 55, 80, 70, 95], theme }) {
    const track =
        theme === 'light'
            ? 'bg-gray-200'
            : theme === 'gold'
            ? 'bg-white/10'
            : 'bg-white/10';

    const fill =
        theme === 'light'
            ? 'bg-gray-900'
            : theme === 'gold'
            ? 'bg-amber-400'
            : 'bg-slate-100';

    return (
        <div className="flex items-end gap-1 h-10">
            {values.map((v, i) => (
                <div key={i} className={`w-2 rounded-full ${track} overflow-hidden`}>
                    <div className={`${fill} w-full rounded-full`} style={{ height: `${v}%` }} />
                </div>
            ))}
        </div>
    );
}

function ReportCard({ r, theme, isFav, onToggleFav, onOpen }) {
    const exists = safeHas(r.route);

    const bg =
        theme === 'light'
            ? 'bg-white border-gray-200'
            : theme === 'gold'
            ? 'bg-[#0b1220] border-amber-500/25'
            : 'bg-slate-900 border-slate-800';

    const glow =
        theme === 'light'
            ? 'from-indigo-500/10 via-fuchsia-500/10 to-emerald-500/10'
            : theme === 'gold'
            ? 'from-amber-400/15 via-yellow-400/10 to-cyan-400/10'
            : 'from-sky-400/10 via-purple-400/10 to-emerald-400/10';

    const title = theme === 'light' ? 'text-gray-900' : 'text-white';
    const sub = theme === 'light' ? 'text-gray-600' : theme === 'gold' ? 'text-amber-100/70' : 'text-white/70';

    const badge =
        exists
            ? theme === 'light'
                ? 'bg-emerald-100 text-emerald-800'
                : 'bg-emerald-500/15 text-emerald-200'
            : theme === 'light'
            ? 'bg-gray-100 text-gray-700'
            : 'bg-white/10 text-white/70';

    const iconWrap =
        theme === 'light'
            ? 'bg-gray-100 text-gray-900'
            : theme === 'gold'
            ? 'bg-amber-500/15 text-amber-200'
            : 'bg-white/10 text-white';

    const favBtn =
        theme === 'light'
            ? 'bg-white border-gray-200 hover:bg-gray-50'
            : 'bg-white/5 border-white/10 hover:bg-white/10';

    const Comp = exists ? Link : 'div';

    return (
        <Comp
            href={exists ? safeHref(r.route) : undefined}
            className={
                'group relative overflow-hidden rounded-2xl border shadow-sm transition transform hover:-translate-y-0.5 hover:shadow-lg ' +
                bg +
                ' ' +
                (exists ? 'cursor-pointer' : 'cursor-not-allowed opacity-80')
            }
            onClick={(e) => {
                if (!exists) {
                    e.preventDefault?.();
                    return;
                }
                onOpen?.(r);
            }}
        >
            <div className={`absolute inset-0 bg-gradient-to-br ${glow} opacity-0 group-hover:opacity-100 transition`} />
            <div className="absolute -top-10 -right-10 h-28 w-28 rounded-full bg-white/10 blur-2xl" />
            <div className="absolute -bottom-12 -left-12 h-28 w-28 rounded-full bg-white/10 blur-2xl" />

            <div className="relative p-5">
                <div className="flex items-start justify-between gap-3">
                    <div className={`h-12 w-12 rounded-2xl flex items-center justify-center text-2xl ${iconWrap}`}>
                        {r.icon}
                    </div>

                    <div className="flex items-center gap-2">
                        <div className={`px-2.5 py-1 rounded-full text-xs font-semibold ${badge}`}>
                            {exists ? 'Ready' : 'Coming soon'}
                        </div>

                        {/* Favorite */}
                        <button
                            type="button"
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                onToggleFav(r);
                            }}
                            className={`h-9 w-9 rounded-xl border flex items-center justify-center ${favBtn}`}
                            title={isFav ? 'Remove favorite' : 'Add favorite'}
                        >
                            <span className={isFav ? 'opacity-100' : 'opacity-60'}>{isFav ? '★' : '☆'}</span>
                        </button>
                    </div>
                </div>

                <div className="mt-4">
                    <div className={`text-lg font-bold tracking-tight ${title}`}>{r.name}</div>
                    <div className={`text-sm mt-1 ${sub}`}>{r.desc}</div>
                </div>

                <div className="mt-4 flex items-end justify-between gap-4">
                    <div>
                        <div className={`text-xs ${sub}`}>{r.group}</div>
                        <div
                            className={
                                'mt-1 text-sm font-semibold underline underline-offset-4 ' +
                                (theme === 'light' ? 'text-gray-900' : theme === 'gold' ? 'text-amber-200' : 'text-white')
                            }
                        >
                            Open →
                        </div>
                    </div>

                    {/* Mini chart */}
                    <MiniBars values={r.spark} theme={theme} />
                </div>
            </div>
        </Comp>
    );
}

export default function ReportsHome() {
    const { theme } = useTheme();

    const allReports = useMemo(
        () => [
            { name: 'Sales', route: 'reports.sales', icon: '💰', desc: 'Revenue, invoices, paid vs pending', group: 'Finance', spark: [20, 40, 55, 60, 70, 90] },
            { name: 'Payments', route: 'reports.payments', icon: '💳', desc: 'Payment methods and statuses', group: 'Finance', spark: [30, 35, 55, 50, 65, 75] },

            { name: 'Customers', route: 'reports.customers', icon: '👥', desc: 'VIP, new customers, spending', group: 'Customers', spark: [25, 30, 45, 55, 75, 80] },
            { name: 'Quotes', route: 'reports.quotes', icon: '🧾', desc: 'Quote funnel: new → sent → approved', group: 'Customers', spark: [40, 55, 52, 60, 70, 68] },

            { name: 'Inventory', route: 'reports.inventory', icon: '📦', desc: 'Stock health and availability', group: 'Inventory', spark: [70, 68, 65, 60, 58, 55] },
            { name: 'Utilization', route: 'reports.utilization', icon: '📊', desc: 'Usage by item / category', group: 'Inventory', spark: [35, 40, 55, 80, 75, 92] },

            { name: 'Bookings', route: 'reports.bookings', icon: '📅', desc: 'Booking volume and trends', group: 'Operations', spark: [15, 28, 35, 50, 62, 70] },
            { name: 'Rentals', route: 'reports.rentals', icon: '🚚', desc: 'On rent, pickup/return today', group: 'Operations', spark: [40, 38, 45, 55, 60, 58] },
            { name: 'Overdue', route: 'reports.overdue', icon: '⏰', desc: 'Late returns and fees', group: 'Operations', spark: [10, 12, 9, 14, 16, 11] },

            { name: 'Damaged / Loss', route: 'reports.damaged', icon: '🛠️', desc: 'Damage log and cost impact', group: 'Operations', spark: [5, 8, 6, 10, 12, 9] },
            { name: 'Maintenance', route: 'reports.maintenance', icon: '🔧', desc: 'Maintenance schedule & expenses', group: 'Operations', spark: [25, 20, 30, 28, 35, 40] },

            { name: 'Planner', route: 'reports.planner', icon: '🛋️', desc: 'Layouts, exports, most used items', group: 'Planner', spark: [20, 35, 50, 60, 55, 72] },
        ],
        []
    );

    const [q, setQ] = useState('');
    const [filter, setFilter] = useState('All');
    const groups = useMemo(() => ['All', 'Finance', 'Customers', 'Inventory', 'Operations', 'Planner'], []);

    const [favorites, setFavorites] = useState([]);
    const [recent, setRecent] = useState([]);

    // load localStorage
    useEffect(() => {
        try {
            const fav = JSON.parse(localStorage.getItem(FAV_KEY) || '[]');
            const rec = JSON.parse(localStorage.getItem(RECENT_KEY) || '[]');
            setFavorites(fav);
            setRecent(rec);
        } catch {
            setFavorites([]);
            setRecent([]);
        }
    }, []);

    const saveFav = (list) => {
        setFavorites(list);
        localStorage.setItem(FAV_KEY, JSON.stringify(list));
    };

    const saveRecent = (list) => {
        setRecent(list);
        localStorage.setItem(RECENT_KEY, JSON.stringify(list));
    };

    const onToggleFav = (r) => {
        const exists = favorites.includes(r.route);
        const next = exists ? favorites.filter((x) => x !== r.route) : [r.route, ...favorites].slice(0, 8);
        saveFav(next);
    };

    const onOpen = (r) => {
        const next = [r.route, ...recent.filter((x) => x !== r.route)].slice(0, 6);
        saveRecent(next);
    };

    const filtered = useMemo(() => {
        const query = q.trim().toLowerCase();
        return allReports.filter((r) => {
            const matchesGroup = filter === 'All' || r.group === filter;
            const matchesQ =
                !query ||
                r.name.toLowerCase().includes(query) ||
                r.desc.toLowerCase().includes(query) ||
                r.group.toLowerCase().includes(query);

            return matchesGroup && matchesQ;
        });
    }, [allReports, q, filter]);

    const favReports = useMemo(
        () => allReports.filter((r) => favorites.includes(r.route)),
        [allReports, favorites]
    );
    const recentReports = useMemo(
        () => recent.map((routeName) => allReports.find((r) => r.route === routeName)).filter(Boolean),
        [recent, allReports]
    );

    const title = theme === 'light' ? 'text-gray-900' : 'text-white';
    const sub = theme === 'light' ? 'text-gray-600' : theme === 'gold' ? 'text-amber-100/70' : 'text-white/70';

    const inputCls =
        theme === 'light'
            ? 'bg-white border-gray-200 text-gray-900 placeholder:text-gray-400'
            : 'bg-black/10 border-white/10 text-white placeholder:text-white/40';

    const sectionCard =
        theme === 'light'
            ? 'bg-white border-gray-200'
            : theme === 'gold'
            ? 'bg-[#0b1220] border-amber-500/25'
            : 'bg-slate-900 border-slate-800';

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
                        <div>
                            <h2 className={`text-2xl font-bold tracking-tight ${title}`}>Reports</h2>
                            <p className={`text-sm mt-1 ${sub}`}>Favorites + recent + modern cards (dummy now, real DB later).</p>
                        </div>

                        <div className="w-full sm:w-96">
                            <input
                                value={q}
                                onChange={(e) => setQ(e.target.value)}
                                placeholder="Search reports (sales, customers, overdue...)"
                                className={`w-full rounded-xl border px-3 py-2 text-sm outline-none ${inputCls}`}
                            />
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {groups.map((g) => (
                            <Chip key={g} theme={theme} active={filter === g} onClick={() => setFilter(g)}>
                                {g}
                            </Chip>
                        ))}
                        <div className={`text-xs self-center ml-auto ${sub}`}>{filtered.length} report(s)</div>
                    </div>
                </div>
            }
        >
            <Head title="Reports" />

            <div className="max-w-7xl mx-auto space-y-6">
                {/* Favorites */}
                <div className={`rounded-2xl border shadow-sm ${sectionCard}`}>
                    <div className="p-5 flex items-center justify-between">
                        <div>
                            <div className={`text-lg font-semibold ${title}`}>Favorites</div>
                            <div className={`text-sm ${sub}`}>Quick access to the reports you use most.</div>
                        </div>
                        <div className={`text-xs ${sub}`}>{favReports.length}/8</div>
                    </div>

                    <div className="px-5 pb-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {favReports.length ? (
                            favReports.map((r) => (
                                <ReportCard
                                    key={r.route}
                                    r={r}
                                    theme={theme}
                                    isFav={true}
                                    onToggleFav={onToggleFav}
                                    onOpen={onOpen}
                                />
                            ))
                        ) : (
                            <div className={`text-sm ${sub} px-1 pb-2`}>
                                No favorites yet. Click ☆ on any report card.
                            </div>
                        )}
                    </div>
                </div>

                {/* Recent */}
                <div className={`rounded-2xl border shadow-sm ${sectionCard}`}>
                    <div className="p-5 flex items-center justify-between">
                        <div>
                            <div className={`text-lg font-semibold ${title}`}>Recent</div>
                            <div className={`text-sm ${sub}`}>Your recently opened reports.</div>
                        </div>
                        <button
                            type="button"
                            onClick={() => saveRecent([])}
                            className={
                                'text-xs font-semibold underline underline-offset-4 ' +
                                (theme === 'light' ? 'text-gray-900' : theme === 'gold' ? 'text-amber-200' : 'text-white')
                            }
                        >
                            Clear
                        </button>
                    </div>

                    <div className="px-5 pb-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {recentReports.length ? (
                            recentReports.map((r) => (
                                <ReportCard
                                    key={r.route}
                                    r={r}
                                    theme={theme}
                                    isFav={favorites.includes(r.route)}
                                    onToggleFav={onToggleFav}
                                    onOpen={onOpen}
                                />
                            ))
                        ) : (
                            <div className={`text-sm ${sub} px-1 pb-2`}>
                                No recent activity yet. Open any report to start building history.
                            </div>
                        )}
                    </div>
                </div>

                {/* All Reports */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filtered.map((r) => (
                        <ReportCard
                            key={r.route}
                            r={r}
                            theme={theme}
                            isFav={favorites.includes(r.route)}
                            onToggleFav={onToggleFav}
                            onOpen={onOpen}
                        />
                    ))}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
