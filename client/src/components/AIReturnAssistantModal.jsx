import React, { useState } from 'react';
import { X, RotateCcw, AlertTriangle, CheckCircle2, ShieldCheck, Loader2, Send } from 'lucide-react';
import agenticCommerceService from '../services/agenticCommerceService';
import { useToast } from '../context/ToastContext';

export const AIReturnAssistantModal = ({ orderId, productId, onClose }) => {
  const { showToast } = useToast();
  const [requestType, setRequestType] = useState('RETURN'); // 'RETURN' | 'REPLACEMENT'
  const [selectedIssue, setSelectedIssue] = useState('');
  const [reasonDetails, setReasonDetails] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  const ISSUE_CATEGORIES = [
    { id: 'damaged', label: 'Item Damaged / Broken', desc: 'Package arrived with physical damage' },
    { id: 'defective', label: 'Item Defective / Not Working', desc: 'Item powers on but has functional defect' },
    { id: 'wrong_product', label: 'Wrong Product Sent', desc: 'Received a different product or color' },
    { id: 'missing_item', label: 'Missing Item / Parts', desc: 'Box missing accessories or parts' },
    { id: 'size_issue', label: 'Size / Fit Issue', desc: 'Does not fit as expected' },
    { id: 'other', label: 'Other Reason', desc: 'Changed mind or specific feedback' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedIssue) {
      showToast('Please select what went wrong with your product', 'error');
      return;
    }

    try {
      setSubmitting(true);
      const res = await agenticCommerceService.submitReturnRequest(orderId, productId, selectedIssue, reasonDetails, requestType);
      setResult(res);
      showToast(`${requestType === 'REPLACEMENT' ? 'Replacement' : 'Return'} request submitted successfully!`, 'success');
    } catch (err) {
      showToast(err.message || 'Submission failed', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-2xl border border-[#E0E6ED] p-6 space-y-5 shadow-2xl relative max-h-[90vh] overflow-y-auto text-xs text-[#172337]">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-100 text-[#D32F2F] flex items-center justify-center font-bold">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-[#172337]">AI Return & Replacement Assistant</h3>
              <p className="text-xs text-[#5F6B76]">Intelligent policy evaluation & ticket generation</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg bg-gray-100 text-gray-500 hover:text-gray-900 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        {result ? (
          /* Result Screen */
          <div className="space-y-4 text-center py-4">
            <div className="w-14 h-14 rounded-full bg-emerald-50 text-[#388E3C] border border-emerald-200 flex items-center justify-center mx-auto shadow-xs">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h4 className="text-lg font-black text-gray-900">{result.message}</h4>
              <p className="text-xs text-gray-500 font-medium">Ticket ID: <strong className="text-gray-800">{result.ticketId}</strong></p>
            </div>

            <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl text-left space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-500 font-bold">Order Number:</span>
                <span className="font-extrabold text-gray-900">#{result.orderNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 font-bold">Request Type:</span>
                <span className="font-extrabold text-purple-700">{requestType === 'REPLACEMENT' ? 'Replacement' : 'Return & Refund'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 font-bold">Product:</span>
                <span className="font-bold text-gray-800">{result.productName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 font-bold">7-Day Policy Status:</span>
                <span className="font-extrabold text-[#388E3C]">
                  Authorized ({requestType === 'REPLACEMENT' ? 'REPLACEMENT_REQUESTED' : 'RETURN_REQUESTED'})
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full py-2.5 bg-[#2874F0] hover:bg-blue-700 text-white font-extrabold rounded-xl text-xs transition-all shadow-xs cursor-pointer"
            >
              Done
            </button>
          </div>
        ) : (
          /* Issue Selection Form */
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Request Type Selector */}
            <div className="space-y-1.5">
              <label className="block font-black text-gray-900 text-xs uppercase tracking-wider">Select Request Type</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRequestType('RETURN')}
                  className={`p-3 rounded-xl border text-center font-extrabold transition-all cursor-pointer ${
                    requestType === 'RETURN'
                      ? 'bg-rose-50 border-[#D32F2F] text-[#D32F2F] shadow-2xs'
                      : 'bg-gray-50 border-gray-200 text-gray-600'
                  }`}
                >
                  ↩️ Return for Refund
                </button>
                <button
                  type="button"
                  onClick={() => setRequestType('REPLACEMENT')}
                  className={`p-3 rounded-xl border text-center font-extrabold transition-all cursor-pointer ${
                    requestType === 'REPLACEMENT'
                      ? 'bg-purple-50 border-purple-600 text-purple-700 shadow-2xs'
                      : 'bg-gray-50 border-gray-200 text-gray-600'
                  }`}
                >
                  🔄 Request Replacement
                </button>
              </div>
            </div>

            <div className="font-extrabold text-gray-900 text-xs pt-1">What went wrong with your product?</div>

            <div className="space-y-2">
              {ISSUE_CATEGORIES.map((cat) => (
                <label
                  key={cat.id}
                  className={`p-3 rounded-xl border flex items-start gap-3 cursor-pointer transition-all ${
                    selectedIssue === cat.id
                      ? 'bg-blue-50/80 border-[#2874F0] text-gray-900 shadow-2xs'
                      : 'bg-gray-50 border-gray-200 text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="issueCategory"
                    value={cat.id}
                    checked={selectedIssue === cat.id}
                    onChange={(e) => setSelectedIssue(e.target.value)}
                    className="mt-0.5 text-[#2874F0] focus:ring-0 cursor-pointer"
                  />
                  <div>
                    <div className="font-bold text-xs">{cat.label}</div>
                    <div className="text-[11px] text-gray-500">{cat.desc}</div>
                  </div>
                </label>
              ))}
            </div>

            <div>
              <label className="block font-bold text-gray-700 text-xs mb-1">Additional Details (Optional)</label>
              <textarea
                rows={2}
                value={reasonDetails}
                onChange={(e) => setReasonDetails(e.target.value)}
                placeholder="Describe any specific damage or details..."
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-xs text-gray-900 focus:outline-none focus:border-[#2874F0]"
              />
            </div>

            <button
              type="submit"
              disabled={submitting || !selectedIssue}
              className="w-full py-3 bg-[#2874F0] hover:bg-blue-700 text-white font-extrabold rounded-xl text-xs transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {submitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <span>Submit Return Request</span>
              )}
            </button>
          </form>
        )}

      </div>
    </div>
  );
};

export default AIReturnAssistantModal;
