import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldAlert,
  Search,
  Link as LinkIcon,
  FileText,
  AlertOctagon,
  Copy,
  Check,
  Sparkles,
  ShieldQuestion,
  Lock,
  Layers,
  CheckCircle,
} from 'lucide-react';

import type { AnalysisResult } from '../types';
import { DEMO_SAMPLES } from '../data/demoSamples';
import { scanSensitiveData, maskSensitiveData } from '../utils/masking';
import { RiskGauge } from '../components/RiskGauge';
import { FlagCard } from '../components/FlagCard';
import { HighlightedText } from '../components/HighlightedText';
import { VerificationChecklist } from '../components/VerificationChecklist';
import { FeedbackWidget } from '../components/FeedbackWidget';

interface AnalyzerViewProps {
  onOpenReportModal: (textToReport: string) => void;
}

export const AnalyzerView: React.FC<AnalyzerViewProps> = ({ onOpenReportModal }) => {
  const [activeTab, setActiveTab] = useState<'both' | 'text' | 'url'>('both');
  const [inputText, setInputText] = useState('');
  const [inputUrl, setInputUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);

  // Client-side sensitive data scanner
  const sensitiveFindings = scanSensitiveData(inputText);

  // Handle mask action
  const handleMaskSensitive = () => {
    const masked = maskSensitiveData(inputText);
    setInputText(masked);
  };

  // Load demo sample
  const handleLoadSample = (sampleId: string) => {
    const sample = DEMO_SAMPLES.find((s) => s.id === sampleId);
    if (sample) {
      setInputText(sample.text);
      setInputUrl(sample.url);
      setErrorMsg(null);
      if (sample.text && sample.url) {
        setActiveTab('both');
      } else if (sample.url) {
        setActiveTab('url');
      } else {
        setActiveTab('text');
      }
    }
  };

  const handleAnalyze = async () => {
    setErrorMsg(null);
    const textToSubmit = activeTab === 'url' ? '' : inputText.trim();
    const urlToSubmit = activeTab === 'text' ? '' : inputUrl.trim();

    if (!textToSubmit && !urlToSubmit) {
      setErrorMsg('Please enter a message/job posting, a URL, or load an example to analyze.');
      return;
    }

    setIsAnalyzing(true);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: textToSubmit || undefined,
          url: urlToSubmit || undefined,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || 'Analysis request failed. Please check inputs.');
      }

      const data: AnalysisResult = await response.json();
      setAnalysisResult(data);

      // Smooth scroll to results
      setTimeout(() => {
        const resultsEl = document.getElementById('results-section');
        if (resultsEl) {
          resultsEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    } catch (err: any) {
      setErrorMsg(err.message || 'Unable to connect to the analysis engine.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleCopySummary = () => {
    if (!analysisResult) return;
    const summaryText = `[HireShield Assessment]
Risk Level: ${analysisResult.risk_level} (Score: ${analysisResult.score}/100)
Summary: ${analysisResult.summary}
Flags Detected: ${analysisResult.flags.length}
${analysisResult.flags.map((f) => `- ${f.title}: "${f.evidence}"`).join('\n')}
Disclaimer: ${analysisResult.disclaimer}`;

    navigator.clipboard.writeText(summaryText);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2500);
  };

  return (
    <div className="max-w-[1120px] mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-12">
      {/* Hero Section */}
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00A896]/10 text-[#00A896] text-xs font-semibold border border-[#00A896]/20">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Explainable Recruitment Fraud Early Warning</span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#0B1F3A] tracking-tight leading-tight">
          Spot recruitment fraud before it costs you.
        </h1>
        <p className="text-base sm:text-lg text-[#5B6678] leading-relaxed">
          Paste an email, recruiter DM, or career URL. Get an instant, transparent breakdown of red flags, missing signals, and safe next steps.
        </p>
      </div>

      {/* Main Analyzer Card */}
      <div className="card-white p-5 sm:p-8 rounded-2xl border border-[#E6ECF3] shadow-sm max-w-3xl mx-auto space-y-6">
        {/* Persistent Inline Safety Banner */}
        <div className="flex items-start gap-3 p-3.5 bg-[#F6F8FB] border border-[#E6ECF3] rounded-xl text-xs text-[#5B6678]">
          <Lock className="w-4 h-4 text-[#8A94A6] shrink-0 mt-0.5" />
          <div>
            <strong className="text-[#0B1F3A]">Data Safety Notice:</strong> Never paste passwords, OTPs, government IDs, or payment details. HireShield analyzes text heuristics offline and never stores unredacted text.
          </div>
        </div>

        {/* Client-side PII Warning Banner if detected */}
        {sensitiveFindings.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 bg-[#FFFBEB] border border-[#FDE68A] rounded-xl text-xs"
          >
            <div className="flex items-center gap-2 text-[#F5A524] font-semibold">
              <AlertOctagon className="w-4 h-4 shrink-0" />
              <span>
                Sensitive data detected ({sensitiveFindings.map((f) => f.label).join(', ')}).
              </span>
            </div>
            <button
              onClick={handleMaskSensitive}
              className="px-3 py-1.5 bg-[#F5A524] hover:bg-[#D97706] text-white font-semibold rounded-lg shrink-0 transition-colors shadow-xs"
            >
              Mask it now
            </button>
          </motion.div>
        )}

        {/* Input Controls Bar: Tabs & Load Example */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
          {/* Tabs */}
          <div className="inline-flex p-1 rounded-xl bg-[#F6F8FB] border border-[#E6ECF3] text-xs font-semibold">
            <button
              onClick={() => setActiveTab('both')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'both'
                  ? 'bg-white text-[#0B1F3A] shadow-xs'
                  : 'text-[#5B6678] hover:text-[#0B1F3A]'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Both</span>
            </button>
            <button
              onClick={() => setActiveTab('text')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'text'
                  ? 'bg-white text-[#0B1F3A] shadow-xs'
                  : 'text-[#5B6678] hover:text-[#0B1F3A]'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Message / Post</span>
            </button>
            <button
              onClick={() => setActiveTab('url')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'url'
                  ? 'bg-white text-[#0B1F3A] shadow-xs'
                  : 'text-[#5B6678] hover:text-[#0B1F3A]'
              }`}
            >
              <LinkIcon className="w-3.5 h-3.5" />
              <span>URL</span>
            </button>
          </div>

          {/* Load Demo Example Dropdown */}
          <div className="relative">
            <label htmlFor="example-select" className="sr-only">Load example</label>
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#8A94A6] hidden sm:inline">Demo:</span>
              <select
                id="example-select"
                onChange={(e) => e.target.value && handleLoadSample(e.target.value)}
                defaultValue=""
                className="w-full sm:w-auto text-xs font-medium bg-[#F6F8FB] hover:bg-[#E6ECF3]/60 text-[#0B1F3A] border border-[#E6ECF3] rounded-lg px-3 py-2 focus:outline-none focus:border-[#00A896] cursor-pointer"
              >
                <option value="" disabled>
                  Load an example...
                </option>
                {DEMO_SAMPLES.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.tag})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Input Fields */}
        <div className="space-y-4">
          {(activeTab === 'both' || activeTab === 'text') && (
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label
                  htmlFor="analyzer-textarea"
                  className="text-xs font-bold text-[#0B1F3A] uppercase tracking-wider"
                >
                  Message or Job Description
                </label>
                <span className="text-[11px] text-[#8A94A6]">
                  {inputText.length} characters
                </span>
              </div>
              <textarea
                id="analyzer-textarea"
                rows={6}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Paste the recruiter message, WhatsApp/Telegram text, or job posting description here..."
                className="w-full p-3.5 text-sm bg-[#FFFFFF] border border-[#E6ECF3] rounded-xl text-[#0B1F3A] placeholder-[#8A94A6] focus:outline-none focus:border-[#00A896] focus:ring-1 focus:ring-[#00A896] transition-all font-sans leading-relaxed"
              />
            </div>
          )}

          {(activeTab === 'both' || activeTab === 'url') && (
            <div>
              <label
                htmlFor="analyzer-url"
                className="block text-xs font-bold text-[#0B1F3A] uppercase tracking-wider mb-1.5"
              >
                Application or Recruiter URL (Analyzed offline)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#8A94A6]">
                  <LinkIcon className="w-4 h-4" />
                </div>
                <input
                  id="analyzer-url"
                  type="text"
                  value={inputUrl}
                  onChange={(e) => setInputUrl(e.target.value)}
                  placeholder="e.g. https://careers-company-jobs.com/apply or bit.ly link"
                  className="w-full pl-9 pr-3.5 py-2.5 text-sm bg-[#FFFFFF] border border-[#E6ECF3] rounded-xl text-[#0B1F3A] placeholder-[#8A94A6] focus:outline-none focus:border-[#00A896] focus:ring-1 focus:ring-[#00A896] transition-all font-sans"
                />
              </div>
            </div>
          )}
        </div>

        {/* Error message */}
        {errorMsg && (
          <div className="p-3 bg-[#FDF2F2] border border-[#F8B4B4] rounded-xl text-xs text-[#E5484D] font-medium flex items-center gap-2">
            <AlertOctagon className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Action Button */}
        <div>
          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            className="w-full py-3.5 bg-[#00A896] hover:bg-[#007F73] disabled:opacity-60 text-white font-bold text-sm rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-[#00A896] focus:ring-offset-2 active:scale-[0.99]"
          >
            {isAnalyzing ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Evaluating fraud heuristics...</span>
              </>
            ) : (
              <>
                <Search className="w-4 h-4 stroke-[2.5]" />
                <span>Analyze Job Offer</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Results View Section */}
      <AnimatePresence>
        {analysisResult && (
          <motion.div
            id="results-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="max-w-3xl mx-auto space-y-8 pt-4"
          >
            {/* Semicircular Risk Gauge */}
            <RiskGauge
              score={analysisResult.score}
              riskLevel={analysisResult.risk_level}
              summary={analysisResult.summary}
              confidenceNote={analysisResult.confidence_note}
            />

            {/* "What we found" Flag Cards */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-[#0B1F3A] flex items-center gap-2">
                  <span>What we found</span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#F6F8FB] border border-[#E6ECF3] text-[#5B6678]">
                    {analysisResult.flags.length} signal{analysisResult.flags.length === 1 ? '' : 's'}
                  </span>
                </h3>
              </div>

              {analysisResult.flags.length === 0 ? (
                <div className="card-soft p-6 border border-[#E6ECF3] rounded-2xl text-center space-y-2">
                  <div className="w-10 h-10 rounded-full bg-[#2FB171]/10 text-[#2FB171] mx-auto flex items-center justify-center">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-[#0B1F3A]">No obvious red flags found</h4>
                  <p className="text-xs text-[#5B6678] max-w-md mx-auto leading-relaxed">
                    The provided text does not trigger known fraud heuristics. However, sophisticated scams may still appear genuine. Always verify recruiters independently.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {analysisResult.flags.map((flag, idx) => (
                    <FlagCard key={`${flag.id}-${idx}`} flag={flag} index={idx} />
                  ))}
                </div>
              )}
            </div>

            {/* Highlighted Original Text View */}
            {inputText && (
              <div className="space-y-3">
                <h3 className="text-base font-bold text-[#0B1F3A] flex items-center gap-2">
                  <span>Highlighted Text View</span>
                  <span className="text-xs text-[#8A94A6] font-normal">
                    (Hover or tap highlighted phrases to see why)
                  </span>
                </h3>
                <HighlightedText text={inputText} flags={analysisResult.flags} />
              </div>
            )}

            {/* "What we couldn't check" Unknowns Section */}
            {analysisResult.unknowns.length > 0 && (
              <div className="card-soft p-6 border border-[#E6ECF3] rounded-2xl space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-[#8A94A6] uppercase tracking-wider">
                  <ShieldQuestion className="w-4 h-4 text-[#8A94A6]" />
                  <span>What we couldn't check (Missing Evidence)</span>
                </div>
                <ul className="space-y-2 text-xs text-[#5B6678]">
                  {analysisResult.unknowns.map((un, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-[#8A94A6] mt-0.5">•</span>
                      <span>{un}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Interactive Verification Checklist */}
            <VerificationChecklist items={analysisResult.checklist} />

            {/* Results Actions & Feedback */}
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={handleCopySummary}
                  className="flex items-center gap-1.5 px-4 py-2.5 bg-white border border-[#E6ECF3] hover:bg-[#F6F8FB] text-[#0B1F3A] text-xs font-semibold rounded-xl transition-all shadow-xs"
                >
                  {copySuccess ? <Check className="w-3.5 h-3.5 text-[#2FB171]" /> : <Copy className="w-3.5 h-3.5 text-[#8A94A6]" />}
                  <span>{copySuccess ? 'Copied summary!' : 'Copy summary'}</span>
                </button>

                <button
                  onClick={() => onOpenReportModal(inputText || inputUrl)}
                  className="flex items-center gap-1.5 px-4 py-2.5 bg-white border border-[#E6ECF3] hover:border-[#E5484D] hover:text-[#E5484D] text-[#5B6678] text-xs font-semibold rounded-xl transition-all shadow-xs"
                >
                  <ShieldAlert className="w-3.5 h-3.5 text-[#E5484D]" />
                  <span>Report this (redacted)</span>
                </button>
              </div>

              {/* Feedback Widget */}
              <FeedbackWidget analysisId={analysisResult.analysis_id} />
            </div>

            {/* Persistent Disclaimer Footer */}
            <div className="p-4 bg-[#F6F8FB] rounded-xl border border-[#E6ECF3] text-center text-xs text-[#8A94A6] leading-relaxed">
              <strong className="text-[#5B6678]">Important:</strong> {analysisResult.disclaimer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 4-Step "How It Works" Strip */}
      <div className="pt-8 border-t border-[#E6ECF3]">
        <div className="text-center max-w-xl mx-auto mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-[#0B1F3A]">
            How HireShield protects your job search
          </h2>
          <p className="text-xs sm:text-sm text-[#5B6678] mt-1">
            Simple, explainable steps designed to build security habits.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              step: '01',
              title: 'Submit',
              desc: 'Paste a recruiter DM, email, job post, or link. PII is filtered client-side before sending.',
            },
            {
              step: '02',
              title: 'Analyze',
              desc: 'Rules evaluate upfront payments, urgency, domain typosquatting, and unmonitored pivots.',
            },
            {
              step: '03',
              title: 'Understand',
              desc: 'Inspect exact highlighted quoted evidence, risk scoring, and what evidence is still missing.',
            },
            {
              step: '04',
              title: 'Act Safely',
              desc: 'Follow the 5-point verification checklist before answering, clicking links, or sending documents.',
            },
          ].map((item, i) => (
            <div key={i} className="card-soft p-5 border border-[#E6ECF3] rounded-xl space-y-2">
              <div className="text-xs font-mono font-bold text-[#00A896]">{item.step}</div>
              <h4 className="text-sm font-bold text-[#0B1F3A]">{item.title}</h4>
              <p className="text-xs text-[#5B6678] leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Row of Red Flags HireShield Detects */}
      <div className="card-white p-6 border border-[#E6ECF3] rounded-2xl">
        <h3 className="text-xs font-bold text-[#0B1F3A] uppercase tracking-wider mb-4">
          Recruitment Red Flags HireShield Inspects
        </h3>
        <div className="flex flex-wrap gap-2">
          {[
            'Upfront Training / Kit Fee',
            'Security Deposits',
            'Artificial Urgency / 24h Deadlines',
            'Premature Bank / ID Requests',
            'WhatsApp / Telegram Pivots',
            'Enterprise Freemail Impersonation',
            'Typosquatted Lookalike Domains',
            'Obfuscated URL Shorteners',
            'Direct IP Host Addresses',
            'Unrealistic Pay / No Interview',
          ].map((flag, idx) => (
            <span
              key={idx}
              className="text-xs font-medium px-3 py-1.5 rounded-lg bg-[#F6F8FB] text-[#0B1F3A] border border-[#E6ECF3]"
            >
              {flag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
