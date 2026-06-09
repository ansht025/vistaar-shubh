'use client';

import { useEffect, useState } from 'react';
import { useStudioStore } from '@/store/useStudioStore';

export default function DashboardPage() {
  const { projects, aiHistory } = useStudioStore();
  const [workspaceLabel, setWorkspaceLabel] = useState('Local studio workspace');
  const [handoffInfo, setHandoffInfo] = useState('');

  useEffect(() => {
    try {
      const raw = localStorage.getItem('vistaarwater_studio_handoff_user');
      if (!raw) return;
      const parsed = JSON.parse(raw);
      const businessName = parsed?.user?.business_name || parsed?.user?.email || 'Main site user';
      setWorkspaceLabel(`${businessName} workspace`);
      setHandoffInfo(`Synced cart count: ${parsed?.cartCount ?? 0}`);
    } catch {
      setHandoffInfo('Handoff parse failed');
    }
  }, []);

  return (
    <main className="mx-auto min-h-screen max-w-7xl px-6 py-24">
      <h1 className="text-3xl font-semibold">Dashboard</h1>
      <p className="mt-2 text-sm text-slate-400">{workspaceLabel}</p>
      {handoffInfo ? <p className="text-xs text-slate-500">{handoffInfo}</p> : null}
      <div className="mt-6 grid gap-4 lg:grid-cols-4">
        <section className="bento p-5 lg:col-span-2">
          <h2 className="text-lg font-medium">Recent Projects</h2>
          <div className="mt-4 space-y-3">
            {projects.map((p) => (
              <div key={p.id} className="rounded-xl border border-white/10 p-3">
                <p>{p.name}</p><p className="text-sm text-slate-400">{p.updatedAt}</p>
              </div>
            ))}
          </div>
        </section>
        <section className="bento p-5">
          <h2 className="text-lg font-medium">Brand Assets</h2>
          <p className="mt-3 text-sm text-slate-400">Fonts, logos, palettes, kits</p>
        </section>
        <section className="bento p-5">
          <h2 className="text-lg font-medium">Billing</h2>
          <p className="mt-3 text-sm text-slate-400">Stripe integration placeholder</p>
        </section>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <section className="bento p-5"><h3 className="font-medium">Templates</h3><p className="text-sm text-slate-400 mt-2">Marketplace-ready listing area</p></section>
        <section className="bento p-5"><h3 className="font-medium">Analytics</h3><p className="text-sm text-slate-400 mt-2">Design output and team insights</p></section>
        <section className="bento p-5"><h3 className="font-medium">AI History</h3><p className="text-sm text-slate-400 mt-2">{aiHistory[0] ?? 'No generation yet'}</p></section>
      </div>
    </main>
  );
}

