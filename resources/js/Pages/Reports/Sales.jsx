import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useTheme } from '@/Context/ThemeContext';

function Stat({ title, value, icon }) {
  return (
    <div className="rounded-2xl border p-5 shadow-sm">
      <div className="flex justify-between items-start">
        <div>
          <div className="text-sm opacity-70">{title}</div>
          <div className="text-3xl font-bold mt-1">{value}</div>
        </div>
        <div className="text-2xl">{icon}</div>
      </div>
    </div>
  );
}

export default function SalesReport() {
  return (
    <AuthenticatedLayout header={<h2 className="text-xl font-semibold">Sales Report</h2>}>
      <Head title="Reports - Sales" />

      <div className="max-w-7xl mx-auto space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Stat title="Total Revenue" value="$18,450" icon="💰" />
          <Stat title="This Month" value="$6,200" icon="📅" />
          <Stat title="Avg Booking Value" value="$820" icon="📊" />
          <Stat title="Paid Invoices" value="27" icon="✅" />
        </div>

        <div className="rounded-2xl border p-5">
          <h3 className="font-semibold text-lg">Sales Summary</h3>
          <p className="text-sm opacity-70 mt-1">
            Dummy sales totals grouped by date / booking (connect to invoices later).
          </p>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
