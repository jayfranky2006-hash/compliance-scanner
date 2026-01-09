'use client';
import { useState } from 'react';

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState<any>(null);

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
    } catch (error) {
      alert('Analysis failed');
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Compliance Scanner
          </h1>
          <p className="text-xl text-gray-600 mb-8">GDPR + CCPA compliance in 60 seconds</p>
          <div className="bg-gradient-to-r from-emerald-400 to-green-500 text-white px-8 py-3 rounded-full inline-block font-semibold">
            $49 one-time
          </div>
        </div>

        {!results ? (
          <div className="space-y-6">
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-blue-400">
              <input type="file" accept=".pdf,.doc,.docx" onChange={handleFileChange} className="hidden" id="file-upload" />
              <label htmlFor="file-upload">
                <div className="text-5xl mb-4">📄</div>
                <h3 className="text-2xl font-bold text-gray-700 mb-2">Drop privacy policy</h3>
                <p className="text-gray-500">PDF, DOC, DOCX</p>
                {file && <p className="mt-4 bg-blue-100 px-4 py-2 rounded-lg text-blue-800">{file.name}</p>}
              </label>
            </div>
            {file && (
              <button
                onClick={analyzeCompliance}
                disabled={analyzing}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white px-12 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl disabled:opacity-50"
              >
                {analyzing ? '🔄 Analyzing...' : '🚀 Analyze Compliance'}
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            <div className="text-center p-6 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-2xl">
              Risk Score: {results.overall_risk_score}/10
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-6 bg-blue-50 rounded-xl">
                <h3 className="text-xl font-bold mb-4">🌍 GDPR</h3>
                <ul>
                  {results.gdr?.findings?.map((f: string, i: number) => (
                    <li key={i} className="flex gap-2 mb-2">
                      <span className="text-red-500">🚨</span> {f}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="p-6 bg-green-50 rounded-xl">
                <h3 className="text-xl font-bold mb-4">🇺🇸 CCPA</h3>
                <ul>
                  {results.ccpa?.findings?.map((f: string, i: number) => (
                    <li key={i} className="flex gap-2 mb-2">
                      <span className="text-orange-500">⚠️</span> {f}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <button className="w-full bg-gradient-to-r from-emerald-400 to-green-500 text-white py-4 rounded-xl font-bold text-lg">
              💳 Checkout $49 → Get Full Report
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
