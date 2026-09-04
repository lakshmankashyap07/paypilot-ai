import React, { useState } from 'react';
import { CreditCard, ShieldCheck, Plus, Trash2, CheckCircle2, Lock, Smartphone } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const PaymentMethodsSection = () => {
  const { showToast } = useToast();

  const [methods, setMethods] = useState([
    {
      id: 'pm_1',
      type: 'UPI',
      label: 'Google Pay / PhonePe UPI',
      detail: 'user@paypilot',
      isDefault: true
    },
    {
      id: 'pm_2',
      type: 'CARD',
      label: 'HDFC Bank Visa Credit Card',
      detail: '•••• •••T 4242 (Expires 08/29)',
      isDefault: false
    }
  ]);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newType, setNewType] = useState('UPI');
  const [newUpiId, setNewUpiId] = useState('');

  const handleRemove = (id) => {
    setMethods((prev) => prev.filter((m) => m.id !== id));
    showToast('Payment method removed successfully', 'info');
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (newType === 'UPI') {
      if (!newUpiId.trim() || !newUpiId.includes('@')) {
        showToast('Please enter a valid UPI ID (e.g. name@upi)', 'error');
        return;
      }
      setMethods((prev) => [
        ...prev,
        {
          id: `pm_${Date.now()}`,
          type: 'UPI',
          label: 'Saved VPA UPI',
          detail: newUpiId.trim(),
          isDefault: false
        }
      ]);
      setNewUpiId('');
      setIsAddModalOpen(false);
      showToast('UPI ID saved securely!', 'success');
    } else {
      showToast('Card tokenization is performed via RazorPay Secure Checkout at payment time.', 'info');
      setIsAddModalOpen(false);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-xs space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-gray-100">
        <div>
          <h2 className="text-sm font-black text-gray-900 uppercase tracking-wider flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-[#2874F0]" />
            <span>Saved Payment Methods</span>
          </h2>
          <p className="text-xs text-gray-500">Encrypted UPI handles & tokenized cards for 1-click checkout</p>
        </div>

        <button
          type="button"
          onClick={() => setIsAddModalOpen(true)}
          className="px-3.5 py-1.5 bg-[#2874F0] hover:bg-blue-700 text-white font-extrabold rounded-xl text-xs flex items-center gap-1 shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Method</span>
        </button>
      </div>

      {/* Methods List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        {methods.map((method) => (
          <div
            key={method.id}
            className={`p-4 rounded-2xl border flex items-start justify-between gap-3 ${
              method.isDefault ? 'bg-blue-50/50 border-blue-200' : 'bg-gray-50/50 border-gray-200'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-white border border-gray-200 flex items-center justify-center font-bold text-gray-800 flex-shrink-0">
                {method.type === 'UPI' ? <Smartphone className="w-5 h-5 text-indigo-600" /> : <CreditCard className="w-5 h-5 text-blue-600" />}
              </div>
              <div className="space-y-0.5">
                <div className="font-extrabold text-gray-900 flex items-center gap-1.5">
                  <span>{method.label}</span>
                  {method.isDefault && (
                    <span className="px-1.5 py-0.2 text-[9px] font-black bg-[#2874F0] text-white rounded">DEFAULT</span>
                  )}
                </div>
                <div className="text-xs font-medium text-gray-600">{method.detail}</div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleRemove(method.id)}
              className="text-gray-400 hover:text-rose-600 transition-colors p-1 cursor-pointer"
              title="Remove Payment Method"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Security Note */}
      <div className="p-3.5 bg-gray-50 border border-gray-200 rounded-2xl flex items-center gap-3 text-xs text-gray-600">
        <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0" />
        <div className="leading-snug">
          <strong className="text-gray-900">PCI-DSS 256-Bit Bank-grade Encryption:</strong> PayPilot AI never stores raw credit card CVVs or card PIN numbers. Payment tokens are securely managed via RazorPay.
        </div>
      </div>

      {/* Add Payment Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-xl border border-gray-200 text-xs">
            <h3 className="font-black text-sm text-gray-900 flex items-center gap-1.5">
              <CreditCard className="w-4 h-4 text-[#2874F0]" />
              <span>Add Saved Payment Method</span>
            </h3>

            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Select Type</label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setNewType('UPI')}
                    className={`flex-1 py-2 rounded-xl font-bold border ${
                      newType === 'UPI' ? 'bg-blue-50 border-[#2874F0] text-[#2874F0]' : 'bg-gray-50 border-gray-200 text-gray-700'
                    }`}
                  >
                    UPI VPA ID
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewType('CARD')}
                    className={`flex-1 py-2 rounded-xl font-bold border ${
                      newType === 'CARD' ? 'bg-blue-50 border-[#2874F0] text-[#2874F0]' : 'bg-gray-50 border-gray-200 text-gray-700'
                    }`}
                  >
                    Credit / Debit Card
                  </button>
                </div>
              </div>

              {newType === 'UPI' ? (
                <div>
                  <label className="block font-bold text-gray-700 mb-1">UPI VPA ID</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. mobile@upi or username@okaxis"
                    value={newUpiId}
                    onChange={(e) => setNewUpiId(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2 text-xs text-gray-900 focus:outline-none focus:border-[#2874F0]"
                  />
                </div>
              ) : (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 leading-snug">
                  Card details are safely saved directly during checkout via RazorPay's PCI-DSS compliant vault.
                </div>
              )}

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
                  Save Method
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default PaymentMethodsSection;
