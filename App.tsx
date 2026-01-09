
import React, { useState } from 'react';
import Header from './components/Header';
import AnalysisDashboard from './components/AnalysisDashboard';
import { AppState, AnalysisResult } from './types';
import { analyzeResume } from './services/geminiService';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.LANDING);
  const [resumeText, setResumeText] = useState('');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isError, setIsError] = useState(false);

  const handleStartAnalysis = async () => {
    if (!resumeText.trim()) return;
    
    setAppState(AppState.ANALYZING);
    setIsError(false);

    try {
      const result = await analyzeResume(resumeText);
      setAnalysisResult(result);
      setAppState(AppState.RESULTS);
    } catch (err) {
      setIsError(true);
      setAppState(AppState.LANDING);
    }
  };

  const reset = () => {
    setAppState(AppState.LANDING);
    setAnalysisResult(null);
    setResumeText('');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-5xl">
        {appState === AppState.LANDING && (
          <div className="max-w-4xl mx-auto space-y-12 animate-in slide-in-from-bottom-8 duration-700">
            {/* Hero Section */}
            <div className="text-center space-y-4">
              <h1 className="text-5xl font-extrabold text-slate-900 tracking-tight sm:text-6xl">
                Equity in Hiring starts with <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">EquiScan.</span>
              </h1>
              <p className="text-xl text-slate-500 max-w-2xl mx-auto">
                The first-of-its-kind AI cultural bias auditor designed specifically for India's diverse job market. 
                Identify and eliminate regional, gender, and community-based biases in seconds.
              </p>
            </div>

            {/* Input Section */}
            <div className="bg-white rounded-3xl shadow-xl shadow-slate-200 border border-slate-100 p-8">
              <div className="flex flex-col gap-6">
                <div>
                  <label htmlFor="resume" className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">
                    Paste Resume Content or Text
                  </label>
                  <textarea
                    id="resume"
                    className="w-full h-80 rounded-2xl border-2 border-slate-100 p-6 text-slate-600 focus:border-indigo-500 focus:ring-0 transition-all outline-none resize-none bg-slate-50/50"
                    placeholder="E.g. Priya Kumari, Software Engineer from Patna. Highly nurturing team player..."
                    value={resumeText}
                    onChange={(e) => setResumeText(e.target.value)}
                  />
                </div>
                
                {isError && (
                  <div className="p-4 bg-rose-50 text-rose-700 rounded-xl text-sm font-medium border border-rose-100">
                    Oops! Something went wrong with the analysis. Please ensure your text is valid and try again.
                  </div>
                )}

                <button
                  onClick={handleStartAnalysis}
                  disabled={!resumeText.trim()}
                  className={`w-full py-4 rounded-xl text-lg font-bold shadow-lg transition-all transform active:scale-[0.98] ${
                    resumeText.trim() 
                      ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-200' 
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                  }`}
                >
                  Analyze for Bias 🔍
                </button>
                <p className="text-center text-xs text-slate-400 font-medium italic">
                  *Your data is processed securely and is used only for real-time analysis.
                </p>
              </div>
            </div>

            {/* Use Cases Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-4">
                  👩‍💼
                </div>
                <h3 className="font-bold text-slate-900 mb-2 text-lg">Gender Neutrality</h3>
                <p className="text-sm text-slate-500">Reframing gendered language to highlight leadership and strategic skills.</p>
              </div>
              <div className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mb-4">
                  🏔️
                </div>
                <h3 className="font-bold text-slate-900 mb-2 text-lg">Regional Stereotypes</h3>
                <p className="text-sm text-slate-500">Neutralizing markers that may trigger regional bias for candidates from Northeast India or Tier-3 cities.</p>
              </div>
              <div className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4">
                  🔄
                </div>
                <h3 className="font-bold text-slate-900 mb-2 text-lg">Gap Reframing</h3>
                <p className="text-sm text-slate-500">Turning "family gaps" into professional sabbaticals for personal growth.</p>
              </div>
            </div>
          </div>
        )}

        {appState === AppState.ANALYZING && (
          <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8 animate-pulse">
            <div className="relative">
              <div className="h-24 w-24 rounded-full border-4 border-slate-200 border-t-indigo-600 animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-indigo-600 font-black text-xl">ES</span>
              </div>
            </div>
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-slate-800">Analyzing Cultural Markers...</h2>
              <p className="text-slate-500">Checking for regional, gender, and community biases using GenAI.</p>
            </div>
            <div className="max-w-md w-full bg-slate-200 h-2 rounded-full overflow-hidden">
               <div className="bg-indigo-600 h-full animate-progress-indeterminate w-1/3 rounded-full"></div>
            </div>
          </div>
        )}

        {appState === AppState.RESULTS && analysisResult && (
          <AnalysisDashboard data={analysisResult} onReset={reset} />
        )}
      </main>

      <footer className="border-t border-slate-200 bg-white py-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-slate-400 text-sm">© 2025 EquiScan India. Empowering equitable hiring through AI.</p>
          <div className="mt-4 flex justify-center gap-6">
            <a href="#" className="text-xs font-semibold text-slate-500 hover:text-indigo-600">Privacy Policy</a>
            <a href="#" className="text-xs font-semibold text-slate-500 hover:text-indigo-600">Terms of Service</a>
            <a href="#" className="text-xs font-semibold text-slate-500 hover:text-indigo-600">Contact DEI Team</a>
          </div>
        </div>
      </footer>
      
      <style>{`
        @keyframes progress-indeterminate {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(300%); }
        }
        .animate-progress-indeterminate {
          animation: progress-indeterminate 1.5s infinite linear;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #cbd5e1;
        }
      `}</style>
    </div>
  );
};

export default App;
