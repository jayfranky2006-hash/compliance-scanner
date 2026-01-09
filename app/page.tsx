'use client';
import { useState } from 'react';

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [step, setStep] = useState<'upload' | 'results'>('upload');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setFile(e.target.files[0]);
  };

  const analyzeCompliance = async () => {
    if (!file) return;
    setAnalyzing(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/analyze', { method: 'POST', body: formData });
      const data = await response.json();
      setResults(data);
      setStep('results');
    } catch {
      alert('Analysis failed');
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Hero Section */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-emerald-600/20 blur-3xl"></div>
        <div className="relative max-w-7xl mx-auto py-20 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center bg-white/80 backdrop-blur-xl px-6 py-3 rounded-2xl shadow-2xl mb-8 border border-white/50">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              <span className="font-semibold text-slate-800">Live AI Analysis • 60 Seconds</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 bg-clip-text text-transparent mb-6 leading-tight">
              Compliance Scanner
            </h1>
            <p className="text-xl md:text-2xl text-slate-600 mb-12 max-w-3xl mx-auto leading-relaxed">
              Upload your privacy policy. Get GDPR & CCPA compliance gaps, risk scores, and 
              <span className="font-semibold text-blue-600"> actionable fixes</span> instantly.
            </p>
            <div className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white px-12 py-6 rounded-3xl font-bold text-xl shadow-2xl hover:shadow-3xl transform hover:-translate-y-2 transition-all duration-300 inline-block mb-8">
              $49 One-Time Analysis
            </div>
            <div className="grid md:grid-cols-3 gap-8 text-sm text-slate-600 max-w-4xl mx-auto">
              <div className="flex items-center justify-center gap-2">
                <div className="w-10 h-10 bg-green-100 rounded-2xl flex items-center justify-center">
                  <span className="text-green-600 font-bold text-lg">✓</span>
                </div>
                <span>GDPR + CCPA</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <div className="w-10 h-10 bg-blue-100 rounded-2xl flex items-center justify-center">
                  <span className="text-blue-600 font-bold text-lg">⚡</span>
                </div>
                <span>60 Seconds</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <div className="w-10 h-10 bg-purple-100 rounded-2xl flex items-center justify-center">
                  <span className="text-purple-600 font-bold text-lg">📊</span>
                </div>
                <span>Risk Scores</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Upload Section */}
      {step === 'upload' && (
        <section className="max-w-4xl mx-auto px-6 pb-20">
          <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-200/50 p-12 max-w-2xl mx-auto">
            <div className="text-center mb-12">
              <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl">
                <span className="text-3xl">📄</span>
              </div>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Upload Your Document</h2>
              <p className="text-lg text-slate-600 max-w-md mx-auto">
                Privacy policy, terms, or legal docs (PDF, DOC, DOCX)
              </p>
            </div>

            <div className="space-y-6">
              <div className="border-3 border-dashed border-slate-300 rounded-3xl p-12 text-center hover:border-blue-400 hover:bg-blue-50/50 transition-all group cursor-pointer">
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer block">
                  <div className="text-5xl mb-6 group-hover:scale-110 transition-transform">📁</div>
                  <h3 className="text-2xl font-bold text-slate-700 mb-3 group-hover:text-blue-600">
                    {file ? 'Ready to analyze' : 'Click or drag file'}
                  </h3>
                  <p className="text-slate-500 mb-2">Max 5MB • PDF, DOC, DOCX</p>
                  {file && (
                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-2xl font-semibold inline-flex items-center gap-3 mx-auto mt-6 shadow-lg">
                      <span className="w-3 h-3 bg-white/30 rounded-full animate-pulse"></span>
                      {file.name}
                    </div>
                  )}
                </label>
              </div>

              {file && (
                <button
                  onClick={analyzeCompliance}
                  disabled={analyzing}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-700 hover:from-blue-700 hover:to-purple-800 disabled:from-slate-400 disabled:to-slate-500 text-white py-8 px-12 rounded-3xl font-bold text-xl shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-3 mx-auto max-w-md disabled:cursor-not-allowed"
                >
                  {analyzing ? (
                    <>
                      <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Analyzing Compliance...
                    </>
                  ) : (
                    <>
                      <span className="text-2xl">🚀</span>
                      Run GDPR & CCPA Analysis
                    </>
                  )}
                </button>
              )}
            </div>

            {/* Trust Signals */}
            <div className="grid md:grid-cols-3 gap-8 mt-20 pt-12 border-t border-slate-200">
              <div className="text-center">
                <div className="text-3xl font-bold text-emerald-600 mb-2">95%</div>
                <p className="text-sm text-slate-600">AI Accuracy</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">5 min</div>
                <p className="text-sm text-slate-600">Avg Analysis</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">$20K+</div>
                <p className="text-sm text-slate-600">Fines Avoided</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Results Section */}
      {step === 'results' && results && (
        <section className="max-w-6xl mx-auto px-6 pb-20">
          <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-200/50 p-12">
            <div className="text-center mb-12">
              <button 
                onClick={() => setStep('upload')}
                className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 font-medium mb-8"
              >
                <span className="text-xl">←</span> New Analysis
              </button>
              <div className="inline-flex items-center bg-gradient-to-r from-orange-400 to-red-500 px-8 py-4 rounded-2xl font-bold text-xl shadow-2xl mb-8">
                Overall Risk: {results.overall_risk_score}/10
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8 mb-12">
              {/* GDPR */}
              <div className="group p-8 rounded-3xl border-4 border-orange-100/50 hover:border-orange-200 bg-gradient-to-br from-orange-50/80 to-red-50/80 backdrop-blur-xl hover:shadow-2xl transition-all">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl flex items-center justify-center shadow-xl">
                    <span className="text-2xl font-bold text-white">🇪🇺</span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-1">GDPR</h3>
                    <div className="flex items-center gap-2 text-xl font-bold text-orange-600">
                      Risk: {results.gdr?.risk_score}/10
                    </div>
                  </div>
                </div>
                <ul className="space-y-4">
                  {results.gdr?.findings?.map((finding: string, i: number) => (
                    <li key={i} className="flex items-start gap-4 p-4 bg-white/60 rounded-2xl border-l-4 border-orange-400 shadow-sm hover:shadow-md transition-all">
                      <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-white font-bold text-xs">!</span>
                      </div>
                      <span className="font-medium text-slate-800 leading-relaxed">{finding}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* CCPA */}
              <div className="group p-8 rounded-3xl border-4 border-blue-100/50 hover:border-blue-200 bg-gradient-to-br from-blue-50/80 to-indigo-50/80 backdrop-blur-xl hover:shadow-2xl transition-all">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-xl">
                    <span className="text-2xl font-bold text-white">🇺🇸</span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-1">CCPA</h3>
                    <div className="flex items-center gap-2 text-xl font-bold text-blue-600">
                      Risk: {results.ccpa?.risk_score}/10
                    </div>
                  </div>
                </div>
                <ul className="space-y-4">
                  {results.ccpa?.findings?.map((finding: string, i: number) => (
                    <li key={i} className="flex items-start gap-4 p-4 bg-white/60 rounded-2xl border-l-4 border-blue-400 shadow-sm hover:shadow-md transition-all">
                      <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-white font-bold text-xs">!</span>
                      </div>
                      <span className="font-medium text-slate-800 leading-relaxed">{finding}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* CTA Section */}
            <div className="text-center space-y-6 pt-12 border-t border-slate-200">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Ready for Full Report?</h2>
              <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-8">
                Download audit-ready PDF with prioritized fixes, templates, and implementation guide.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="flex-1 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white py-6 px-12 rounded-3xl font-bold text-xl shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 transition-all max-w-md mx-auto">
                  <span className="text-2xl mr-3">💳</span>
                  Checkout $49 → Full Report
                </button>
                <button 
                  onClick={() => setStep('upload')}
                  className="flex-1 border-2 border-slate-300 hover:border-slate-400 text-slate-700 py-6 px-12 rounded-3xl font-bold text-xl hover:bg-slate-50 transition-all max-w-md mx-auto"
                >
                  🔄 New Analysis
                </button>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
