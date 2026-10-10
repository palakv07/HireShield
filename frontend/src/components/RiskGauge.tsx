import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, AlertCircle, CheckCircle2, HelpCircle } from 'lucide-react';
import type { RiskLevel } from '../types';

interface RiskGaugeProps {
  score: number;
  riskLevel: RiskLevel;
  summary: string;
  confidenceNote: string;
}

export const RiskGauge: React.FC<RiskGaugeProps> = ({
  score,
  riskLevel,
  summary,
  confidenceNote,
}) => {
  // Map risk level to color tokens and accessible icons
  const config = {
    HIGH: {
      color: '#E5484D',
      bgLight: '#FDF2F2',
      border: '#F8B4B4',
      label: 'HIGH RISK',
      badgeText: 'High Risk Detected',
      Icon: AlertTriangle,
      description: 'Critical red flags strongly indicating fraudulent solicitation or scam patterns.',
    },
    MEDIUM: {
      color: '#F5A524',
      bgLight: '#FFFBEB',
      border: '#FDE68A',
      label: 'MEDIUM RISK',
      badgeText: 'Moderate Risk / Suspicious',
      Icon: AlertCircle,
      description: 'Contains warning patterns requiring thorough independent verification.',
    },
    LOW: {
      color: '#2FB171',
      bgLight: '#F0FDF4',
      border: '#BBF7D0',
      label: 'LOW RISK',
      badgeText: 'Low Risk Indicators',
      Icon: CheckCircle2,
      description: 'No obvious red flags detected in the provided submission.',
    },
  }[riskLevel] || {
    color: '#8A94A6',
    bgLight: '#F6F8FB',
    border: '#E6ECF3',
    label: 'UNKNOWN',
    badgeText: 'Indeterminate',
    Icon: HelpCircle,
    description: 'Insufficient context provided.',
  };

  const IconComponent = config.Icon;

  // Semicircle parameters
  const radius = 80;
  const circumference = Math.PI * radius; // Half-circle
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="card-white p-6 sm:p-8 flex flex-col md:flex-row items-center gap-6 sm:gap-10 border border-[#E6ECF3]">
      {/* Gauge Visual */}
      <div className="relative flex flex-col items-center justify-center shrink-0">
        <svg
          width="210"
          height="125"
          viewBox="0 0 210 125"
          className="overflow-visible"
          aria-hidden="true"
        >
          {/* Background Arc */}
          <path
            d="M 25 105 A 80 80 0 0 1 185 105"
            fill="none"
            stroke="#E6ECF3"
            strokeWidth="14"
            strokeLinecap="round"
          />

          {/* Animated Foreground Arc */}
          <motion.path
            d="M 25 105 A 80 80 0 0 1 185 105"
            fill="none"
            stroke={config.color}
            strokeWidth="14"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.1, ease: 'easeOut' }}
          />
        </svg>

        {/* Center Score & Text */}
        <div className="absolute top-12 flex flex-col items-center justify-center text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="flex items-baseline gap-0.5"
          >
            <span className="text-4xl font-extrabold tracking-tight text-[#0B1F3A]">
              {score}
            </span>
            <span className="text-xs font-semibold text-[#8A94A6]">/100</span>
          </motion.div>
          <span
            className="text-[11px] font-bold tracking-wider uppercase mt-0.5"
            style={{ color: config.color }}
          >
            {config.label}
          </span>
        </div>

        {/* Scale labels */}
        <div className="w-[190px] flex justify-between text-[11px] font-medium text-[#8A94A6] mt-[-6px]">
          <span>0 (Low)</span>
          <span>50</span>
          <span>100 (High)</span>
        </div>
      </div>

      {/* Summary & Explanation */}
      <div className="flex-1 text-center md:text-left space-y-3">
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
          <span
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase border"
            style={{
              backgroundColor: config.bgLight,
              borderColor: config.border,
              color: config.color,
            }}
          >
            <IconComponent className="w-3.5 h-3.5" />
            {config.badgeText}
          </span>
          <span className="text-xs text-[#8A94A6] bg-[#F6F8FB] px-2.5 py-1 rounded-full border border-[#E6ECF3]">
            {confidenceNote}
          </span>
        </div>

        <h3 className="text-xl sm:text-2xl font-bold text-[#0B1F3A] leading-snug">
          {summary}
        </h3>

        <p className="text-sm text-[#5B6678] leading-relaxed">
          {config.description}
        </p>

        <div className="text-xs text-[#8A94A6] pt-1">
          Scoring threshold: High (≥60) · Medium (30–59) · Low (&lt;30)
        </div>
      </div>
    </div>
  );
};
