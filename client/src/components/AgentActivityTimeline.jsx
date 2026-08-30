import React, { useState } from 'react';
import { Bot, ChevronDown, ChevronUp, CheckCircle2 } from 'lucide-react';

export const AgentActivityTimeline = ({ activity = [] }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!activity || activity.length === 0) return null;

  return (
    <div className="rounded-lg bg-gray-50 border border-gray-200/80 p-2 text-xs">
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between text-gray-500 hover:text-gray-800 transition-colors text-[11px] font-semibold cursor-pointer"
      >
        <div className="flex items-center gap-1.5">
          <Bot className="w-3.5 h-3.5 text-[#2874F0]" />
          <span>Agent activity · {activity.length} step{activity.length > 1 ? 's' : ''}</span>
        </div>
        {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
      </button>

      {isExpanded && (
        <div className="space-y-1 pt-2 mt-1.5 border-t border-gray-200 text-[11px]">
          {activity.map((act, idx) => (
            <div key={idx} className="flex items-center gap-2 text-gray-700">
              <CheckCircle2 className="w-3 h-3 text-[#00875A] flex-shrink-0" />
              <span className="font-medium">{act.message}</span>
              {act.tool && (
                <span className="px-1.5 py-0.5 bg-gray-200/70 border border-gray-300 text-gray-800 font-mono text-[9px] rounded">
                  {act.tool}
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AgentActivityTimeline;
