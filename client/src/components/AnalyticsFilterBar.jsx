import React from 'react';
import { Calendar, Filter, RefreshCw, Download } from 'lucide-react';

export const AnalyticsFilterBar = ({
  range,
  setRange,
  source,
  setSource,
  onRefresh,
  onExportCSV,
  isLoading
}) => {
  return (
    <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-4 mb-6 text-xs">
      
      {/* Date Range Selector */}
      <div className="flex items-center gap-2">
        <Calendar className="w-4 h-4 text-teal-400" />
        <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">Timeframe:</span>
        <div className="flex items-center gap-1 bg-slate-900/80 p-1 rounded-xl border border-slate-800">
          {[
            { id: 'today', label: 'Today' },
            { id: '7d', label: 'Last 7 Days' },
            { id: '30d', label: 'Last 30 Days' },
            { id: '90d', label: 'Last 90 Days' }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setRange(item.id)}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                range === item.id
                  ? 'bg-teal-500 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Traffic Source & Actions */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={source}
            onChange={(e) => setSource(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-teal-500"
          >
            <option value="ALL">All Sources</option>
            <option value="WEB">Web Traditional</option>
            <option value="AI_AGENT">AI Commerce Agent</option>
          </select>
        </div>

        <button
          onClick={onRefresh}
          disabled={isLoading}
          className="p-2 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 rounded-xl hover:text-white transition-all disabled:opacity-50"
          title="Refresh Data"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-teal-400' : ''}`} />
        </button>

        <button
          onClick={() => onExportCSV('sales')}
          className="px-3.5 py-1.5 bg-gradient-to-r from-teal-500 to-indigo-600 hover:from-teal-400 hover:to-indigo-500 text-white font-bold rounded-xl flex items-center gap-1.5 shadow-md transition-all"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export CSV</span>
        </button>
      </div>

    </div>
  );
};

export default AnalyticsFilterBar;
