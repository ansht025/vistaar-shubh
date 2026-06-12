'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, FabricImage, Rect, Textbox } from 'fabric';
import { Sparkles, Layers3, Wand2, Download, ZoomIn, ZoomOut, Undo2, Redo2, Type, Square, Building2, Palette, Eye, ShoppingCart } from 'lucide-react';
import { bannerPresets } from '@/lib/mock-data';
import { useStudioStore } from '@/store/useStudioStore';

const CANVAS_W = 1200;
const CANVAS_H = 700;

const WORKFLOW_STEPS = [
  { id: 1, label: 'Choose Industry', icon: Building2 },
  { id: 2, label: 'AI Generate Styles', icon: Wand2 },
  { id: 3, label: 'Customize Quickly', icon: Palette },
  { id: 4, label: 'Bottle Preview', icon: Eye },
  { id: 5, label: 'Bulk Order', icon: ShoppingCart }
];

const INDUSTRIES = ['Cafe', 'Gym', 'Luxury', 'Corporate', 'Event', 'Organic', 'Hotel', 'Wedding'];
const TONES = ['Minimal', 'Bold', 'Luxury', 'Corporate', 'Festival', 'Nature'];

export default function EditorPage() {
  const canvasEl = useRef<HTMLCanvasElement | null>(null);
  const fabricRef = useRef<Canvas | null>(null);

  const [zoom, setZoom] = useState(1);
  const [selectedPreset, setSelectedPreset] = useState(bannerPresets[0]);
  const [prompt, setPrompt] = useState('High-converting SaaS launch banner in glassmorphism style');
  const [layers, setLayers] = useState<string[]>([]);
  const [history, setHistory] = useState<string[]>([]);
  const [handoffStatus, setHandoffStatus] = useState('No incoming handoff');
  const [backendStatus, setBackendStatus] = useState('Backend: checking...');
  const [currentStep, setCurrentStep] = useState(1);

  const [businessName, setBusinessName] = useState('VistaarWater');
  const [tagline, setTagline] = useState('Pure Premium Hydration');
  const [industry, setIndustry] = useState('Corporate');
  const [tone, setTone] = useState('Luxury');
  const [bottleSize, setBottleSize] = useState('500ml');
  const [quantity, setQuantity] = useState(500);

  const { pushAiHistory, pushHistory } = useStudioStore();
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

  useEffect(() => {
    if (!canvasEl.current) return;
    const c = new Canvas(canvasEl.current, { width: CANVAS_W, height: CANVAS_H, backgroundColor: '#0b1426' });

    const bg = new Rect({
      left: 120,
      top: 120,
      width: 960,
      height: 460,
      rx: 24,
      ry: 24,
      fill: 'rgba(46,86,158,0.28)',
      stroke: 'rgba(255,255,255,0.2)',
      strokeWidth: 1,
      name: 'Glass Panel'
    });
    const title = new Textbox('Launch Your Product Faster', {
      left: 190,
      top: 230,
      width: 820,
      fontSize: 64,
      fontWeight: 700,
      fill: '#d9f7ff',
      name: 'Headline'
    });

    c.add(bg, title);
    c.renderAll();
    fabricRef.current = c;
    refreshLayers(c);
    hydrateFromMainApp(c);

    c.on('object:added', () => refreshLayers(c));
    c.on('object:removed', () => refreshLayers(c));
    c.on('object:modified', () => {
      pushHistory('Layer updated');
      setHistory((h) => ['Modified object', ...h].slice(0, 20));
    });

    const autosave = setInterval(() => {
      if (!fabricRef.current) return;
      localStorage.setItem('vistaarwater-studio-autosave', JSON.stringify(fabricRef.current.toJSON()));
    }, 3000);

    const keyHandler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        setHistory((h) => ['Undo requested', ...h].slice(0, 20));
      }
      if (e.key === 'Delete' && fabricRef.current?.getActiveObject()) {
        fabricRef.current.remove(fabricRef.current.getActiveObject()!);
      }
    };
    window.addEventListener('keydown', keyHandler);

    return () => {
      clearInterval(autosave);
      window.removeEventListener('keydown', keyHandler);
      c.dispose();
    };
  }, [pushAiHistory, pushHistory]);

  useEffect(() => {
    const checkBackend = async () => {
      try {
        const res = await fetch(`${backendUrl}/api/health`);
        if (res.ok) setBackendStatus('Backend: connected');
        else setBackendStatus('Backend: unreachable');
      } catch {
        setBackendStatus('Backend: unreachable');
      }
    };
    checkBackend();
  }, [backendUrl]);

  useEffect(() => {
    const headline = fabricRef.current?.getObjects().find((o) => (o as any).name === 'Headline') as Textbox | undefined;
    if (headline && businessName) {
      headline.set({ text: `${businessName} - ${tagline}`.slice(0, 52) });
      fabricRef.current?.requestRenderAll();
    }
  }, [businessName, tagline]);

  const refreshLayers = (c: Canvas) => {
    const names = c.getObjects().map((o, i) => String((o as any).name || `Layer ${i + 1}`)).reverse();
    setLayers(names);
  };

  const hydrateFromMainApp = async (canvas: Canvas) => {
    try {
      const raw = localStorage.getItem('vistaarwater_studio_handoff_design');
      if (!raw) return;
      const parsed = JSON.parse(raw);
      const incoming = parsed?.design;
      if (!incoming) return;

      const headline = canvas.getObjects().find((o) => (o as any).name === 'Headline') as Textbox | undefined;
      if (headline && incoming.name) headline.set({ text: String(incoming.name).toUpperCase().slice(0, 42) });

      const previewUrl = String(incoming.preview_url || '');
      const absoluteUrl = previewUrl.startsWith('/static/') ? `${backendUrl}${previewUrl}` : previewUrl;
      if (absoluteUrl) {
        const image = await FabricImage.fromURL(absoluteUrl, { crossOrigin: 'anonymous' });
        image.set({ left: 120, top: 120, selectable: false, evented: false, name: 'Main Handoff Preview' });
        image.scaleToWidth(960);
        image.scaleToHeight(460);
        canvas.insertAt(0, image);
      }

      canvas.requestRenderAll();
      setPrompt(`Remix this concept in premium style: ${incoming.name || 'Imported design'}`);
      setHandoffStatus('Connected: imported design from main site');
      setHistory((h) => ['Imported from main site', ...h].slice(0, 20));
    } catch {
      setHandoffStatus('Handoff parse failed');
    }
  };

  const addText = () => {
    if (!fabricRef.current) return;
    fabricRef.current.add(new Textbox('New Text', { left: 200, top: 180, width: 260, fill: '#fff', fontSize: 40, name: 'Text Layer' }));
  };

  const addShape = () => {
    if (!fabricRef.current) return;
    fabricRef.current.add(new Rect({ left: 220, top: 420, width: 180, height: 100, fill: 'rgba(66,245,215,0.2)', rx: 12, ry: 12, name: 'Shape' }));
  };

  const runAiMock = async () => {
    if (!fabricRef.current) return;
    try {
      const res = await fetch(`${backendUrl}/api/designs/generate-ai`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          business_name: businessName,
          count: 1,
          detail_level: 'medium',
          category: industry.toLowerCase(),
          style: tone.toLowerCase()
        })
      });
      const data = await res.json();
      const first = data?.designs?.[0];
      if (first?.name) {
        const active = fabricRef.current.getObjects().find((o) => (o as any).name === 'Headline') as Textbox | undefined;
        if (active) {
          active.set({ text: String(first.name).slice(0, 44) });
          fabricRef.current.requestRenderAll();
        }
        setHistory((h) => ['AI variation generated (backend)', ...h].slice(0, 20));
      } else {
        throw new Error('No designs from backend');
      }
    } catch {
      const active = fabricRef.current.getObjects().find((o) => (o as any).name === 'Headline') as Textbox | undefined;
      if (active) {
        active.set({ text: 'AI Variant: Premium Corporate Hydration Label' });
        fabricRef.current.requestRenderAll();
      }
      setHistory((h) => ['AI fallback applied (local)', ...h].slice(0, 20));
    }
    pushAiHistory(prompt);
  };

  const setPreset = (id: string) => {
    const preset = bannerPresets.find((p) => p.id === id);
    if (!preset) return;
    setSelectedPreset(preset);
    setHistory((h) => [`Preset switched: ${preset.name}`, ...h].slice(0, 20));
  };

  const unitPrice = useMemo(() => {
    const baseMap: Record<string, number> = { '250ml': 15, '500ml': 20, '1000ml': 30 };
    const base = baseMap[bottleSize] ?? 20;
    const discount = quantity >= 1000 ? 0.15 : quantity >= 500 ? 0.1 : quantity >= 100 ? 0.05 : 0;
    return Math.round((base * (1 - discount)) * 100) / 100;
  }, [bottleSize, quantity]);

  const totalPrice = useMemo(() => Math.round(unitPrice * quantity), [unitPrice, quantity]);
  const zoomLabel = useMemo(() => `${Math.round(zoom * 100)}%`, [zoom]);

  const renderStepPanel = () => {
    if (currentStep === 1) {
      return (
        <>
          <h3 className="mb-3 text-sm font-medium">Brand Inputs</h3>
          <label className="text-xs text-slate-400">Business Name</label>
          <input value={businessName} onChange={(e) => setBusinessName(e.target.value)} className="w-full rounded-lg border border-white/10 bg-panelSoft p-2 text-sm" />
          <label className="text-xs text-slate-400 mt-2">Tagline</label>
          <input value={tagline} onChange={(e) => setTagline(e.target.value)} className="w-full rounded-lg border border-white/10 bg-panelSoft p-2 text-sm" />
          <label className="text-xs text-slate-400 mt-2">Industry</label>
          <select value={industry} onChange={(e) => setIndustry(e.target.value)} className="w-full rounded-lg border border-white/10 bg-panelSoft p-2 text-sm">
            {INDUSTRIES.map((x) => <option key={x} value={x}>{x}</option>)}
          </select>
          <label className="text-xs text-slate-400 mt-2">Tone</label>
          <select value={tone} onChange={(e) => setTone(e.target.value)} className="w-full rounded-lg border border-white/10 bg-panelSoft p-2 text-sm">
            {TONES.map((x) => <option key={x} value={x}>{x}</option>)}
          </select>
          <label className="text-xs text-slate-400 mt-2">Bottle Size</label>
          <select value={bottleSize} onChange={(e) => setBottleSize(e.target.value)} className="w-full rounded-lg border border-white/10 bg-panelSoft p-2 text-sm">
            <option value="250ml">250ml</option>
            <option value="500ml">500ml</option>
            <option value="1000ml">1000ml</option>
          </select>
          <label className="text-xs text-slate-400 mt-2">Quantity</label>
          <input type="number" min={50} step={50} value={quantity} onChange={(e) => setQuantity(Math.max(50, Number(e.target.value) || 50))} className="w-full rounded-lg border border-white/10 bg-panelSoft p-2 text-sm" />
          <label className="text-xs text-slate-400 mt-2">Logo Upload</label>
          <input type="file" className="w-full rounded-lg border border-white/10 bg-panelSoft p-2 text-xs" />

          <div className="mt-4 rounded-lg border border-primary/30 bg-primary/10 p-3 text-xs">
            <p className="text-slate-300">Live Bulk Calculator</p>
            <p className="mt-1">Unit Price: Rs {unitPrice}</p>
            <p>Total: Rs {totalPrice.toLocaleString()}</p>
          </div>

          <button onClick={() => setCurrentStep(2)} className="mag-btn mt-4 w-full rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-slate-900">Next: AI Generate Styles</button>
        </>
      );
    }

    return (
      <>
        <h3 className="mb-3 flex items-center gap-2 text-sm font-medium"><Wand2 size={14} /> AI Generator</h3>
        <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} className="h-28 w-full rounded-lg border border-white/10 bg-panelSoft p-3 text-sm" />
        <button onClick={runAiMock} className="mag-btn mt-3 w-full rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-slate-900">Generate Variation</button>

        <h4 className="mt-6 text-sm font-medium">Banner Presets</h4>
        <div className="mt-2 space-y-2">
          {bannerPresets.map((p) => (
            <button key={p.id} onClick={() => setPreset(p.id)} className={`w-full rounded-lg border p-2 text-left text-xs ${selectedPreset.id === p.id ? 'border-primary bg-primary/20' : 'border-white/10 bg-panelSoft'}`}>
              <p className="font-medium">{p.name}</p>
              <p className="text-slate-400">{p.size.width}x{p.size.height}</p>
            </button>
          ))}
        </div>

        <h4 className="mt-6 text-sm font-medium">Assets</h4>
        <div className="mt-2 grid grid-cols-2 gap-2">
          <button onClick={addText} className="mag-btn rounded-lg glass px-3 py-2 text-xs"><Type size={12} className="inline mr-1" />Text</button>
          <button onClick={addShape} className="mag-btn rounded-lg glass px-3 py-2 text-xs"><Square size={12} className="inline mr-1" />Shape</button>
        </div>

        <button onClick={() => setCurrentStep(Math.min(5, currentStep + 1))} className="mag-btn mt-6 w-full rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-slate-900">Next Step</button>
      </>
    );
  };

  return (
    <main className="min-h-screen pt-20">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-bg/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1700px] flex-col gap-3 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-slate-300">
              <img src="/logo.png" alt="VistaarWater Logo" className="h-5 w-5 rounded-full object-cover" />
              VistaarWater AI Packaging Studio
            </div>
            <div className="text-xs text-slate-400">{handoffStatus} | {backendStatus}</div>
            <div className="flex items-center gap-2">
              <button className="mag-btn rounded-lg glass px-3 py-2 text-sm"><Undo2 size={14} /></button>
              <button className="mag-btn rounded-lg glass px-3 py-2 text-sm"><Redo2 size={14} /></button>
              <button className="mag-btn rounded-lg bg-primary px-4 py-2 text-sm font-medium text-slate-900"><Download size={14} className="inline mr-2" />Export</button>
            </div>
          </div>

          <div className="grid gap-2 md:grid-cols-5">
            {WORKFLOW_STEPS.map((step) => {
              const Icon = step.icon;
              const active = currentStep === step.id;
              return (
                <button key={step.id} onClick={() => setCurrentStep(step.id)} className={`rounded-lg border px-3 py-2 text-left text-xs ${active ? 'border-primary bg-primary/20 text-primary' : 'border-white/10 bg-panelSoft text-slate-300'}`}>
                  <div className="flex items-center gap-2"><Icon size={14} /> Step {step.id}</div>
                  <div>{step.label}</div>
                </button>
              );
            })}
          </div>
        </div>
      </header>

      <section className="mx-auto grid max-w-[1700px] grid-cols-1 gap-3 px-4 py-4 xl:grid-cols-[320px_1fr_300px]">
        <aside className="bento p-4">
          {renderStepPanel()}
        </aside>

        <div className="bento overflow-hidden p-3">
          <div className="mb-2 flex items-center justify-between px-1 text-xs text-slate-400">
            <span>Bottle branding live workspace</span>
            <div className="flex items-center gap-2">
              <button onClick={() => setZoom((z) => Math.max(0.3, z - 0.1))}><ZoomOut size={14} /></button>
              <span>{zoomLabel}</span>
              <button onClick={() => setZoom((z) => Math.min(2.5, z + 0.1))}><ZoomIn size={14} /></button>
            </div>
          </div>
          <div className="overflow-auto rounded-xl border border-white/10 bg-[#050913] p-4">
            <div style={{ transform: `scale(${zoom})`, transformOrigin: 'top left', width: CANVAS_W, height: CANVAS_H }}>
              <canvas ref={canvasEl} className="rounded-xl" />
            </div>
          </div>
          <div className="mt-3 rounded-xl border border-white/10 bg-panelSoft p-3 text-xs text-slate-400">
            Step {currentStep}/5 workflow active. Next phases will add bottle angle tabs, smart print safety, and AI improve button.
          </div>
        </div>

        <aside className="bento p-4">
          <h3 className="mb-3 flex items-center gap-2 text-sm font-medium"><Layers3 size={14} /> Layers</h3>
          <div className="space-y-2">
            {layers.map((l) => (<div key={l} className="rounded-lg border border-white/10 bg-panelSoft p-2 text-xs">{l}</div>))}
          </div>

          <h3 className="mt-6 mb-3 text-sm font-medium">Quick Properties</h3>
          <div className="space-y-2 text-xs text-slate-300">
            <div className="rounded-lg border border-white/10 bg-panelSoft p-2">Industry pack: {industry}</div>
            <div className="rounded-lg border border-white/10 bg-panelSoft p-2">Theme tone: {tone}</div>
            <div className="rounded-lg border border-white/10 bg-panelSoft p-2">Quantity tier: {quantity >= 1000 ? 'Wholesale' : quantity >= 500 ? 'Bulk' : 'Starter'}</div>
          </div>

          <h3 className="mt-6 mb-3 text-sm font-medium">Action History</h3>
          <div className="space-y-2">
            {history.map((h, i) => <div key={`${h}-${i}`} className="text-xs text-slate-400">- {h}</div>)}
          </div>
        </aside>
      </section>
    </main>
  );
}
