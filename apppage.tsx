"use client"
import { useState } from 'react'
import { Upload, Mic, FileText, AlertCircle, CheckCircle, Play } from 'lucide-react'

export default function Home() {
  const [step, setStep] = useState(1)
  const [appId, setAppId] = useState('')
  const [files, setFiles] = useState({ call: null as File | null, credit: null as File | null })
  const [results, setResults] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const handleAnalyze = async () => {
    setLoading(true)
    setStep(2)
    
    const formData = new FormData()
    formData.append('audioFile', files.call!)
    formData.append('creditFile', files.credit!)
    formData.append('appId', appId)

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        body: formData
      })
      const data = await res.json()
      setResults(data)
      setStep(3)
    } catch (error) {
      console.error(error)
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-emerald-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center bg-gradient-to-r from-indigo-600 to-emerald-600 px-6 py-3 rounded-full shadow-lg">
            <span className="text-white font-bold text-xl mr-2">🚗</span>
            <h1 className="text-2xl md:text-4xl font-black text-white drop-shadow-lg">AASIP</h1>
          </div>
          <p className="text-xl md:text-2xl text-gray-700 font-semibold mt-4 max-w-2xl mx-auto">
            Automotive Sales Intelligence Platform - Rescue Lost Deals Instantly
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left: Input / Results */}
          <div className="space-y-6">
            
            {/* Step 1: Input */}
            {step === 1 && (
              <div className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white/50">
                <h2 className="text-2xl font-bold mb-8 text-gray-800 flex items-center">
                  <Mic className="mr-3 text-indigo-600 w-8 h-8" />
                  Step 1: Upload Deal Files
                </h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">APP ID</label>
                    <input
                      type="text"
                      placeholder="CARS12345"
                      value={appId}
                      onChange={(e) => setAppId(e.target.value)}
                      className="w-full p-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-indigo-200 focus:border-indigo-500 transition-all"
                    />
                  </div>
                  
                  <UploadFile 
                    label="📞 Call Recording" 
                    accept="audio/*" 
                    onChange={(f) => setFiles({...files, call: f})}
                  />
                  
                  <UploadFile 
                    label="📄 CIBIL/Credit Report" 
                    accept=".pdf" 
                    onChange={(f) => setFiles({...files, credit: f})}
                  />

                  <button
                    onClick={handleAnalyze}
                    disabled={!appId || !files.call || !files.credit || loading}
                    className="w-full bg-gradient-to-r from-indigo-600 to-emerald-600 text-white py-6 rounded-2xl font-bold text-xl shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {loading ? (
                      <>
                        <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3" />
                        Analyzing Deal...
                      </>
                    ) : (
                      '🚀 Analyze & Rescue Deal'
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Processing */}
            {step === 2 && (
              <div className="bg-gradient-to-br from-indigo-500 to-emerald-500 text-white p-12 rounded-3xl shadow-2xl text-center animate-pulse">
                <div className="w-24 h-24 bg-white/20 rounded-full mx-auto mb-8 flex items-center justify-center">
                  <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                </div>
                <h2 className="text-3xl font-black mb-4">Analyzing Your Deal...</h2>
                <p className="text-xl opacity-90">AI is reviewing call quality, credit eligibility, and generating rescue actions</p>
              </div>
            )}

            {/* Step 3: Results */}
            {step === 3 && results && (
              <div className="space-y-6">
                {/* Deal Risk */}
                <div className={`p-8 rounded-3xl shadow-2xl text-white flex items-center ${
                  results.deal_risk === 'HIGH' ? 'bg-gradient-to-r from-red-500 to-orange-500' :
                  results.deal_risk === 'MEDIUM' ? 'bg-gradient-to-r from-yellow-500 to-orange-500' :
                  'bg-gradient-to-r from-emerald-500 to-green-600'
                }`}>  
                  <AlertCircle className="w-16 h-16 opacity-80 mr-6" />
                  <div>
                    <h2 className="text-3xl font-black mb-2">Deal Risk: {results.deal_risk}</h2>
                    <div className="text-5xl font-black mb-2">{results.risk_score}%</div>
                    <p className="opacity-90 text-lg">{results.risk_reason}</p>
                  </div>
                </div>

                {/* Scores Grid */}
                <div className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-2xl">
                  <h3 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
                    <FileText className="mr-3 w-8 h-8 text-indigo-600" />
                    Call Quality Scores
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {['rapport', 'negotiation', 'closure', 'fatals'].map((metric) => (
                      <ScoreCard 
                        key={metric}
                        title={metric.charAt(0).toUpperCase() + metric.slice(1)}
                        score={results.scores?.[metric] || 0}
                      />
                    ))}
                  </div>
                </div>

                {/* Rescue Actions */}
                <div className="bg-emerald-50/80 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border-4 border-emerald-200/50">
                  <h3 className="text-2xl font-bold mb-6 text-emerald-800 flex items-center">
                    <CheckCircle className="mr-3 w-8 h-8" />
                    Next Best Actions (Send Now!)
                  </h3>
                  <div className="space-y-4">
                    {results.rescue_actions?.map((action: string, i: number) => (
                      <div key={i} className="bg-white p-4 rounded-2xl shadow-md border-l-4 border-emerald-500 hover:shadow-lg transition-all">
                        <div className="flex items-start">
                          <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 mr-4 flex-shrink-0" />
                          <div>
                            <p className="font-semibold text-emerald-800">{action}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Credit Analysis */}
                {results.credit_analysis && (
                  <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-8 rounded-3xl shadow-2xl">
                    <h3 className="text-2xl font-bold mb-6">💳 Credit Fit</h3>
                    <div className="grid md:grid-cols-2 gap-6 text-lg">
                      <div>Eligibility Score: <span className="font-black text-2xl">{results.credit_analysis.eligibility_score}</span></div>
                      <div>Max Car Value: ₹{results.credit_analysis.max_car_value?.toLocaleString()}</div>
                      <div>Pending Loans: ₹{results.credit_analysis.total_loans?.toLocaleString()}</div>
                      <div>Recommended Token: ₹{results.deal_fit_score?.toLocaleString()}</div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right: Marketing Content + CTA */}
          <div className="space-y-6 lg:sticky lg:top-8 lg:h-fit">
            {step >= 3 && (
              <div className="bg-gradient-to-br from-purple-500 to-pink-600 text-white p-8 rounded-3xl shadow-2xl">
                <h3 className="text-2xl font-bold mb-6 flex items-center">
                  <Play className="mr-3 w-8 h-8" />
                  Auto-Generated Marketing
                </h3>
                <div className="bg-white/20 p-6 rounded-2xl backdrop-blur-sm">
                  <p className="font-semibold mb-4">🎵 15-sec Reel Script:</p>
                  <p>\"Abhay's ₹3.63L deal LOCKED! Tomorrow stock-in confirmed 🎉 #CARS24 #CarDeal\"</p>
                  <div className="mt-4 p-4 bg-white/30 rounded-xl text-sm">
                    Hashtags: #UsedCars #DelhiDeals #CarSale #StockIn
                  </div>
                </div>
                <button className="w-full mt-6 bg-white/20 backdrop-blur-sm hover:bg-white/30 py-3 px-6 rounded-2xl font-bold transition-all">
                  📱 Copy Reel Script
                </button>
              </div>
            )}

            {/* Stripe CTA */}
            <div className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border-2 border-gray-100 hover:border-indigo-200 transition-all">
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-r from-indigo-500 to-emerald-500 rounded-3xl mx-auto flex items-center justify-center mb-4">
                  <span className="text-2xl font-bold text-white">₹999</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Pro Unlimited</h3>
                <p className="text-gray-600 mb-4">Unlimited calls, credit reports, team access</p>
              </div>
              <button className="w-full bg-gradient-to-r from-indigo-600 to-emerald-600 text-white py-5 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all">
                🚀 Get Full Access Now
              </button>
              <p className="text-xs text-gray-500 mt-4 text-center">Cancel anytime • 14-day money back</p>
            </div>

            {/* Features */}
            <div className="bg-white/60 backdrop-blur-xl p-8 rounded-3xl shadow-xl border">
              <h4 className="font-bold text-lg mb-6 text-gray-800">✅ What You Get</h4>
              <ul className="space-y-3 text-sm">
                <li className="flex items-center"><CheckCircle className="w-5 h-5 text-emerald-500 mr-3" />Rescues 30% more lost deals</li>
                <li className="flex items-center"><CheckCircle className="w-5 h-5 text-emerald-500 mr-3" />Auto credit eligibility scoring</li>
                <li className="flex items-center"><CheckCircle className="w-5 h-5 text-emerald-500 mr-3" />Ready-to-send WhatsApp scripts</li>
                <li className="flex items-center"><CheckCircle className="w-5 h-5 text-emerald-500 mr-3" />Instagram reel content generator</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Helper Components
function UploadFile({ label, accept, onChange }: { label: string, accept: string, onChange: (f: File) => void }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">{label}</label>
      <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:border-indigo-400 transition-all hover:bg-indigo-50/50">
        <input
          type="file"
          accept={accept}
          onChange={(e) => e.target.files && onChange(e.target.files[0])}
          className="hidden"
          id={`file-${label}`}
        />
        <label htmlFor={`file-${label}`} className="cursor-pointer flex flex-col items-center">
          <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mb-4">
            <Upload className="w-8 h-8 text-indigo-600" />
          </div>
          <p className="font-medium text-gray-700 mb-1">Click to upload</p>
          <p className="text-xs text-gray-500">{accept}</p>
        </label>
      </div>
    </div>
  )
}

function ScoreCard({ title, score }: { title: string, score: number }) {
  const color = score >= 8 ? 'text-emerald-600' : score >= 6 ? 'text-yellow-600' : 'text-red-600'
  return (
    <div className="p-4 bg-gray-50 rounded-xl text-center border hover:shadow-md transition-all">
      <div className="text-sm font-semibold text-gray-700 mb-2">{title}</div>
      <div className={`text-2xl font-black ${color}`}>{score}/10</div>
    </div>
  )
}