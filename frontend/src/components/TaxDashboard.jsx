import React, { useState } from 'react';
import { 
  Calculator, 
  BrainCircuit, 
  DollarSign, 
  Percent, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight, 
  RefreshCw, 
  AlertCircle,
  HelpCircle,
  Shield,
  Briefcase
} from 'lucide-react';
import { analyzeTaxScenario } from '../services/api';

export default function TaxDashboard({ onAnalysisComplete, onYearChange }) {
  // 1. Core State
  const [assessmentYear, setAssessmentYear] = useState(2025);
  const [income, setIncome] = useState(1200000);
  const [deductions, setDeductions] = useState(150000);
  const [userQuery, setUserQuery] = useState("What is my tax liability under AY 2025-26 and how can I minimize it?");
  const [employmentType, setEmploymentType] = useState("salaried");

  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  // Quick preset helper
  const applyPreset = (inc, ded, emp, query) => {
    setIncome(inc);
    setDeductions(ded);
    setEmploymentType(emp);
    setUserQuery(query);
  };

  const handleYearChange = (year) => {
    const numericYear = Number(year);
    setAssessmentYear(numericYear);
    if (onYearChange) onYearChange(numericYear);
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError(null);

    const queryData = {
      question: userQuery,
      assessment_year: Number(assessmentYear)
    };

    const profileData = {
      income: Number(income),
      deductions: Number(deductions),
      tax_year: Number(assessmentYear),
      employment_type: employmentType
    };

    try {
      const data = await analyzeTaxScenario(queryData, profileData);
      setResult(data);
      if (onAnalysisComplete) {
        onAnalysisComplete(data, assessmentYear);
      }
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to analyze tax scenario');
    } finally {
      setLoading(false);
    }
  };

  const effectiveRate = income > 0 && result ? ((result.calculated_liability / income) * 100).toFixed(2) : 0;

  return (
    <div className="flex-1 flex flex-col gap-6">
      {/* Form Card */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl shadow-2xl">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Calculator className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-100">Financial Profile & Query</h2>
              <p className="text-xs text-slate-400">Deterministic Engine & LLM Temporal Input</p>
            </div>
          </div>

          {/* Quick Presets */}
          <div className="hidden sm:flex items-center gap-2">
            <span className="text-[11px] font-semibold uppercase text-slate-500 mr-1">Presets:</span>
            <button
              type="button"
              onClick={() => applyPreset(1200000, 150000, 'salaried', 'How much tax do I owe on 12L income?')}
              className="px-2.5 py-1 text-xs rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            >
              Salaried 12L
            </button>
            <button
              type="button"
              onClick={() => applyPreset(2500000, 200000, 'self-employed', 'Can I claim 44ADA presumptive tax on 25L income?')}
              className="px-2.5 py-1 text-xs rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            >
              Consultant 25L
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Row 1: Assessment Year & Employment Type */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Assessment Year (AY)
              </label>
              <select
                value={assessmentYear}
                onChange={(e) => handleYearChange(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-emerald-500 transition-colors"
              >
                <option value={2025}>AY 2025-26 (Current Finance Act)</option>
                <option value={2026}>AY 2026-27 (Proposed Slabs)</option>
                <option value={2024}>AY 2024-25 (Previous FY)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Employment Type
              </label>
              <select
                value={employmentType}
                onChange={(e) => setEmploymentType(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-emerald-500 transition-colors"
              >
                <option value="salaried">Salaried Employee</option>
                <option value="self-employed">Professional / Freelancer (44ADA)</option>
                <option value="corporate">Business / Corporate</option>
              </select>
            </div>
          </div>

          {/* Row 2: Gross Income & Deductions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Annual Gross Income (₹)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-2.5 text-slate-500 text-sm font-semibold">₹</span>
                <input
                  type="number"
                  min="0"
                  step="10000"
                  value={income}
                  onChange={(e) => setIncome(Number(e.target.value))}
                  placeholder="e.g. 1200000"
                  required
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-8 pr-4 py-2.5 text-sm text-slate-100 font-mono focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 flex items-center justify-between">
                <span>Eligible Deductions (₹)</span>
                <span className="text-[10px] text-slate-500 font-normal">80C, 80D, HRA etc.</span>
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-2.5 text-slate-500 text-sm font-semibold">₹</span>
                <input
                  type="number"
                  min="0"
                  step="5000"
                  value={deductions}
                  onChange={(e) => setDeductions(Number(e.target.value))}
                  placeholder="e.g. 150000"
                  required
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-8 pr-4 py-2.5 text-sm text-slate-100 font-mono focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Row 3: User Tax Query */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Tax Advisory Question / Strategy Query
            </label>
            <textarea
              rows="2"
              value={userQuery}
              onChange={(e) => setUserQuery(e.target.value)}
              placeholder="Ask any specific tax planning or deduction strategy question..."
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-emerald-500 transition-colors resize-none"
            />
          </div>

          {/* Error Notice */}
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Submit Action */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Processing Deterministic Math & Temporal RAG...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 fill-slate-950" />
                <span>Execute Tax Analysis & Deterministic Engine</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </>
            )}
          </button>
        </form>
      </div>

      {/* RESULTS DISPLAY SECTION */}
      {result && (
        <div className="space-y-6 animate-fadeIn">
          {/* Panel 1: Deterministic Calculation */}
          <div className="bg-slate-900/90 border border-emerald-500/30 rounded-2xl p-6 backdrop-blur-xl shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none"></div>

            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-5">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-100">1. Deterministic Calculation</h3>
                  <p className="text-xs text-slate-400">TaxRuleEngine (Zero Hallucination Guaranteed)</p>
                </div>
              </div>
              <span className="px-3 py-1 text-xs font-mono font-bold rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                STRICT RULE ENGINE
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Liability Output */}
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col gap-1">
                <span className="text-xs text-slate-400 uppercase font-semibold">Net Tax Liability</span>
                <span className="text-2xl font-black text-emerald-400 font-mono">
                  ₹{result.calculated_liability.toLocaleString('en-IN')}
                </span>
                <span className="text-[10px] text-slate-500">Includes 4% Cess & Rebates</span>
              </div>

              {/* Gross Income */}
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col gap-1">
                <span className="text-xs text-slate-400 uppercase font-semibold">Gross Annual Income</span>
                <span className="text-xl font-bold text-slate-200 font-mono">
                  ₹{income.toLocaleString('en-IN')}
                </span>
                <span className="text-[10px] text-slate-500">Assessment Year {assessmentYear}</span>
              </div>

              {/* Effective Tax Rate */}
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col gap-1">
                <span className="text-xs text-slate-400 uppercase font-semibold">Effective Tax Rate</span>
                <span className="text-xl font-bold text-cyan-400 font-mono">
                  {effectiveRate}%
                </span>
                <span className="text-[10px] text-slate-500">Optimal Regime Selected</span>
              </div>
            </div>
          </div>

          {/* Panel 2: Evidence-Grounded AI Analysis */}
          <div className="bg-slate-900/90 border border-cyan-500/30 rounded-2xl p-6 backdrop-blur-xl shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-5">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                  <BrainCircuit className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-100">2. Evidence-Grounded AI Advisory</h3>
                  <p className="text-xs text-slate-400">Gemini LLM + Temporal Vector Grounding</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">Confidence Score:</span>
                <span className="px-2.5 py-0.5 text-xs font-mono font-bold rounded-md bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                  {(result.confidence_score * 100).toFixed(1)}%
                </span>
              </div>
            </div>

            {/* AI Advice Output Text */}
            <div className="p-4 rounded-xl bg-slate-950/90 border border-slate-800 text-slate-200 text-sm leading-relaxed whitespace-pre-line font-sans mb-4">
              {result.advice}
            </div>

            {/* Grounding System Directive Disclaimer */}
            <div className="p-3 rounded-lg bg-cyan-950/30 border border-cyan-800/40 text-[11px] text-cyan-300 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                System Directive Enforced: LLM forbidden from calculating math independently.
              </span>
              <span className="font-mono text-cyan-500 text-[10px]">Gemini-1.5-Flash</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
