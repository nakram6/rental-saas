import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function CustomersReport() {
  return (
    <AuthenticatedLayout header={<h2 className="text-xl font-semibold">Customer Report</h2>}>
      <Head title="Reports - Customers" />

      <div className="max-w-7xl mx-auto space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-2xl border p-5">👥 Total Customers: <b>62</b></div>
          <div className="rounded-2xl border p-5">⭐ VIP Customers: <b>11</b></div>
          <div className="rounded-2xl border p-5">🆕 New (30 days): <b>8</b></div>
          <div className="rounded-2xl border p-5">💸 Avg Spend: <b>$1,120</b></div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
