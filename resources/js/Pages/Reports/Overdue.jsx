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

export default function OverdueReport() {
  const { theme } = useTheme();

  const rows = useMemo(() => ([
    { id: 1, booking: 'BK-09990', customer: 'Ayesha Qureshi', item: 'Stage Carpet', due: '2025-12-08', days: 4, fee: 80 },
    { id: 2, booking: 'BK-09991', customer: 'Ali Khan', item: 'White Sofa 3-seater', due: '2025-12-09', days: 3, fee: 60 },
  ]), []);

  return (
    <AuthenticatedLayout header={<h2 className="text-xl font-semibold">Overdue Report</h2>}>
      <Head title="Reports - Overdue" />
      <div className="max-w-7xl mx-auto space-y-6">
        <Panel theme={theme}>
          <div className="p-5">
            <div className="text-lg font-semibold">Overdue Rentals</div>
            <div className="text-sm opacity-70 mt-1">Dummy overdue list + late fees</div>
          </div>

          <div className="px-5 pb-5 overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="opacity-70">
                <tr>
                  <th className="text-left py-2">Booking</th>
                  <th className="text-left py-2">Customer</th>
                  <th className="text-left py-2">Item</th>
                  <th className="text-left py-2">Due Date</th>
                  <th className="text-left py-2">Days Late</th>
                  <th className="text-left py-2">Late Fee</th>
                </tr>
              </thead>
              <tbody>
                {rows.map(r => (
                  <tr key={r.id} className="border-t border-black/5 dark:border-white/10">
                    <td className="py-3 font-semibold">{r.booking}</td>
                    <td className="py-3">{r.customer}</td>
                    <td className="py-3">{r.item}</td>
                    <td className="py-3">{r.due}</td>
                    <td className="py-3">{r.days}</td>
                    <td className="py-3">${r.fee}</td>
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
