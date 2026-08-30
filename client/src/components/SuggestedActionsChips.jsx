import React from 'react';
import { ArrowRight } from 'lucide-react';

export const SuggestedActionsChips = ({ onSelectAction }) => {
  const actions = [
    "Compare products",
    "Find cheaper",
    "Best rated",
    "Add to cart",
    "What's in my cart?",
    "Checkout"
  ];

  return (
    <div className="pt-2 flex flex-wrap items-center gap-2">
      {actions.map((act, idx) => (
        <button
          key={idx}
          type="button"
          onClick={() => onSelectAction && onSelectAction(act)}
          className="px-3 py-1 bg-blue-50 hover:bg-blue-100 border border-blue-200 text-[#2874F0] font-bold rounded-full text-xs transition-all inline-flex items-center gap-1 cursor-pointer shadow-xs"
        >
          <span>{act}</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      ))}
    </div>
  );
};

export default SuggestedActionsChips;
