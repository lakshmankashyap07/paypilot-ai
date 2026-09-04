import React, { useState } from 'react';
import { Bell, Plus, Trash2, CheckCircle2, TrendingDown, Smartphone, Laptop } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const PriceDropAlertsSection = () => {
  const { showToast } = useToast();

  const [alerts, setAlerts] = useState([
    {
      id: 'alert_1',
      productName: 'MacBook Air M2 (13.6-inch, 256GB SSD)',
      currentPrice: 94900,
      targetPrice: 89990,
      status: 'ACTIVE'
    },
    {
      id: 'alert_2',
      productName: 'Sony WH-1000XM5 Wireless Headphones',
      currentPrice: 24990,
      targetPrice: 22000,
      status: 'TRIGGERED'
    }
  ]);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newProdName, setNewProdName] = useState('');
  const [newCurrentPrice, setNewCurrentPrice] = useState('');
  const [newTargetPrice, setNewTargetPrice] = useState('');

  const handleRemove = (id) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
    showToast('Price alert removed', 'info');
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!newProdName.trim() || !newTargetPrice) {
      showToast('Product name and target price are required', 'error');
      return;
    }

    const cur = Number(newCurrentPrice) || 49999;
    const tgt = Number(newTargetPrice);

    setAlerts((prev) => [
      ...prev,
      {
        id: `alert_${Date.now()}`,
        productName: newProdName.trim(),
        currentPrice: cur,
        targetPrice: tgt,
        status: cur <= tgt ? 'TRIGGERED' : 'ACTIVE'
      }
    ]);

    setNewProdName('');
    setNewCurrentPrice('');
    setNewTargetPrice('');
    setIsAddModalOpen(false);
    showToast('Price drop alert created!', 'success');
  };

  return (
    <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-xs space-y-5 text-xs text-gray-900">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-gray-100">
        <div>
          <h2 className="text-sm font-black text-gray-900 uppercase tracking-wider flex items-center gap-2">
            <Bell className="w-4 h-4 text-[#2874F0]" />
            <span>Smart Price-Drop Alerts</span>
          </h2>
          <p className="text-xs text-gray-500">Get notified immediately when prices fall below your target</p>
        </div>

        <button
          type="button"
          onClick={() => setIsAddModalOpen(true)}
          className="px-3.5 py-1.5 bg-[#2874F0] hover:bg-blue-700 text-white font-extrabold rounded-xl text-xs flex items-center gap-1 shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Alert</span>
        </button>
      </div>

      {/* Alerts List */}
      <div className="space-y-3">
        {alerts.length === 0 ? (
          <div className="p-8 text-center text-gray-500 space-y-2 border border-gray-200 rounded-2xl">
            <Bell className="w-8 h-8 text-gray-400 mx-auto" />
            <p>No price drop alerts active.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100 border border-gray-200 rounded-2xl bg-gray-50/40">
            {alerts.map((item) => (
              <div key={item.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="font-extrabold text-gray-900 text-sm flex items-center gap-2">
                    <span>{item.productName}</span>
                    <span
                      className={`px-2 py-0.5 text-[9px] font-black rounded ${
                        item.status === 'TRIGGERED'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : 'bg-blue-100 text-[#2874F0] border border-blue-200'
                      }`}
                    >
                      {item.status === 'TRIGGERED' ? '🔔 PRICE DROPPED!' : 'ACTIVE MONITOR'}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 flex items-center gap-4">
                    <span>Current: <strong>₹{item.currentPrice?.toLocaleString('en-IN')}</strong></span>
                    <span>Target Alert: <strong className="text-emerald-700">Below ₹{item.targetPrice?.toLocaleString('en-IN')}</strong></span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => handleRemove(item.id)}
                    className="p-1.5 text-gray-400 hover:text-rose-600 cursor-pointer"
                    title="Delete Alert"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* New Alert Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-xl border border-gray-200 text-xs">
            <h3 className="font-black text-sm text-gray-900 flex items-center gap-1.5">
              <Bell className="w-4 h-4 text-[#2874F0]" />
              <span>Create Price Drop Alert</span>
            </h3>

            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Product Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sony WH-1000XM5 Headphones"
                  value={newProdName}
                  onChange={(e) => setNewProdName(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2 text-xs text-gray-900 focus:outline-none focus:border-[#2874F0]"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Current Price (₹)</label>
                <input
                  type="number"
                  placeholder="e.g. 24990"
                  value={newCurrentPrice}
                  onChange={(e) => setNewCurrentPrice(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2 text-xs text-gray-900 focus:outline-none focus:border-[#2874F0]"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Alert Target Price (₹)</label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 22000"
                  value={newTargetPrice}
                  onChange={(e) => setNewTargetPrice(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2 text-xs text-gray-900 focus:outline-none focus:border-[#2874F0]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-xl text-gray-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#2874F0] hover:bg-blue-700 text-white font-extrabold rounded-xl"
                >
                  Create Alert
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default PriceDropAlertsSection;
