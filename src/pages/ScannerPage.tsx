import { useEffect, useState } from 'react';
import { AlertTriangle, Lightbulb, ZoomIn, RotateCw, Download, ScanLine, CheckCircle2, Circle } from 'lucide-react';
import AppHeader from '../components/AppHeader';
import Sidebar from '../components/Sidebar';
import { supabase, Scan } from '../lib/supabase';

interface Props {
  onNavigate: (page: string) => void;
}

const roadmapSteps = [
  { label: 'AI Diagnosis', sub: 'Complete', done: true },
  { label: 'Soil Treatment', sub: 'In Progress', active: true },
  { label: 'Fungicide Schedule', sub: '', done: false },
  { label: 'Next Scan Date', sub: '', done: false },
];

export default function ScannerPage({ onNavigate }: Props) {
  const [scan, setScan] = useState<Scan | null>(null);

  useEffect(() => {
    supabase.from('scans').select('*').eq('disease_detected', true).limit(1).single()
      .then(({ data }) => { if (data) setScan(data); });
  }, []);

  return (
    <div className="flex flex-col h-screen bg-forest-950 overflow-hidden">
      <AppHeader activePage="scanner" onNavigate={onNavigate} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar activePage="scanner" onNavigate={onNavigate} />

        <main className="flex-1 overflow-y-auto p-5">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-4">

            {/* Left: Scanner view */}
            <div className="lg:col-span-3 flex flex-col gap-4">
              {/* Scan mode badge */}
              <div className="card-dark rounded-xl overflow-hidden relative" style={{ minHeight: '320px' }}>
                {/* Top bar */}
                <div className="flex items-center gap-2 px-4 py-2.5 border-b border-neon-green/10">
                  <div className="w-4 h-4 bg-neon-green/10 rounded flex items-center justify-center">
                    <div className="w-2 h-2 rounded-sm bg-neon-green/60" />
                  </div>
                  <span className="text-[10px] font-mono text-neon-green/80 uppercase tracking-widest">3D Interactive Mode</span>
                </div>

                {/* Image area */}
                <div className="relative" style={{ height: '260px' }}>
                  <div className="absolute inset-0 grid-bg opacity-20" />
                  <img
                    src="https://images.pexels.com/photos/1072179/pexels-photo-1072179.jpeg?auto=compress&cs=tinysrgb&w=600"
                    alt="Diseased leaf scan"
                    className="w-full h-full object-cover opacity-80"
                    style={{ filter: 'saturate(1.3) brightness(0.9)' }}
                  />
                  {/* HUD corners */}
                  <div className="corner-tl" />
                  <div className="corner-tr" />
                  <div className="corner-bl" />
                  <div className="corner-br" />
                  {/* Scan line */}
                  <div className="scan-line" />
                </div>

                {/* Toolbar */}
                <div className="flex items-center justify-center gap-3 py-2 border-t border-neon-green/10">
                  {[ZoomIn, RotateCw, Download].map((Icon, i) => (
                    <button key={i} className="w-7 h-7 rounded-lg bg-forest-800/60 border border-white/10 flex items-center justify-center hover:border-neon-green/30 transition-colors">
                      <Icon size={13} className="text-white/50" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Roadmap to Recovery */}
              <div className="card-dark rounded-xl p-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-sm font-semibold text-white">Roadmap to Recovery</h3>
                    <p className="text-[10px] text-white/40 mt-0.5">Estimated restoration: 14 Days</p>
                  </div>
                  <button className="text-[10px] font-mono text-neon-green border border-neon-green/30 rounded px-3 py-1.5 hover:bg-neon-green/10 transition-colors uppercase tracking-widest">
                    Export Protocol
                  </button>
                </div>

                {/* Steps */}
                <div className="flex items-center gap-0">
                  {roadmapSteps.map((step, i) => (
                    <div key={step.label} className="flex items-center flex-1">
                      <div className="flex flex-col items-center">
                        <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center ${step.done ? 'border-neon-green bg-neon-green/20' : step.active ? 'border-neon-green bg-neon-green/10' : 'border-white/15 bg-transparent'}`}>
                          {step.done
                            ? <CheckCircle2 size={13} className="text-neon-green" />
                            : step.active
                              ? <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
                              : <Circle size={13} className="text-white/20" />
                          }
                        </div>
                        <p className="text-[9px] font-mono text-white/60 mt-1.5 text-center">{step.label}</p>
                        {step.sub && <p className={`text-[8px] font-mono uppercase tracking-widest mt-0.5 ${step.done ? 'text-neon-green/70' : 'text-amber-400/70'}`}>{step.sub}</p>}
                      </div>
                      {i < roadmapSteps.length - 1 && (
                        <div className={`flex-1 h-0.5 mx-1 mb-5 ${step.done ? 'bg-neon-green/50' : 'bg-white/10'}`} />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Detection + Field env */}
            <div className="lg:col-span-2 flex flex-col gap-4">
              {/* Detection Alert */}
              <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(239,68,68,0.3)', background: 'rgba(10,5,5,0.8)' }}>
                {/* Header */}
                <div className="px-4 py-2.5 flex items-center justify-between" style={{ background: 'rgba(239,68,68,0.08)', borderBottom: '1px solid rgba(239,68,68,0.2)' }}>
                  <div className="flex items-center gap-2">
                    <span className="text-[8px] font-mono text-red-400/80 uppercase tracking-widest">Detection Alert</span>
                    {scan && <span className="text-[8px] font-mono text-white/30">{scan.confidence}% Confidence</span>}
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="text-base font-bold text-white mb-1">{scan?.disease_name ?? 'Leaf Rust'}</h3>
                  <p className="text-[11px] text-white/50 leading-relaxed mb-4">
                    {scan?.ai_insight ?? 'Detected Puccinia triticina fungus clusters on the dorsal surface of 3 leaves. High humidity conditions (82%) have accelerated spore propagation.'}
                  </p>

                  {/* Immediate Risk */}
                  <div className="rounded-lg p-3 mb-2.5" style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)' }}>
                    <div className="flex items-start gap-2">
                      <AlertTriangle size={13} className="text-red-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-[10px] font-semibold text-red-400 mb-0.5">Immediate Risk</p>
                        <p className="text-[10px] text-white/50">Spread likelihood high within 48 hours across adjacent crop clusters.</p>
                      </div>
                    </div>
                  </div>

                  {/* AI Recommendation */}
                  <div className="rounded-lg p-3" style={{ background: 'rgba(57,211,83,0.05)', border: '1px solid rgba(57,211,83,0.2)' }}>
                    <div className="flex items-start gap-2">
                      <Lightbulb size={13} className="text-neon-green mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-[10px] font-semibold text-neon-green mb-0.5">AI Recommendation</p>
                        <p className="text-[10px] text-white/50">Isolated irrigation for Sector B-13 and copper-based fungicide application.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Field Environment */}
              <div className="card-dark rounded-xl p-4">
                <p className="text-[9px] font-mono text-white/40 uppercase tracking-widest mb-3">Field Environment</p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="card-darker rounded-lg p-3">
                    <p className="text-[8px] font-mono text-white/35 uppercase tracking-widest mb-1">Humidity</p>
                    <p className="text-xl font-bold text-white">{scan?.humidity ?? 82}<span className="text-xs text-white/40">%</span></p>
                  </div>
                  <div className="card-darker rounded-lg p-3">
                    <p className="text-[8px] font-mono text-white/35 uppercase tracking-widest mb-1">Temp</p>
                    <p className="text-xl font-bold text-white">{scan?.temperature ?? 24}<span className="text-xs text-white/40">°C</span></p>
                  </div>
                </div>
              </div>

              {/* Start New Scan */}
              <button className="outline-btn w-full py-3 rounded-xl flex items-center justify-center gap-2 text-sm">
                <ScanLine size={15} className="text-neon-green" />
                Start New Scan
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
