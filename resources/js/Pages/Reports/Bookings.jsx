import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function BookingsReport() {
  return (
    <AuthenticatedLayout header={<h2 className="text-xl font-semibold">Bookings Report</h2>}>
      <Head title="Reports - Bookings" />

      <div className="max-w-7xl mx-auto space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-2xl border p-5">📅 Total Bookings: <b>48</b></div>
          <div className="rounded-2xl border p-5">🆕 This Month: <b>14</b></div>
          <div className="rounded-2xl border p-5">❌ Cancelled: <b>3</b></div>
          <div className="rounded-2xl border p-5">↩ Returned: <b>29</b></div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
