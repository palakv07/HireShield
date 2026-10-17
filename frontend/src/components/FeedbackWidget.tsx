import React, { useState } from 'react';
import { ThumbsUp, ThumbsDown, Check, Send } from 'lucide-react';

interface FeedbackWidgetProps {
  analysisId?: string;
}

export const FeedbackWidget: React.FC<FeedbackWidgetProps> = ({ analysisId }) => {
  const [selectedVote, setSelectedVote] = useState<boolean | null>(null);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (vote: boolean) => {
    setSelectedVote(vote);
    setSubmitting(true);
    try {
      await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          analysis_id: analysisId,
          helpful: vote,
          comment: comment.trim() || undefined,
        }),
      });
      setSubmitted(true);
    } catch {
      // Graceful fallback for offline demo
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
<<<<<<< HEAD
      <div className="flex items-center gap-2 text-xs font-semibold text-[#1268E8] bg-[#1268E8]/10 px-3 py-2 rounded-lg border border-[#1268E8]/20">
=======
      <div className="flex items-center gap-2 text-xs font-semibold text-[#00A896] bg-[#00A896]/10 px-3 py-2 rounded-lg border border-[#00A896]/20">
>>>>>>> 7c1efe61800a232852d74638a245ab69db8ed95b
        <Check className="w-4 h-4" />
        <span>Thank you for your feedback! It helps improve detection accuracy.</span>
      </div>
    );
  }

  return (
    <div className="card-soft p-4 border border-[#E6ECF3] rounded-xl space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <span className="text-xs font-semibold text-[#0B1F3A]">
          Was this risk assessment helpful?
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleSubmit(true)}
            disabled={submitting}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${
              selectedVote === true
<<<<<<< HEAD
                ? 'bg-[#1268E8]/10 border-[#1268E8] text-[#1268E8]'
                : 'bg-white border-[#E6ECF3] text-[#5B6678] hover:border-[#1268E8] hover:text-[#1268E8]'
=======
                ? 'bg-[#2FB171]/10 border-[#2FB171] text-[#2FB171]'
                : 'bg-white border-[#E6ECF3] text-[#5B6678] hover:border-[#2FB171] hover:text-[#2FB171]'
>>>>>>> 7c1efe61800a232852d74638a245ab69db8ed95b
            }`}
          >
            <ThumbsUp className="w-3.5 h-3.5" />
            <span>Helpful</span>
          </button>
          <button
            onClick={() => handleSubmit(false)}
            disabled={submitting}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${
              selectedVote === false
                ? 'bg-[#E5484D]/10 border-[#E5484D] text-[#E5484D]'
                : 'bg-white border-[#E6ECF3] text-[#5B6678] hover:border-[#E5484D] hover:text-[#E5484D]'
            }`}
          >
            <ThumbsDown className="w-3.5 h-3.5" />
            <span>Incorrect</span>
          </button>
        </div>
      </div>

      {selectedVote !== null && !submitted && (
        <div className="flex items-center gap-2 pt-1">
          <input
            type="text"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Optional comment: what could be improved?"
<<<<<<< HEAD
            className="flex-1 px-3 py-1.5 text-xs bg-white border border-[#E6ECF3] rounded-lg text-[#0B1F3A] focus:outline-none focus:border-[#1268E8]"
=======
            className="flex-1 px-3 py-1.5 text-xs bg-white border border-[#E6ECF3] rounded-lg text-[#0B1F3A] focus:outline-none focus:border-[#00A896]"
>>>>>>> 7c1efe61800a232852d74638a245ab69db8ed95b
          />
          <button
            onClick={() => handleSubmit(selectedVote)}
            disabled={submitting}
<<<<<<< HEAD
            className="px-3 py-1.5 bg-[#1268E8] hover:bg-[#0B4DB3] text-white text-xs font-semibold rounded-lg flex items-center gap-1"
=======
            className="px-3 py-1.5 bg-[#00A896] hover:bg-[#007F73] text-white text-xs font-semibold rounded-lg flex items-center gap-1"
>>>>>>> 7c1efe61800a232852d74638a245ab69db8ed95b
          >
            <Send className="w-3 h-3" />
            <span>Submit</span>
          </button>
        </div>
      )}
    </div>
  );
};
