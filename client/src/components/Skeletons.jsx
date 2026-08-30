import React from 'react';

export const ProductCardSkeleton = () => {
  return (
    <div className="glass-card rounded-2xl border border-slate-800 p-4 space-y-4 animate-pulse">
      <div className="w-full aspect-[4/3] rounded-xl bg-slate-800/80"></div>
      <div className="space-y-2">
        <div className="h-3 w-1/3 bg-slate-800/80 rounded"></div>
        <div className="h-4 w-5/6 bg-slate-800/80 rounded"></div>
        <div className="h-3 w-1/2 bg-slate-800/80 rounded"></div>
      </div>
      <div className="pt-2 flex justify-between items-center border-t border-slate-800/60">
        <div className="h-5 w-1/3 bg-slate-800/80 rounded"></div>
        <div className="h-8 w-24 bg-slate-800/80 rounded-xl"></div>
      </div>
    </div>
  );
};

export const ProductDetailsSkeleton = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-10 animate-pulse">
      <div className="h-4 w-48 bg-slate-800/80 rounded"></div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="aspect-square rounded-3xl bg-slate-800/80"></div>
        <div className="space-y-6">
          <div className="h-4 w-24 bg-slate-800/80 rounded"></div>
          <div className="h-8 w-3/4 bg-slate-800/80 rounded"></div>
          <div className="h-4 w-1/3 bg-slate-800/80 rounded"></div>
          <div className="h-8 w-1/2 bg-slate-800/80 rounded"></div>
          <div className="h-20 w-full bg-slate-800/80 rounded-2xl"></div>
          <div className="flex gap-4">
            <div className="h-12 flex-1 bg-slate-800/80 rounded-2xl"></div>
            <div className="h-12 flex-1 bg-slate-800/80 rounded-2xl"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const ReviewSkeleton = () => {
  return (
    <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3 animate-pulse">
      <div className="flex justify-between items-center">
        <div className="h-4 w-32 bg-slate-800/80 rounded"></div>
        <div className="h-4 w-16 bg-slate-800/80 rounded"></div>
      </div>
      <div className="h-3 w-3/4 bg-slate-800/80 rounded"></div>
      <div className="h-3 w-full bg-slate-800/80 rounded"></div>
    </div>
  );
};
