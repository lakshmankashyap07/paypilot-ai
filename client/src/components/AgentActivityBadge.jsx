import React from 'react';
import { Bot, Wrench, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

export const AgentActivityBadge = ({ activity = [] }) => {
  if (!activity || activity.length === 0) return null;

  return (
    <div className="space-y-1.5 py-1">
      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1">
        <Bot className="w-3 h-3 text-teal-400" />
        Agent Telemetry & Tool Execution Log
      </span>

      <div className="flex flex-wrap gap-2">
        {activity.map((act, idx) => {
          if (act.type === 'thinking') {
            return (
              <span
                key={idx}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-900 text-slate-400 border border-slate-800"
              >
                <Loader2 className="w-3 h-3 animate-spin text-teal-400" />
                <span>{act.message}</span>
              </span>
            );
          }

          if (act.type === 'tool') {
            return (
              <span
                key={idx}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20"
              >
                <Wrench className="w-3 h-3 text-indigo-400" />
                <span>Tool: {act.tool}</span>
              </span>
            );
          }

          if (act.type === 'result') {
            return (
              <span
                key={idx}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-500/20"
              >
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                <span>{act.message}</span>
              </span>
            );
          }

          if (act.type === 'error') {
            return (
              <span
                key={idx}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-300 border border-rose-500/20"
              >
                <AlertCircle className="w-3 h-3 text-rose-400" />
                <span>{act.message}</span>
              </span>
            );
          }

          return null;
        })}
      </div>
    </div>
  );
};

export default AgentActivityBadge;
