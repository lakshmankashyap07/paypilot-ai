import React from 'react';

export const DashboardStatCard = ({ title, value, subtitle, icon: Icon, color = 'blue' }) => {
  const colorStyles = {
    blue: 'bg-blue-50 text-[#2874F0] border-blue-200',
    indigo: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    amber: 'bg-amber-50 text-amber-800 border-amber-200',
    rose: 'bg-rose-50 text-rose-800 border-rose-200'
  };

  return (
    <div className="bg-white p-5 rounded-xl border border-gray-200 space-y-2 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">{title}</span>
        {Icon && (
          <div className={`p-2 rounded-lg border ${colorStyles[color] || colorStyles.blue}`}>
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>

      <div>
        <div className="text-2xl font-black text-gray-900">{value}</div>
        {subtitle && <p className="text-[11px] text-gray-500 font-medium mt-0.5">{subtitle}</p>}
      </div>
    </div>
  );
};

export default DashboardStatCard;
