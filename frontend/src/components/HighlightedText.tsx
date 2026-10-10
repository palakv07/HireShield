import React, { useState } from 'react';
import type { FlagItem } from '../types';

interface HighlightedTextProps {
  text: string;
  flags: FlagItem[];
}

interface Segment {
  start: number;
  end: number;
  text: string;
  flag?: FlagItem;
}

export const HighlightedText: React.FC<HighlightedTextProps> = ({ text, flags }) => {
  const [activeTooltip, setActiveTooltip] = useState<{
    text: string;
    why: string;
    title: string;
    severity: string;
  } | null>(null);

  if (!text) {
    return null;
  }

  // Filter content flags that exist in the text
  const contentFlags = flags.filter(
    (f) => f.span && f.span[0] < f.span[1] && f.span[1] <= text.length
  );

  // If no content flags or no spans match, return clean formatted text
  if (contentFlags.length === 0) {
    return (
      <div className="card-soft p-5 border border-[#E6ECF3] rounded-xl text-sm leading-relaxed text-[#0B1F3A] whitespace-pre-wrap font-sans">
        {text}
      </div>
    );
  }

  // Sort flags by start index
  const sortedFlags = [...contentFlags].sort((a, b) => a.span[0] - b.span[0]);

  // Build non-overlapping segments
  const segments: Segment[] = [];
  let currentIndex = 0;

  for (const flag of sortedFlags) {
    const [start, end] = flag.span;

    // Guard against negative or out of bounds
    if (start < currentIndex) continue;

    // Plain text before the flag
    if (start > currentIndex) {
      segments.push({
        start: currentIndex,
        end: start,
        text: text.slice(currentIndex, start),
      });
    }

    // Highlighted segment
    segments.push({
      start,
      end,
      text: text.slice(start, end),
      flag,
    });

    currentIndex = end;
  }

  // Trailing text
  if (currentIndex < text.length) {
    segments.push({
      start: currentIndex,
      end: text.length,
      text: text.slice(currentIndex),
    });
  }

  return (
    <div className="relative">
      <div className="card-soft p-5 border border-[#E6ECF3] rounded-xl text-sm leading-relaxed text-[#0B1F3A] whitespace-pre-wrap font-sans select-text">
        {segments.map((seg, idx) => {
          if (!seg.flag) {
            return <span key={idx}>{seg.text}</span>;
          }

          const isHigh = seg.flag.severity === 'HIGH';
          const isMed = seg.flag.severity === 'MEDIUM';

          const bgClass = isHigh
            ? 'bg-[#E5484D]/15 text-[#0B1F3A] border-b-2 border-[#E5484D] font-medium'
            : isMed
            ? 'bg-[#F5A524]/20 text-[#0B1F3A] border-b-2 border-[#F5A524] font-medium'
            : 'bg-[#2FB171]/15 text-[#0B1F3A] border-b-2 border-[#2FB171] font-medium';

          return (
            <span
              key={idx}
              className={`relative inline-block cursor-help px-1 py-0.5 rounded-sm transition-all hover:bg-opacity-30 ${bgClass}`}
              onMouseEnter={() =>
                setActiveTooltip({
                  text: seg.text,
                  why: seg.flag?.why || '',
                  title: seg.flag?.title || '',
                  severity: seg.flag?.severity || 'LOW',
                })
              }
              onMouseLeave={() => setActiveTooltip(null)}
              onClick={() =>
                setActiveTooltip({
                  text: seg.text,
                  why: seg.flag?.why || '',
                  title: seg.flag?.title || '',
                  severity: seg.flag?.severity || 'LOW',
                })
              }
            >
              {seg.text}
            </span>
          );
        })}
      </div>

      {/* Floating Tooltip Indicator */}
      {activeTooltip && (
        <div className="mt-3 p-3.5 bg-[#0B1F3A] text-white text-xs rounded-xl shadow-lg border border-[#0B1F3A]/20 transition-all">
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="font-bold text-white uppercase tracking-wider text-[10px]">
              Flagged: {activeTooltip.title}
            </span>
            <span
              className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                activeTooltip.severity === 'HIGH'
                  ? 'bg-[#E5484D] text-white'
                  : 'bg-[#F5A524] text-black'
              }`}
            >
              {activeTooltip.severity}
            </span>
          </div>
          <p className="text-slate-200">{activeTooltip.why}</p>
        </div>
      )}
    </div>
  );
};
