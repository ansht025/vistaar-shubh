import Link from 'next/link';
import { templateCards, fakeTestimonials } from '@/lib/mock-data';

const faq = [
  ['Can I generate banners with AI?', 'Yes. Prompt-to-design and variation generation are built in.'],
  ['Do you support collaborative editing?', 'Live collaboration scaffolding is included with workspace-ready architecture.'],
  ['Can I export for multiple platforms?', 'Yes. Use presets and smart resize for instant platform variants.']
];

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <section className="mx-auto max-w-7xl px-6 pt-24 pb-16">
        <div className="bento p-10">
          <p className="text-primary text-sm tracking-[0.2em] uppercase">AI Banner Studio</p>
          <h1 className="mt-4 text-5xl font-semibold leading-tight">Design banners that feel billion-dollar.</h1>
          <p className="mt-4 max-w-3xl text-slate-300">Canva/Figma-style editor with AI generation, smart resize, timeline animation and creator-grade export workflow.</p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/editor" className="mag-btn rounded-xl bg-primary px-5 py-3 font-medium text-slate-900">Open Studio</Link>
            <Link href="/dashboard" className="mag-btn rounded-xl glass px-5 py-3 font-medium">View Dashboard</Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-12">
        <div className="grid gap-4 md:grid-cols-3">
          {['Trusted by creators', 'Live AI generation demo', 'Infinite canvas workflow'].map((t) => (
            <div key={t} className="bento p-6">{t}</div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-12">
        <h2 className="mb-4 text-2xl font-semibold">Template categories</h2>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {templateCards.map((t) => (
            <div key={t.id} className="bento p-5">
              <div className={`mb-4 h-24 rounded-xl bg-gradient-to-br ${t.gradient}`} />
              <p className="text-sm text-slate-400">{t.category}</p>
              <p className="font-medium">{t.title}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-12">
        <h2 className="mb-4 text-2xl font-semibold">AI workflow steps</h2>
        <div className="grid gap-4 md:grid-cols-4">
          {['Prompt', 'Generate', 'Refine', 'Export'].map((s, i) => (
            <div key={s} className="bento p-5"><p className="text-primary">0{i + 1}</p><p>{s}</p></div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-12">
        <h2 className="mb-4 text-2xl font-semibold">Testimonials</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {fakeTestimonials.map((t) => (
            <div key={t.name} className="bento p-5"><p className="text-slate-300">{t.text}</p><p className="mt-3 text-sm text-slate-400">{t.name}</p></div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-12">
        <div className="grid gap-4 md:grid-cols-3">
          {['Starter', 'Pro', 'Scale'].map((p) => (
            <div key={p} className="bento p-6"><p className="text-xl font-semibold">{p}</p><p className="text-slate-400 mt-2">Premium plan placeholder</p></div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-24">
        <h2 className="mb-4 text-2xl font-semibold">FAQ</h2>
        <div className="space-y-3">
          {faq.map(([q, a]) => (
            <div key={q} className="bento p-5"><p className="font-medium">{q}</p><p className="mt-2 text-slate-400">{a}</p></div>
          ))}
        </div>
      </section>
    </main>
  );
}

