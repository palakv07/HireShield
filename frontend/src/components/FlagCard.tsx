import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, AlertCircle, Info, Quote } from 'lucide-react';
import type { FlagItem } from '../types';

interface FlagCardProps {
  flag: FlagItem;
  index: number;
}

export const FlagCard: React.FC<FlagCardProps> = ({ flag, index }) => {
  const isHigh = flag.severity === 'HIGH';
  const isMed = flag.severity === 'MEDIUM';

  const colorStyles = isHigh
    ? {
        badgeBg: '#FDF2F2',
        badgeBorder: '#F8B4B4',
        badgeText: '#E5484D',
        leftBorder: '#E5484D',
        evidenceBg: '#FEF2F2',
        Icon: AlertTriangle,
      }
    : isMed
    ? {
        badgeBg: '#FFFBEB',
        badgeBorder: '#FDE68A',
        badgeText: '#F5A524',
        leftBorder: '#F5A524',
        evidenceBg: '#FFFBEB',
        Icon: AlertCircle,
      }
    : {
<<<<<<< HEAD
        badgeBg: '#EFF6FF',
        badgeBorder: '#BFDBFE',
        badgeText: '#1268E8',
        leftBorder: '#1268E8',
        evidenceBg: '#EFF6FF',
=======
        badgeBg: '#F0FDF4',
        badgeBorder: '#BBF7D0',
        badgeText: '#2FB171',
        leftBorder: '#2FB171',
        evidenceBg: '#F0FDF4',
>>>>>>> 7c1efe61800a232852d74638a245ab69db8ed95b
        Icon: Info,
      };

  const IconComponent = colorStyles.Icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.08 }}
      className="card-white p-5 sm:p-6 border border-[#E6ECF3] border-l-4 transition-shadow hover:shadow-md"
      style={{ borderLeftColor: colorStyles.leftBorder }}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <span
            className="p-1 rounded-md"
            style={{ backgroundColor: colorStyles.badgeBg, color: colorStyles.badgeText }}
          >
            <IconComponent className="w-4 h-4" />
          </span>
          <h4 className="text-base font-bold text-[#0B1F3A]">
            {flag.title}
          </h4>
        </div>

        <span
          className="self-start sm:self-auto px-2.5 py-0.5 rounded text-[11px] font-bold tracking-wide uppercase border"
          style={{
            backgroundColor: colorStyles.badgeBg,
            borderColor: colorStyles.badgeBorder,
            color: colorStyles.badgeText,
          }}
        >
          {flag.severity} RISK · +{flag.weight} pts
        </span>
      </div>

      {/* Quoted Evidence */}
      <div
        className="rounded-lg p-3 my-3 text-xs sm:text-sm font-mono border border-dashed flex items-start gap-2.5"
        style={{
          backgroundColor: colorStyles.evidenceBg,
          borderColor: colorStyles.badgeBorder,
        }}
      >
        <Quote className="w-4 h-4 shrink-0 text-[#8A94A6] mt-0.5" />
        <span className="font-semibold text-[#0B1F3A] break-words">
          "{flag.evidence}"
        </span>
      </div>

      {/* Why This Matters */}
      <div className="text-xs sm:text-sm text-[#5B6678] flex items-start gap-1.5 pt-1">
        <span className="font-semibold text-[#0B1F3A] shrink-0">Why this matters:</span>
        <span>{flag.why}</span>
      </div>
    </motion.div>
  );
};
