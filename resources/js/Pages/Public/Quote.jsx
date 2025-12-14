import GuestLayout from '@/Layouts/GuestLayout';
import { Head } from '@inertiajs/react';
import { useTheme } from '@/Context/ThemeContext';
import { useState } from 'react';

export default function Quote({ tenant }) {
  const { theme } = useTheme();
  const isDark = theme !== 'light';
  const text = isDark ? 'text-slate-50' : 'text-gray-900';
  const sub = theme === 'light' ? 'text-gray-600' : theme === 'gold' ? 'text-amber-100/70' : 'text-slate-300';

  const panel =
    theme === 'light'
      ? 'bg-white border-gray-200'
      : theme === 'gold'
      ? 'bg-[#0b1220] border-amber-500/25'
      : 'bg-slate-900 border-slate-800';

  const input =
    'w-full rounded-xl border px-3 py-2 text-sm outline-none ' +
    (theme === 'light'
      ? 'bg-white border-gray-200 text-gray-900 placeholder:text-gray-400'
      : 'bg-black/10 border-slate-700 text-slate-50 placeholder:text-slate-400');

  const [form, setForm] = useState({ name: '', email: '', phone: '', eventDate: '', notes: '' });

  return (
    <GuestLayout tenant={tenant}>
      <Head title="Request Quote" />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className={`text-2xl font-bold ${text}`}>Request a Quote</h1>
        <p className={`text-sm mt-1 ${sub}`}>Front-end only for now.</p>

        <div className={`mt-6 rounded-2xl border shadow-sm ${panel}`}>
          <form className="p-6 space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label className={`text-sm font-semibold ${text}`}>Name</label>
              <input className={input} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className={`text-sm font-semibold ${text}`}>Email</label>
                <input className={input} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </div>
              <div>
                <label className={`text-sm font-semibold ${text}`}>Phone</label>
                <input className={input} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              </div>
            </div>

            <div>
              <label className={`text-sm font-semibold ${text}`}>Event Date</label>
              <input type="date" className={input} value={form.eventDate} onChange={(e) => setForm({ ...form, eventDate: e.target.value })} />
            </div>

            <div>
              <label className={`text-sm font-semibold ${text}`}>Notes</label>
              <textarea className={input + ' min-h-[90px]'} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
            </div>

            <button
              type="button"
              className={
                'px-4 py-2 rounded-xl text-sm font-semibold border transition ' +
                (theme === 'light'
                  ? 'bg-gray-900 text-white border-gray-900 hover:opacity-90'
                  : theme === 'gold'
                  ? 'bg-amber-400 text-slate-900 border-amber-400 hover:opacity-90'
                  : 'bg-slate-50 text-slate-900 border-slate-50 hover:opacity-90')
              }
              onClick={() => alert('Quote submitted (dummy). Next: save to DB.')}
            >
              Submit Quote
            </button>
          </form>
        </div>
      </div>
    </GuestLayout>
  );
}
