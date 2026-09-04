import React, { useState, useEffect } from 'react';
import { ShieldAlert, ShieldCheck, Shield, AlertTriangle } from 'lucide-react';
import agenticCommerceService from '../services/agenticCommerceService';

export const RiskSignalsBadge = ({ orderId }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRisk = async () => {
      try {
        setLoading(true);
        const res = await agenticCommerceService.getOrderRisk(orderId);
        setData(res);
      } catch (err) {
        console.warn('Risk evaluation error:', err.message);
      } finally {
        setLoading(false);
      }
    };

    if (orderId) fetchRisk();
  }, [orderId]);

  if (loading || !data) return null;

  const { riskScore, riskLevel, riskColor, riskFactors } = data;

  return (
    <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl space-y-2 text-xs text-[#172337]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 font-bold text-gray-700 text-xs">
          <Shield className="w-3.5 h-3.5 text-gray-500" />
          <span>AI Risk Signal Analysis</span>
        </div>

        <span
          className={`px-2 py-0.5 text-[10px] font-black rounded-md shadow-2xs ${
            riskLevel === 'High Risk'
              ? 'bg-rose-100 text-rose-900 border border-rose-300'
              : riskLevel === 'Medium Risk'
              ? 'bg-amber-100 text-amber-900 border border-amber-300'
              : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
          }`}
        >
          {riskLevel} (Score: {riskScore}/100)
        </span>
      </div>

      <ul className="space-y-0.5 text-[10px] text-gray-600 font-medium">
        {riskFactors.map((f, idx) => (
          <li key={idx} className="flex items-center gap-1">
            <span className="text-gray-400">•</span>
            <span>{f}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RiskSignalsBadge;
