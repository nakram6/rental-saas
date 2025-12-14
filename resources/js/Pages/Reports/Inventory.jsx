import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function InventoryReport() {
  return (
    <AuthenticatedLayout header={<h2 className="text-xl font-semibold">Inventory Report</h2>}>
      <Head title="Reports - Inventory" />

      <div className="max-w-7xl mx-auto space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-2xl border p-5">📦 Total Items: <b>146</b></div>
          <div className="rounded-2xl border p-5">🟢 Available: <b>102</b></div>
          <div className="rounded-2xl border p-5">🚚 On Rent: <b>31</b></div>
          <div className="rounded-2xl border p-5">🛠 Maintenance: <b>13</b></div>
        </div>

        <div className="rounded-2xl border p-5">
          <p className="text-sm opacity-70">
            Inventory health overview (dummy). Later connect to items + rentals + maintenance.
          </p>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
