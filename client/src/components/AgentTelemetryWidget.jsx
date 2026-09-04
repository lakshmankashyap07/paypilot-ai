import React, { useState } from 'react';
import { Bot, ChevronDown, ChevronUp, CheckCircle2, Loader2, AlertCircle, ShieldCheck } from 'lucide-react';

export const AgentTelemetryWidget = ({ activityLogs = [] }) => {
  const [collapsed, setCollapsed] = useState(true);

  if (!activityLogs || activityLogs.length === 0) return null;

  return (
    <div className="bg-[#0b101d] text-slate-200 border border-slate-800 rounded-xl overflow-hidden text-xs shadow-md">
      
      {/* Header Toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="w-full p-3 bg-slate-900/90 hover:bg-slate-900 flex items-center justify-between transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-teal-500/10 text-teal-400 border border-teal-500/20 flex items-center justify-center font-bold">
            <Bot className="w-3.5 h-3.5 text-teal-400" />
          </div>
          <span className="font-extrabold text-white text-xs">
            Multi-Agent Telemetry & Execution Log
          </span>
          <span className="px-2 py-0.5 text-[9px] font-black bg-teal-500/20 text-teal-300 rounded border border-teal-500/30">
            {activityLogs.length} Steps Executed
          </span>
        </div>

        <div className="flex items-center gap-1 text-slate-400 text-[11px] font-bold">
          <span>{collapsed ? 'View Steps' : 'Hide'}</span>
          {collapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
        </div>
      </button>

      {/* Expanded Logs Body */}
      {!collapsed && (
        <div className="p-4 bg-[#080c16] space-y-2 border-t border-slate-800 font-mono text-[11px] max-h-60 overflow-y-auto">
          {activityLogs.map((log, idx) => (
            <div key={idx} className="flex items-start gap-2.5 leading-snug">
              {log.type === 'tool' ? (
                <Loader2 className="w-3.5 h-3.5 text-amber-400 animate-spin flex-shrink-0 mt-0.5" />
              ) : log.type === 'result' ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-400 flex-shrink-0 mt-0.5" />
              ) : log.type === 'error' ? (
                <AlertCircle className="w-3.5 h-3.5 text-rose-400 flex-shrink-0 mt-0.5" />
              ) : (
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0 mt-0.5" />
              )}
              <div className="flex-grow">
                <span className="text-teal-400 font-bold">[{log.tool || log.type || 'Agent'}]</span>{' '}
                <span className="text-slate-300">{log.message || log.text}</span>
              </div>
              <span className="text-[10px] text-slate-500 flex-shrink-0">
                {new Date(log.timestamp || Date.now()).toLocaleTimeString()}
              </span>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default AgentTelemetryWidget;
