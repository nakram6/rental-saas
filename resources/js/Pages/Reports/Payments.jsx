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

export default function PaymentsReport() {
  const { theme } = useTheme();

  const rows = useMemo(() => ([
    { id: 1, invoice: 'INV-20010', customer: 'NorthCo Events', amount: 1200, method: 'E-Transfer', status: 'Paid', date: '2025-12-11' },
    { id: 2, invoice: 'INV-20011', customer: 'Sarah Malik', amount: 450, method: 'Cash', status: 'Pending', date: '2025-12-12' },
  ]), []);

  return (
    <AuthenticatedLayout header={<h2 className="text-xl font-semibold">Payments Report</h2>}>
      <Head title="Reports - Payments" />

      <div className="max-w-7xl mx-auto space-y-6">
        <Panel theme={theme}>
          <div className="p-5">
            <div className="text-lg font-semibold">Payments</div>
            <div className="text-sm opacity-70 mt-1">Dummy payments list (connect invoices later)</div>
          </div>

          <div className="px-5 pb-5 overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="opacity-70">
                <tr>
                  <th className="text-left py-2">Invoice</th>
                  <th className="text-left py-2">Customer</th>
                  <th className="text-left py-2">Amount</th>
                  <th className="text-left py-2">Method</th>
                  <th className="text-left py-2">Status</th>
                  <th className="text-left py-2">Date</th>
                </tr>
              </thead>
              <tbody>
                {rows.map(r => (
                  <tr key={r.id} className="border-t border-black/5 dark:border-white/10">
                    <td className="py-3 font-semibold">{r.invoice}</td>
                    <td className="py-3">{r.customer}</td>
                    <td className="py-3">${r.amount.toLocaleString()}</td>
                    <td className="py-3">{r.method}</td>
                    <td className="py-3">{r.status}</td>
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
