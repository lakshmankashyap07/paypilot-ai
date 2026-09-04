import React, { useState } from 'react';
import { Wallet, DollarSign, Zap, RotateCcw, Plus, ArrowUpRight, ArrowDownLeft, ShieldCheck, CheckCircle2, X } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const PayPilotWalletSection = ({ stats }) => {
  const { showToast } = useToast();

  const [walletBalance, setWalletBalance] = useState(1500);
  const [cashbackBalance, setCashbackBalance] = useState(350);
  const [refundBalance, setRefundBalance] = useState(0);

  const [isAddMoneyOpen, setIsAddMoneyOpen] = useState(false);
  const [addAmount, setAddAmount] = useState('500');
  const [isProcessing, setIsProcessing] = useState(false);

  // Transactions log
  const [transactions, setTransactions] = useState([
    {
      id: 'tx_101',
      type: 'CASHBACK',
      title: 'Instant UPI Checkout Cashback',
      amount: '+ ₹150',
      date: 'Aug 28, 2026',
      status: 'CREDITED'
    },
    {
      id: 'tx_102',
      type: 'TOPUP',
      title: 'Wallet Top-up via RazorPay UPI',
      amount: '+ ₹1,000',
      date: 'Aug 20, 2026',
      status: 'SUCCESS'
    },
    {
      id: 'tx_103',
      type: 'PAYMENT',
      title: 'Paid for Order #ORD-8492',
      amount: '- ₹850',
      date: 'Aug 14, 2026',
      status: 'DEBITED'
    }
  ]);

  const handleAddMoneySubmit = (e) => {
    e.preventDefault();
    const val = Number(addAmount);
    if (!val || val < 100) {
      showToast('Minimum top-up amount is ₹100', 'error');
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      setWalletBalance((prev) => prev + val);
      setTransactions((prev) => [
        {
          id: `tx_${Date.now()}`,
          type: 'TOPUP',
          title: 'Wallet Top-up via PayPilot UPI',
          amount: `+ ₹${val.toLocaleString('en-IN')}`,
          date: 'Just now',
          status: 'SUCCESS'
        },
        ...prev
      ]);
      setIsProcessing(false);
      setIsAddMoneyOpen(false);
      showToast(`Added ₹${val.toLocaleString('en-IN')} to PayPilot Wallet!`, 'success');
    }, 1200);
  };

  const points = stats?.points || 2450;
  const pointsRupees = Math.round(points / 10);

  return (
    <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-xs space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-gray-100">
        <div>
          <h2 className="text-sm font-black text-gray-900 uppercase tracking-wider flex items-center gap-2">
            <Wallet className="w-4 h-4 text-[#2874F0]" />
            <span>PayPilot Wallet & Digital Balances</span>
          </h2>
          <p className="text-xs text-gray-500">1-click instant checkout with cashback rewards</p>
        </div>

        <button
          type="button"
          onClick={() => setIsAddMoneyOpen(true)}
          className="px-4 py-2 bg-[#2874F0] hover:bg-blue-700 text-white font-extrabold rounded-xl text-xs flex items-center gap-1.5 shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Money</span>
        </button>
      </div>

      {/* Wallet Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
        
        {/* Main Wallet Balance */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-900 to-blue-900 text-white shadow-md space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between text-blue-200">
            <span className="text-[10px] font-black uppercase tracking-wider">PayPilot Balance</span>
            <Wallet className="w-5 h-5 text-blue-300" />
          </div>
          <div className="text-2xl font-black text-white">₹{walletBalance.toLocaleString('en-IN')}</div>
          <div className="text-[11px] text-blue-200 flex items-center gap-1 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Ready for instant payment</span>
          </div>
        </div>

        {/* Cashback Balance */}
        <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 space-y-2">
          <div className="flex items-center justify-between text-emerald-800">
            <span className="text-[10px] font-black uppercase tracking-wider">Cashback Balance</span>
            <DollarSign className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="text-xl font-black text-emerald-950">₹{cashbackBalance.toLocaleString('en-IN')}</div>
          <div className="text-[11px] text-emerald-700 font-medium">Auto-applies at checkout</div>
        </div>

        {/* PayPilot Points */}
        <div className="p-4 rounded-2xl bg-purple-50/80 border border-purple-200 space-y-2">
          <div className="flex items-center justify-between text-purple-800">
            <span className="text-[10px] font-black uppercase tracking-wider">PayPilot Points</span>
            <Zap className="w-5 h-5 text-purple-600" />
          </div>
          <div className="text-xl font-black text-purple-950">⚡ {points.toLocaleString('en-IN')}</div>
          <div className="text-[11px] text-purple-700 font-medium">Redeemable as ₹{pointsRupees} discount</div>
        </div>

        {/* Refund Balance */}
        <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 space-y-2">
          <div className="flex items-center justify-between text-amber-800">
            <span className="text-[10px] font-black uppercase tracking-wider">Refund Balance</span>
            <RotateCcw className="w-5 h-5 text-amber-600" />
          </div>
          <div className="text-xl font-black text-amber-950">₹{refundBalance.toLocaleString('en-IN')}</div>
          <div className="text-[11px] text-amber-700 font-medium">Instant refund processing</div>
        </div>

      </div>

      {/* Transaction History Log */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-extrabold text-gray-900 uppercase tracking-wider">Recent Wallet Transactions</span>
          <span className="text-[10px] font-bold text-gray-500">Showing last 3 transactions</span>
        </div>

        <div className="divide-y divide-gray-100 border border-gray-200 rounded-2xl bg-gray-50/40">
          {transactions.map((tx) => (
            <div key={tx.id} className="p-3.5 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold ${
                  tx.amount.startsWith('+') ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                }`}>
                  {tx.amount.startsWith('+') ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                </div>
                <div>
                  <div className="font-bold text-gray-900">{tx.title}</div>
                  <div className="text-[11px] text-gray-400 font-medium">{tx.date}</div>
                </div>
              </div>

              <div className="text-right">
                <div className={`font-black ${tx.amount.startsWith('+') ? 'text-emerald-700' : 'text-gray-900'}`}>
                  {tx.amount}
                </div>
                <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-gray-200 text-gray-700 uppercase">
                  {tx.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Money Modal */}
      {isAddMoneyOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-xl border border-gray-200">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <h3 className="font-black text-sm text-gray-900 flex items-center gap-1.5">
                <Wallet className="w-4 h-4 text-[#2874F0]" />
                <span>Top-up PayPilot Wallet</span>
              </h3>
              <button
                onClick={() => setIsAddMoneyOpen(false)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddMoneySubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Enter Amount (₹)</label>
                <input
                  type="number"
                  min="100"
                  max="50000"
                  value={addAmount}
                  onChange={(e) => setAddAmount(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2 text-sm font-black text-gray-900 focus:outline-none focus:border-[#2874F0]"
                  placeholder="e.g. 500"
                />
              </div>

              <div className="flex items-center gap-2">
                {['500', '1000', '2000'].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setAddAmount(amt)}
                    className="flex-1 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold rounded-lg text-xs"
                  >
                    + ₹{amt}
                  </button>
                ))}
              </div>

              <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl text-[11px] text-blue-900 space-y-0.5">
                <div className="font-extrabold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#2874F0]" />
                  <span>Instant RazorPay Tokenization</span>
                </div>
                <p className="opacity-90">Wallet credits are immediately available for checkout.</p>
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className="w-full py-2.5 bg-[#2874F0] hover:bg-blue-700 text-white font-extrabold rounded-xl text-xs shadow-md disabled:opacity-50 cursor-pointer"
              >
                {isProcessing ? 'Processing Top-up...' : `Proceed to Add ₹${Number(addAmount || 0).toLocaleString('en-IN')}`}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default PayPilotWalletSection;
