import React from 'react';
import { Shield, Lock, AlertTriangle, CheckCircle, Scale } from 'lucide-react';

export const HowItWorksPage: React.FC = () => {
  return (
    <div className="max-w-[880px] mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-12">
      {/* Header */}
      <div className="space-y-3 text-center sm:text-left">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#00A896]/10 text-[#00A896] text-xs font-semibold border border-[#00A896]/20">
          <Shield className="w-3.5 h-3.5" />
          <span>Transparency & Educational Purpose</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0B1F3A]">
          How HireShield Works, What It Limits, and Why
        </h1>
        <p className="text-base text-[#5B6678] leading-relaxed">
          HireShield is built as an explainable early-warning and education radar for students and early-career applicants.
        </p>
      </div>

      {/* The Transparent Approach */}
      <div className="card-white p-6 sm:p-8 rounded-2xl border border-[#E6ECF3] space-y-4">
        <h2 className="text-xl font-bold text-[#0B1F3A] flex items-center gap-2">
          <span>1. The Approach: Heuristic & Explainable Detection</span>
        </h2>
        <p className="text-sm text-[#5B6678] leading-relaxed">
          Unlike opaque "black-box" systems, HireShield evaluates submissions through transparent, deterministic behavioral heuristics combined with string-level domain checks:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="card-soft p-4 rounded-xl border border-[#E6ECF3] space-y-1.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#0B1F3A]">
              Content Behavioral Cues
            </h4>
            <p className="text-xs text-[#5B6678] leading-relaxed">
              Detects financial advance payment demands (laptop, kit, onboarding fees), high-pressure urgency deadlines (24h ultimatums), off-platform pivots to Telegram/WhatsApp, and public email accounts claiming enterprise authority.
            </p>
          </div>
          <div className="card-soft p-4 rounded-xl border border-[#E6ECF3] space-y-1.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#0B1F3A]">
              Domain & URL Heuristics (Offline)
            </h4>
            <p className="text-xs text-[#5B6678] leading-relaxed">
              Analyzes link structures for character substitutions (e.g. lookalikes), suspicious generic TLDs (.xyz, .top), raw IP addresses, and link shorteners that conceal destinations.
            </p>
          </div>
        </div>
      </div>

      {/* Privacy Stance */}
      <div className="card-white p-6 sm:p-8 rounded-2xl border border-[#E6ECF3] space-y-4">
        <h2 className="text-xl font-bold text-[#0B1F3A] flex items-center gap-2">
          <Lock className="w-5 h-5 text-[#00A896]" />
          <span>2. Our Privacy Stance: Zero Secret Storage</span>
        </h2>
        <div className="space-y-3 text-sm text-[#5B6678] leading-relaxed">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-4 h-4 text-[#2FB171] shrink-0 mt-1" />
            <div>
              <strong className="text-[#0B1F3A]">Client-side Scanning & Masking:</strong> When text contains payment card numbers, OTPs, or government IDs, HireShield alerts the user immediately in the browser and offers one-click masking before transmission.
            </div>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle className="w-4 h-4 text-[#2FB171] shrink-0 mt-1" />
            <div>
              <strong className="text-[#0B1F3A]">Strict Server-Side Redaction:</strong> We never log raw user submission strings to disk or database. Only anonymized statistical metrics and redacted patterns are recorded.
            </div>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle className="w-4 h-4 text-[#2FB171] shrink-0 mt-1" />
            <div>
              <strong className="text-[#0B1F3A]">Zero Network Probing:</strong> HireShield does not make live outbound HTTP requests to user-submitted URLs, preventing tracking pixels, IP leakage, or alerting the sender.
            </div>
          </div>
        </div>
      </div>

      {/* Explicit Limitations & Philosophy */}
      <div className="card-white p-6 sm:p-8 rounded-2xl border border-[#E6ECF3] space-y-4">
        <h2 className="text-xl font-bold text-[#0B1F3A] flex items-center gap-2">
          <Scale className="w-5 h-5 text-[#F5A524]" />
          <span>3. Limitations & Ethics: An Alert, Never a Verdict</span>
        </h2>
        <div className="space-y-3 text-sm text-[#5B6678] leading-relaxed">
          <div className="p-4 bg-[#FFFBEB] border border-[#FDE68A] rounded-xl text-xs text-[#0B1F3A] space-y-2">
            <div className="font-bold flex items-center gap-1.5 text-[#F5A524]">
              <AlertTriangle className="w-4 h-4" />
              <span>Core Principle: No Accusations, No False Certainty</span>
            </div>
            <p>
              HireShield evaluates linguistic patterns and domain structures. It <strong>never accuses a named company or individual</strong>, and <strong>never guarantees</strong> that an offer is 100% genuine or 100% fake.
            </p>
          </div>

          <p>
            Scammers continually evolve tactics. A sophisticated attacker might craft a polite, well-written email from a clean domain. For this reason:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-xs text-[#5B6678]">
            <li>A "Low Risk" result means no obvious heuristic red flags were detected—it is not an endorsement.</li>
            <li>HireShield always presents the 5-point Safe Verification Checklist so candidates learn independent habits.</li>
            <li>Candidates are urged to navigate directly to company career sites and contact official talent offices.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
