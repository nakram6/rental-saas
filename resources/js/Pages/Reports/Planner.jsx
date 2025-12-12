import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function PlannerReport() {
  return (
    <AuthenticatedLayout header={<h2 className="text-xl font-semibold">Planner Report</h2>}>
      <Head title="Reports - Planner" />

      <div className="max-w-7xl mx-auto space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-2xl border p-5">🛋 Layouts Created: <b>22</b></div>
          <div className="rounded-2xl border p-5">📐 Avg Items/Layout: <b>14</b></div>
          <div className="rounded-2xl border p-5">⭐ Most Used Item: <b>White Sofa</b></div>
          <div className="rounded-2xl border p-5">📄 PDF Exports: <b>9</b></div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
