import React, { useState, useEffect } from 'react';
import { ShieldAlert, CheckCircle2, Lock, ArrowLeft, Send, Eye } from 'lucide-react';
import { maskSensitiveData } from '../utils/masking';

interface ReportScamPageProps {
  initialText?: string;
  onBackToAnalyzer: () => void;
}

export const ReportScamPage: React.FC<ReportScamPageProps> = ({
  initialText = '',
  onBackToAnalyzer,
}) => {
  const [scamType, setScamType] = useState('fee');
  const [platform, setPlatform] = useState('LinkedIn');
  const [rawText, setRawText] = useState(initialText);
  const [redactedPreview, setRedactedPreview] = useState('');
  const [confirmedPreview, setConfirmedPreview] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [reportId, setReportId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Auto-redact as the text changes
  useEffect(() => {
    const cleaned = maskSensitiveData(rawText);
    setRedactedPreview(cleaned);
  }, [rawText]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!redactedPreview.trim()) {
      setErrorMsg('Please provide description or text of the scam encounter.');
      return;
    }
    if (!confirmedPreview) {
      setErrorMsg('Please review and check the confirmation box verifying the redacted preview.');
      return;
    }

    setSubmitting(true);
    setErrorMsg(null);

    try {
      const response = await fetch('/api/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scam_type: scamType,
          platform: platform,
          redacted_text: redactedPreview,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to record scam report. Please try again.');
      }

      const data = await response.json();
      setReportId(data.report_id);
    } catch (err: any) {
      setErrorMsg(err.message || 'Error submitting report.');
    } finally {
      setSubmitting(false);
    }
  };

  if (reportId) {
    return (
      <div className="max-w-[720px] mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-[#1268E8]/10 text-[#1268E8] mx-auto flex items-center justify-center border border-[#1268E8]/20">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B1F3A]">
          Thank you for reporting this pattern
        </h2>
        <p className="text-sm text-[#5B6678] max-w-md mx-auto leading-relaxed">
          Your report has been securely saved with strict PII scrubbing. It helps keep early-career job seekers safe and updates community risk trends.
        </p>

        <div className="card-soft p-4 rounded-xl text-xs text-[#8A94A6] max-w-sm mx-auto border border-[#E6ECF3]">
          Reference ID: <span className="font-mono text-[#0B1F3A]">{reportId}</span>
        </div>

        <div className="p-4 bg-[#EFF6FF] border border-[#BFDBFE] rounded-xl text-xs text-[#1268E8] max-w-md mx-auto">
          <strong>Reminder:</strong> If money or banking information was already shared, contact your financial institution and local cybersecurity reporting authority immediately.
        </div>

        <div className="pt-4">
          <button
            onClick={onBackToAnalyzer}
            className="px-6 py-2.5 bg-[#1268E8] hover:bg-[#0B4DB3] text-white text-sm font-semibold rounded-xl shadow-xs"
          >
            Back to Analyzer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[760px] mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
      {/* Back button */}
      <div>
        <button
          onClick={onBackToAnalyzer}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#5B6678] hover:text-[#0B1F3A] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Analyzer</span>
        </button>
      </div>

      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E5484D]/10 text-[#E5484D] text-xs font-semibold border border-[#E5484D]/20">
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>Community Threat Intelligence</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B1F3A]">
          Report a Recruitment Scam
        </h1>
        <p className="text-sm text-[#5B6678] leading-relaxed">
          Help warn other candidates. All personal emails, phone numbers, and digits are automatically redacted before submission.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="card-white p-6 sm:p-8 rounded-2xl border border-[#E6ECF3] space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Scam Type */}
          <div>
            <label className="block text-xs font-bold text-[#0B1F3A] uppercase tracking-wider mb-2">
              Scam Type
            </label>
            <select
              value={scamType}
              onChange={(e) => setScamType(e.target.value)}
              className="w-full text-sm bg-[#F6F8FB] border border-[#E6ECF3] rounded-xl px-3.5 py-2.5 text-[#0B1F3A] focus:outline-none focus:border-[#1268E8]"
            >
              <option value="fee">Upfront Fee / Deposit Demand</option>
              <option value="phishing_link">Phishing Link / Malicious Site</option>
              <option value="impersonation">Enterprise / Recruiter Impersonation</option>
              <option value="fake_posting">Fake Job Posting / Unrealistic Offer</option>
              <option value="other">Other Suspicious Activity</option>
            </select>
          </div>

          {/* Platform */}
          <div>
            <label className="block text-xs font-bold text-[#0B1F3A] uppercase tracking-wider mb-2">
              Platform Where Found
            </label>
            <select
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              className="w-full text-sm bg-[#F6F8FB] border border-[#E6ECF3] rounded-xl px-3.5 py-2.5 text-[#0B1F3A] focus:outline-none focus:border-[#1268E8]"
            >
              <option value="LinkedIn">LinkedIn</option>
              <option value="WhatsApp">WhatsApp</option>
              <option value="Telegram">Telegram</option>
              <option value="Email">Email</option>
              <option value="Other">Other Job Board / SMS</option>
            </select>
          </div>
        </div>

        {/* Text of message / encounter */}
        <div>
          <label className="block text-xs font-bold text-[#0B1F3A] uppercase tracking-wider mb-2">
            Message or Listing Content
          </label>
          <textarea
            rows={5}
            value={rawText}
            onChange={(e) => setRawText(e.target.value)}
            placeholder="Paste the suspicious message, job details, or pitch..."
            className="w-full p-3.5 text-sm bg-white border border-[#E6ECF3] rounded-xl text-[#0B1F3A] placeholder-[#8A94A6] focus:outline-none focus:border-[#1268E8]"
          />
        </div>

        {/* Live Redacted Preview with Confirmation */}
        <div className="card-soft p-4 rounded-xl border border-[#E6ECF3] space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#0B1F3A]">
              <Eye className="w-4 h-4 text-[#1268E8]" />
              <span>Redacted Preview (What will actually be logged)</span>
            </div>
            <span className="text-[11px] text-[#8A94A6] flex items-center gap-1">
              <Lock className="w-3 h-3" />
              Auto-sanitized
            </span>
          </div>

          <div className="p-3 bg-white border border-[#E6ECF3] rounded-lg text-xs font-mono text-[#0B1F3A] whitespace-pre-wrap max-h-40 overflow-y-auto">
            {redactedPreview || '(Redacted preview will appear here)'}
          </div>

          <label className="flex items-start gap-2.5 pt-1 cursor-pointer">
            <input
              type="checkbox"
              checked={confirmedPreview}
              onChange={(e) => setConfirmedPreview(e.target.checked)}
              className="mt-0.5 rounded text-[#1268E8] focus:ring-[#1268E8]"
            />
            <span className="text-xs text-[#0B1F3A] font-medium leading-relaxed">
              I have inspected the redacted preview and confirm it does not contain private passwords or personal secrets.
            </span>
          </label>
        </div>

        {errorMsg && (
          <div className="p-3 bg-[#FDF2F2] border border-[#F8B4B4] rounded-xl text-xs text-[#E5484D]">
            {errorMsg}
          </div>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-3 bg-[#1268E8] hover:bg-[#0B4DB3] disabled:opacity-60 text-white font-bold text-sm rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm"
        >
          <Send className="w-4 h-4" />
          <span>{submitting ? 'Submitting securely...' : 'Submit Redacted Report'}</span>
        </button>
      </form>
    </div>
  );
};
