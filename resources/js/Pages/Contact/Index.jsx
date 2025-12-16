import React from "react";
import { Head, useForm, Link, usePage } from "@inertiajs/react";
import GuestLayout from "@/Layouts/GuestLayout";

export default function ContactIndex() {
  const { props } = usePage();
  const brand = props?.tenant?.name ?? "Harbour Decor Rentals";

  const { data, setData, post, processing, errors, reset } = useForm({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const onSubmit = (e) => {
    e.preventDefault();
    post(route("contact.store"), {
      preserveScroll: true,
      onSuccess: () => reset("message"),
    });
  };

  const flashSuccess = props?.flash?.success;

  return (
    <>
      <Head title={`Contact - ${brand}`} />

      <section className="max-w-6xl mx-auto">
        <div className="rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/40">
          {/* Header */}
          <div className="relative p-8 sm:p-12 bg-gradient-to-br from-amber-500/20 via-transparent to-slate-900/10 dark:to-black/30">
            <p className="text-xs uppercase tracking-[0.35em] text-amber-700 dark:text-amber-300">
              Contact Us
            </p>
            <h1 className="mt-3 text-3xl sm:text-4xl font-extrabold tracking-tight">
              Let’s plan something beautiful.
            </h1>
            <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl">
              Tell us about your event (date, city, venue, guest count, theme colors, and budget).
              We’ll respond with options and next steps.
            </p>

            <div className="mt-6 flex flex-wrap gap-2 text-[11px]">
              <span className="px-3 py-1 rounded-full border border-amber-400/60 bg-amber-500/10">
                Fast reply
              </span>
              <span className="px-3 py-1 rounded-full border border-slate-300/60 dark:border-slate-700 bg-white/60 dark:bg-white/5">
                GTA & Windsor
              </span>
              <span className="px-3 py-1 rounded-full border border-slate-300/60 dark:border-slate-700 bg-white/60 dark:bg-white/5">
                Weddings · Baby · Corporate
              </span>
            </div>
          </div>

          {/* Body */}
          <div className="p-6 sm:p-10 grid gap-6 lg:grid-cols-[1.2fr,0.8fr]">
            {/* Form Card */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-950/30 p-5 sm:p-6 shadow-sm">
              {flashSuccess ? (
                <div className="mb-4 rounded-xl border border-emerald-300/60 bg-emerald-500/10 px-4 py-3 text-sm">
                  ✅ {flashSuccess}
                </div>
              ) : null}

              {errors?.form ? (
                <div className="mb-4 rounded-xl border border-rose-300/60 bg-rose-500/10 px-4 py-3 text-sm">
                  ❗ {errors.form}
                </div>
              ) : null}

              <form onSubmit={onSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm opacity-80">Name</label>
                    <input
                      className="mt-1 w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-3 py-2 outline-none focus:border-amber-400"
                      value={data.name}
                      onChange={(e) => setData("name", e.target.value)}
                      placeholder="Your name"
                    />
                    {errors.name && <div className="mt-1 text-xs text-rose-500">{errors.name}</div>}
                  </div>

                  <div>
                    <label className="text-sm opacity-80">Email</label>
                    <input
                      type="email"
                      className="mt-1 w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-3 py-2 outline-none focus:border-amber-400"
                      value={data.email}
                      onChange={(e) => setData("email", e.target.value)}
                      placeholder="you@email.com"
                    />
                    {errors.email && <div className="mt-1 text-xs text-rose-500">{errors.email}</div>}
                  </div>
                </div>

                <div>
                  <label className="text-sm opacity-80">Subject</label>
                  <input
                    className="mt-1 w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-3 py-2 outline-none focus:border-amber-400"
                    value={data.subject}
                    onChange={(e) => setData("subject", e.target.value)}
                    placeholder="Wedding décor inquiry"
                  />
                  {errors.subject && <div className="mt-1 text-xs text-rose-500">{errors.subject}</div>}
                </div>

                <div>
                  <label className="text-sm opacity-80">Message</label>
                  <textarea
                    rows={6}
                    className="mt-1 w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-3 py-2 outline-none focus:border-amber-400"
                    value={data.message}
                    onChange={(e) => setData("message", e.target.value)}
                    placeholder="Event date, city, venue, guest count, colors, budget…"
                  />
                  {errors.message && <div className="mt-1 text-xs text-rose-500">{errors.message}</div>}
                </div>

                <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
                  <button
                    type="submit"
                    disabled={processing}
                    className="inline-flex items-center justify-center rounded-xl bg-amber-400 text-slate-950 px-5 py-2.5 text-sm font-semibold hover:bg-amber-300 disabled:opacity-60 transition"
                  >
                    {processing ? "Sending..." : "Send message"}
                  </button>

                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    Prefer browsing?{" "}
                    <Link href="/catalog" className="font-semibold hover:underline">
                      View catalog →
                    </Link>
                  </div>
                </div>
              </form>
            </div>

            {/* Info Cards */}
            <div className="space-y-4">
              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-950/30 p-5 hover-lift">
                <div className="text-xs uppercase tracking-[0.25em] text-amber-600 dark:text-amber-300">
                  Business
                </div>
                <div className="mt-2 font-semibold">{brand}</div>
                <div className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                  Weddings · Baby showers · Birthdays · Corporate · Live video & coverage
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-950/30 p-5 hover-lift">
                <div className="text-xs uppercase tracking-[0.25em] text-amber-600 dark:text-amber-300">
                  Email
                </div>
                <div className="mt-2 text-sm">
                  <a className="font-semibold hover:underline" href="mailto:info@harbourdecor.com">
                    info@harbourdecor.com
                  </a>
                </div>
                <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                  Replace with your real email.
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-950/30 p-5 hover-lift">
                <div className="text-xs uppercase tracking-[0.25em] text-amber-600 dark:text-amber-300">
                  Social
                </div>
                <div className="mt-2 flex gap-3 text-sm">
                  <a className="font-semibold hover:underline" href="https://www.instagram.com/harbourdecor/" target="_blank" rel="noreferrer">
                    Instagram →
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <style>{`
          .hover-lift{transition: transform 220ms ease, box-shadow 220ms ease;}
          .hover-lift:hover{transform: translateY(-4px); box-shadow: 0 18px 45px -20px rgba(0,0,0,0.35);}
        `}</style>
      </section>
    </>
  );
}

/** ✅ wrap in GuestLayout */
ContactIndex.layout = (page) => <GuestLayout tenant={page.props.tenant}>{page}</GuestLayout>;
