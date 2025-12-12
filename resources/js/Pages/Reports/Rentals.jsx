import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useTheme } from '@/Context/ThemeContext';
import { useMemo } from 'react';

function Panel({ children, theme }) {
  const cls = theme === 'light'
    ? 'bg-white border-gray-200'
    : theme === 'gold'
    ? 'bg-[#0b1220] border-amber-500/25'
    : 'bg-slate-900 border-slate-800';
  return <div className={`rounded-2xl border shadow-sm ${cls}`}>{children}</div>;
}

function StatCard({ title, value, icon, theme }) {
  const cls = theme === 'light'
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

export default function RentalsReport() {
  const { theme } = useTheme();

  const rows = useMemo(() => ([
    { id: 1, booking: 'BK-10021', customer: 'Sarah Malik', item: 'White Sofa 3-seater', start: '2025-12-10', end: '2025-12-12', status: 'On Rent' },
    { id: 2, booking: 'BK-10022', customer: 'NorthCo Events', item: 'Round Table (8 chairs)', start: '2025-12-11', end: '2025-12-13', status: 'On Rent' },
    { id: 3, booking: 'BK-10023', customer: 'Ali Khan', item: 'Gold Arch Backdrop', start: '2025-12-12', end: '2025-12-12', status: 'Pickup Today' },
  ]), []);

  return (
    <AuthenticatedLayout header={<h2 className="text-xl font-semibold">Rentals Report</h2>}>
      <Head title="Reports - Rentals" />
      <div className="max-w-7xl mx-auto space-y-6">

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard theme={theme} title="On Rent Now" value="7" icon="🚚" />
          <StatCard theme={theme} title="Pickup Today" value="3" icon="📦" />
          <StatCard theme={theme} title="Return Today" value="2" icon="↩️" />
          <StatCard theme={theme} title="Utilization (dummy)" value="68%" icon="📊" />
        </div>

        <Panel theme={theme}>
          <div className="p-5">
            <div className="text-lg font-semibold">Currently Active Rentals</div>
            <div className="text-sm opacity-70 mt-1">Dummy data (connect to bookings + items later)</div>
          </div>

          <div className="px-5 pb-5 overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="opacity-70">
                <tr>
                  <th className="text-left py-2">Booking</th>
                  <th className="text-left py-2">Customer</th>
                  <th className="text-left py-2">Item</th>
                  <th className="text-left py-2">Start</th>
                  <th className="text-left py-2">End</th>
                  <th className="text-left py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {rows.map(r => (
                  <tr key={r.id} className="border-t border-black/5 dark:border-white/10">
                    <td className="py-3 font-semibold">{r.booking}</td>
                    <td className="py-3">{r.customer}</td>
                    <td className="py-3">{r.item}</td>
                    <td className="py-3">{r.start}</td>
                    <td className="py-3">{r.end}</td>
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
