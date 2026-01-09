
import React from 'react';
import { AnalysisResult, BiasIssue } from '../types';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

interface Props {
  data: AnalysisResult;
  onReset: () => void;
}

const AnalysisDashboard: React.FC<Props> = ({ data, onReset }) => {
  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'high': return 'bg-rose-100 text-rose-700 border-rose-200';
      case 'medium': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'low': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const pieData = [
    { name: 'Fairness', value: data.fairnessScore },
    { name: 'Gap', value: 10 - data.fairnessScore }
  ];

  const radarData = data.biases.reduce((acc: any[], curr) => {
    const existing = acc.find(item => item.subject === curr.category);
    if (existing) {
      existing.fullMark += 1;
      existing.count += 1;
    } else {
      acc.push({ subject: curr.category, count: 1, fullMark: 5 });
    }
    return acc;
  }, []);

  const COLORS = ['#4f46e5', '#e2e8f0'];

  return (
    <div className="animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Analysis Results</h2>
          <p className="text-slate-500">Based on India's cultural and regional employment patterns.</p>
        </div>
        <button 
          onClick={onReset}
          className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 border border-slate-200 rounded-lg bg-white shadow-sm transition-all"
        >
          Analyze Another Resume
        </button>
      </div>

      {/* Top Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center justify-center">
          <div className="relative h-40 w-40">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold text-slate-900">{data.fairnessScore}/10</span>
              <span className="text-xs text-slate-400 font-medium">FAIRNESS SCORE</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 col-span-1 md:col-span-2">
          <h3 className="text-lg font-semibold mb-2 text-slate-800">Executive Summary</h3>
          <p className="text-slate-600 leading-relaxed italic">"{data.summary}"</p>
          <div className="mt-4 flex gap-4">
            <div className="bg-slate-50 p-3 rounded-xl flex-1">
              <span className="block text-xs font-bold text-slate-400 uppercase mb-1">Total Flags</span>
              <span className="text-xl font-bold text-slate-800">{data.biases.length}</span>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl flex-1">
              <span className="block text-xs font-bold text-slate-400 uppercase mb-1">What-If Impact</span>
              <span className="text-xl font-bold text-indigo-600">+12-18%</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Detailed Bias Flags */}
        <section>
          <h3 className="text-xl font-bold mb-4 text-slate-900 flex items-center gap-2">
            🚩 Detected Bias Flags
          </h3>
          <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
            {data.biases.map((bias, idx) => (
              <div key={idx} className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${getSeverityColor(bias.severity)}`}>
                    {bias.severity} Severity
                  </span>
                  <span className="text-xs font-medium text-slate-400 italic">{bias.category}</span>
                </div>
                <div className="mb-3">
                  <span className="text-xs text-slate-400 block mb-1 uppercase font-semibold">Original Text</span>
                  <p className="text-sm font-medium text-slate-800 bg-slate-50 p-2 rounded border border-slate-100 line-through decoration-rose-400/50">
                    "{bias.originalText}"
                  </p>
                </div>
                <div className="mb-3">
                  <span className="text-xs text-slate-400 block mb-1 uppercase font-semibold">Why this is biased?</span>
                  <p className="text-sm text-slate-600">{bias.reason}</p>
                </div>
                <div>
                  <span className="text-xs text-indigo-400 block mb-1 uppercase font-semibold">Suggested Neutral Rewrite</span>
                  <p className="text-sm font-semibold text-indigo-700 bg-indigo-50 p-2 rounded border border-indigo-100">
                    "{bias.suggestion}"
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Right: Counterfactual Analysis & Re-write Preview */}
        <section className="space-y-8">
          <div>
            <h3 className="text-xl font-bold mb-4 text-slate-900 flex items-center gap-2">
              🧪 What-If Analysis
            </h3>
            <div className="bg-slate-900 text-slate-100 p-6 rounded-2xl shadow-lg">
              <p className="text-sm text-slate-400 mb-6 italic">Simulation of perception shifts based on demographic adjustments.</p>
              <div className="space-y-6">
                {data.counterfactuals.map((cf, idx) => (
                  <div key={idx} className="border-l-2 border-indigo-500 pl-4 py-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest">{cf.variable}</span>
                      <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full border border-indigo-500/30">SIMULATED</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm mb-2">
                      <span className="text-slate-500">{cf.original}</span>
                      <span className="text-slate-600">→</span>
                      <span className="font-bold text-white">{cf.simulated}</span>
                    </div>
                    <p className="text-xs text-slate-400 italic">{cf.impact}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4 text-slate-900">✨ Neutral Version Preview</h3>
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative group overflow-hidden">
              <div className="absolute top-0 right-0 bg-emerald-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg uppercase tracking-widest">
                Bias-Neutralized
              </div>
              <div className="prose prose-sm max-h-[300px] overflow-y-auto custom-scrollbar">
                <pre className="whitespace-pre-wrap font-sans text-slate-600 text-sm leading-relaxed">
                  {data.rewrittenResume}
                </pre>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-100 flex justify-end">
                <button className="text-indigo-600 font-bold text-sm hover:underline flex items-center gap-1">
                  Copy Neutral Content
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>

      <div className="mt-12 bg-white rounded-2xl p-8 border border-slate-200 text-center shadow-sm">
        <h3 className="text-lg font-bold text-slate-900 mb-2">Help us improve the auditor!</h3>
        <p className="text-slate-500 text-sm mb-6 max-w-lg mx-auto">
          We're constantly refining our regional and cultural bias detection algorithms. Was this analysis helpful?
        </p>
        <div className="flex justify-center gap-4">
          <button className="px-6 py-2 rounded-lg bg-emerald-50 text-emerald-700 font-bold text-sm border border-emerald-100 hover:bg-emerald-100 transition-all">Yes, very helpful</button>
          <button className="px-6 py-2 rounded-lg bg-rose-50 text-rose-700 font-bold text-sm border border-rose-100 hover:bg-rose-100 transition-all">Not quite right</button>
        </div>
      </div>
    </div>
  );
};

export default AnalysisDashboard;
