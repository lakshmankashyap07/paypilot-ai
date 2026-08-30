import React from 'react';
import { AlertTriangle, TrendingUp, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';

export const GrowthInsightCard = ({ opportunity, onCreateDraft }) => {
  if (!opportunity) return null;

  const { title, priority, metric, evidence, recommendation, campaignType } = opportunity;

  const priorityColors = {
    HIGH: 'border-rose-500/40 bg-rose-950/20 text-rose-300',
    MEDIUM: 'border-amber-500/40 bg-amber-950/20 text-amber-300',
    LOW: 'border-teal-500/40 bg-teal-950/20 text-teal-300'
  };

  const priorityBadges = {
    HIGH: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
    MEDIUM: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    LOW: 'bg-teal-500/20 text-teal-300 border-teal-500/30'
  };

  return (
    <div className={`glass-panel p-5 rounded-2xl border ${priorityColors[priority] || priorityColors.MEDIUM} space-y-3 shadow-xl`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-teal-400" />
          <h4 className="font-extrabold text-white text-xs sm:text-sm">{title}</h4>
        </div>
        <span className={`px-2.5 py-0.5 text-[9px] font-black rounded border ${priorityBadges[priority] || priorityBadges.MEDIUM} uppercase tracking-wider`}>
          {priority} PRIORITY
        </span>
      </div>

      <div className="text-xl font-black text-white">{metric}</div>

      {/* Evidence Points */}
      {evidence && evidence.length > 0 && (
        <div className="space-y-1 text-[11px] p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-slate-300">
          <span className="font-bold text-slate-400 uppercase text-[9px] tracking-wider block mb-1">
            Data Evidence
          </span>
          {evidence.map((point, idx) => (
            <div key={idx} className="flex items-center gap-1.5 text-slate-300">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-400"></span>
              <span>{point}</span>
            </div>
          ))}
        </div>
      )}

      {/* Recommendation & CTA */}
      <div className="space-y-2 pt-1">
        <p className="text-xs text-slate-300 leading-relaxed">
          <strong className="text-white">Recommendation:</strong> {recommendation}
        </p>

        {onCreateDraft && (
          <button
            onClick={() => onCreateDraft(campaignType || 'CART_RECOVERY')}
            className="w-full py-2 bg-gradient-to-r from-teal-500 to-indigo-600 hover:from-teal-400 hover:to-indigo-500 text-white font-extrabold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md transition-all"
          >
            <span>Create Campaign Draft</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};

export default GrowthInsightCard;
