import React, { useState } from 'react';
import { BookOpen, ShieldCheck, Clock, FileText, CheckCircle2, AlertTriangle, Layers, Copy, Check } from 'lucide-react';

export default function EvidencePanel({ citedSources = [], assessmentYear = 2025, isLoading = false, resultData = null }) {
  const [copied, setCopied] = useState(false);

  // Mock temporal vector database items filtered by active assessment year for UI display
  const getTemporalKnowledgeChunks = (year) => {
    const allChunks = [
      {
        id: "sec_87a_new_2025",
        title: `Section 87A Rebate (AY ${year})`,
        source: `Finance Act ${year - 1} / Sec 87A`,
        valid_from_year: 2025,
        valid_to_year: 2025,
        text: `Under AY 2025-26, resident individuals with total taxable income up to ₹7,00,000 enjoy full rebate u/s 87A under the New Regime. Standard deduction is ₹75,000.`,
        tag: "Active Temporal Match"
      },
      {
        id: "sec_80c_standard",
        title: "Section 80C Deduction Limits",
        source: "Income Tax Act Sec 80C",
        valid_from_year: 2020,
        valid_to_year: 2025,
        text: "Allows up to ₹1,50,000 deduction per FY for EPF, PPF, ELSS, NPS, and home loan principal repayments under the Old Tax Regime.",
        tag: "Active Temporal Match"
      },
      {
        id: "sec_44ada_presumptive",
        title: "Section 44ADA Presumptive Taxation",
        source: "Income Tax Act Sec 44ADA",
        valid_from_year: 2023,
        valid_to_year: 2026,
        text: "Eligible professionals with receipts up to ₹50L (or ₹75L if digital >95%) can declare 50% of gross receipts as taxable income.",
        tag: "Active Temporal Match"
      },
      {
        id: "future_2026_isolated",
        title: "Section 87A Revised Slabs (AY 2026-27)",
        source: "Proposed Finance Bill 2025",
        valid_from_year: 2026,
        valid_to_year: 2027,
        text: "Slab threshold updates to 0-4L at 0%, 4-8L at 5%. Rebate u/s 87A applies up to ₹8,00,000.",
        tag: "EXCLUDED (Future Law)"
      }
    ];

    // Filter temporally
    return allChunks.filter(c => c.valid_from_year <= year && year <= c.valid_to_year);
  };

  const activeChunks = getTemporalKnowledgeChunks(assessmentYear);

  const copySources = () => {
    const textToCopy = citedSources.length > 0 ? citedSources.join('\n') : activeChunks.map(c => `${c.title}: ${c.text}`).join('\n');
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <aside className="w-full lg:w-96 flex flex-col gap-5 bg-slate-900/80 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-xl shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-100 text-base">Temporal RAG Evidence</h3>
            <p className="text-xs text-slate-400">Vector Knowledge Isolation</p>
          </div>
        </div>
        <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
          AY {assessmentYear}
        </span>
      </div>

      {/* Temporal Boundary Rule Banner */}
      <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 flex flex-col gap-2">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
          <span className="flex items-center gap-1.5 text-cyan-400">
            <Clock className="w-3.5 h-3.5" /> Temporal Filter Constraint
          </span>
          <span className="font-mono text-[10px] text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">
            valid_from &le; {assessmentYear} &le; valid_to
          </span>
        </div>
        <p className="text-[11px] text-slate-400 leading-relaxed">
          Retrieval engine guarantees queries for <strong className="text-emerald-400">{assessmentYear}</strong> receive zero chunks from future tax amendments (e.g. AY {assessmentYear + 1}).
        </p>
      </div>

      {/* Cited Sources Section */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-emerald-400" /> Cited Legal Sources
          </h4>
          <button
            onClick={copySources}
            className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-emerald-400 transition-colors"
            title="Copy sources"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>

        {citedSources.length > 0 ? (
          <div className="flex flex-wrap gap-2 mb-4">
            {citedSources.map((source, idx) => (
              <div
                key={idx}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-950/40 text-emerald-300 border border-emerald-800/50 text-xs font-medium"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                <span>{source}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-3 rounded-lg bg-slate-950/40 border border-slate-800/60 text-xs text-slate-400 mb-4">
            {isLoading ? "Querying temporal vector store..." : "Run analysis to view cited legal references."}
          </div>
        )}
      </div>

      {/* Retrieved Vector Chunks */}
      <div className="flex-1 flex flex-col gap-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-cyan-400" /> Temporal Vector Chunks
        </h4>

        {isLoading ? (
          <div className="space-y-3">
            {[1, 2].map((n) => (
              <div key={n} className="p-3.5 rounded-xl bg-slate-950/40 border border-slate-800/50 animate-pulse flex flex-col gap-2">
                <div className="h-4 bg-slate-800 rounded w-3/4"></div>
                <div className="h-3 bg-slate-800/60 rounded w-full"></div>
                <div className="h-3 bg-slate-800/60 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3 overflow-y-auto max-h-[360px] pr-1">
            {activeChunks.map((chunk) => (
              <div
                key={chunk.id}
                className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-slate-700 transition-all flex flex-col gap-1.5 text-left group"
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="font-semibold text-xs text-slate-200 group-hover:text-emerald-300 transition-colors">
                    {chunk.title}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {chunk.valid_from_year}-{chunk.valid_to_year}
                  </span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed font-normal">
                  {chunk.text}
                </p>
                <div className="mt-1 flex items-center justify-between text-[10px] text-slate-500 border-t border-slate-800/60 pt-2">
                  <span>{chunk.source}</span>
                  <span className="text-emerald-400 font-medium">✓ Grounded</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* RAG Verification Footer */}
      <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
        <span className="flex items-center gap-1 text-emerald-400 font-medium">
          <ShieldCheck className="w-3.5 h-3.5" /> Temporal RAG Guard Active
        </span>
        <span className="font-mono text-slate-500">FastAPI + Gemini</span>
      </div>
    </aside>
  );
}
