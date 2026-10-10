import React, { useState } from 'react';
import { CheckSquare, Square, ShieldCheck } from 'lucide-react';

interface VerificationChecklistProps {
  items: string[];
}

export const VerificationChecklist: React.FC<VerificationChecklistProps> = ({ items }) => {
  const [checkedState, setCheckedState] = useState<{ [index: number]: boolean }>({});

  const toggleItem = (idx: number) => {
    setCheckedState((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  const completedCount = Object.values(checkedState).filter(Boolean).length;
  const totalCount = items.length;
  const progressPct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="card-white p-6 border border-[#E6ECF3] rounded-2xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#00A896]/10 flex items-center justify-center text-[#00A896]">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-base font-bold text-[#0B1F3A]">
              Before You Respond: Safe Verification Checklist
            </h4>
            <p className="text-xs text-[#5B6678]">
              Verify these 5 steps independently before replying or transmitting any data.
            </p>
          </div>
        </div>

        {/* Progress indicator */}
        <div className="flex items-center gap-2 self-start sm:self-auto bg-[#F6F8FB] px-3 py-1.5 rounded-lg border border-[#E6ECF3]">
          <span className="text-xs font-semibold text-[#0B1F3A]">
            {completedCount} of {totalCount} verified
          </span>
          <div className="w-16 h-2 bg-[#E6ECF3] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#00A896] transition-all duration-300"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
      </div>

      <div className="space-y-2.5">
        {items.map((item, idx) => {
          const isChecked = !!checkedState[idx];
          return (
            <label
              key={idx}
              onClick={() => toggleItem(idx)}
              className={`flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer select-none ${
                isChecked
                  ? 'bg-[#F0FDF4] border-[#BBF7D0] text-[#0B1F3A]'
                  : 'bg-[#F6F8FB]/60 border-[#E6ECF3] text-[#5B6678] hover:bg-[#F6F8FB]'
              }`}
            >
              <button
                type="button"
                className="mt-0.5 text-[#00A896] focus:outline-none"
                aria-label={`Toggle check for: ${item}`}
              >
                {isChecked ? (
                  <CheckSquare className="w-4 h-4 text-[#00A896]" />
                ) : (
                  <Square className="w-4 h-4 text-[#8A94A6]" />
                )}
              </button>
              <span
                className={`text-sm leading-relaxed ${
                  isChecked ? 'line-through text-[#8A94A6]' : 'text-[#0B1F3A] font-medium'
                }`}
              >
                {item}
              </span>
            </label>
          );
        })}
      </div>
    </div>
  );
};
