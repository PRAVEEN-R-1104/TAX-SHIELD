import React, { useState } from 'react';
import { Shield, Sparkles, Cpu, BookOpen } from 'lucide-react';
import TaxDashboard from './components/TaxDashboard';
import EvidencePanel from './components/EvidencePanel';

export default function App() {
  const [assessmentYear, setAssessmentYear] = useState(2025);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAnalysisComplete = (data, year) => {
    setResult(data);
    if (year) setAssessmentYear(year);
  };

  return (
    <div className="min-h-screen bg-[#0B1121] text-slate-100 flex flex-col font-sans antialiased">
      <nav className="border-b border-slate-800/80 bg-[#0E172A]/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <Shield className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div className="flex items-center gap-2.5">
              <span className="text-lg font-black tracking-wider text-slate-100 uppercase">TAX-SHIELD</span>
              <span className="px-2 py-0.5 text-[11px] font-mono font-bold rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">v1.0</span>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#131C31] border border-slate-700/80 text-xs font-semibold text-slate-300">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="text-emerald-400 font-mono">FastAPI Engine Ready</span>
          </div>
        </div>
      </nav>

      <header className="border-b border-slate-800/60 bg-[#0E172A]/40 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold tracking-widest text-emerald-400 uppercase mb-1">
              <Sparkles className="w-4 h-4 fill-emerald-400/20" /> ZERO-HALLUCINATION LEGAL GROUNDING
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
              Temporal Tax Intelligence Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1.5 max-w-2xl leading-relaxed">
              Deterministic tax rule calculations fused with temporal vector knowledge isolation for AY 2024-2027 tax planning.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#131C31] border border-emerald-500/30 text-xs font-semibold text-emerald-400">
              <Cpu className="w-4 h-4" /> Rule Engine Math
            </div>
            <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#131C31] border border-cyan-500/30 text-xs font-semibold text-cyan-400">
              <BookOpen className="w-4 h-4" /> Vector Metadata RAG
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7">
            <TaxDashboard
              onAnalysisComplete={handleAnalysisComplete}
              onYearChange={setAssessmentYear}
            />
          </div>
          <div className="lg:col-span-5">
            <EvidencePanel
              citedSources={result?.cited_sources || []}
              assessmentYear={assessmentYear}
              isLoading={loading}
              resultData={result}
            />
          </div>
        </div>
      </main>

      <footer className="border-t border-slate-800/80 bg-[#0E172A]/80 py-5 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-500" />
            <span>TAX-SHIELD Cyber-Finance Architecture &copy; 2026. FastAPI + Gemini RAG.</span>
          </div>
          <span className="text-emerald-400 font-mono">Zero Hallucination Protocol</span>
        </div>
      </footer>
    </div>
  );
}
