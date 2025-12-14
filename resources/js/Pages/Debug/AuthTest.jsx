import { Head } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function AuthTest(props) {
  return (
    <AuthenticatedLayout>
      <Head title="Auth Test" />
      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-xl font-semibold mb-4">Auth Test</h1>
        <pre className="p-4 rounded border overflow-auto">
          {JSON.stringify(props, null, 2)}
        </pre>
      </div>
    </AuthenticatedLayout>
  );
}
