import React from 'react';
import { CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';

export const InventoryStatusBadge = ({ stock }) => {
  const stockNum = Number(stock) || 0;

  if (stockNum === 0) {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">
        <XCircle className="w-3 h-3" />
        OUT OF STOCK
      </span>
    );
  }

  if (stockNum <= 5) {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/10 text-amber-300 border border-amber-500/20">
        <AlertTriangle className="w-3 h-3" />
        LOW STOCK ({stockNum})
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
      <CheckCircle2 className="w-3 h-3" />
      IN STOCK ({stockNum})
    </span>
  );
};

export default InventoryStatusBadge;
