import React, { useState, useEffect } from 'react';
import campaignService from '../services/campaignService';
import { useToast } from '../context/ToastContext';
import {
  Sparkles,
  Play,
  Pause,
  Trash2,
  CheckCircle2,
  Megaphone,
  TrendingUp,
  Target,
  Gift
} from 'lucide-react';

export const MerchantCampaignsPage = () => {
  const { showToast } = useToast();

  const [campaigns, setCampaigns] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeModalCampaign, setActiveModalCampaign] = useState(null);

  const fetchCampaigns = async () => {
    try {
      setIsLoading(true);
      const res = await campaignService.getCampaigns();
      if (res?.success && res.data?.campaigns) {
        setCampaigns(res.data.campaigns);
      }
    } catch (err) {
      showToast(err.message || 'Failed to load campaigns', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const handleActivateClick = (campaign) => {
    setActiveModalCampaign(campaign);
  };

  const confirmActivation = async () => {
    if (!activeModalCampaign) return;
    try {
      await campaignService.activateCampaign(activeModalCampaign._id);
      showToast(`Campaign "${activeModalCampaign.name}" is now ACTIVE!`, 'success');
      setActiveModalCampaign(null);
      fetchCampaigns();
    } catch (err) {
      showToast(err.message || 'Failed to activate campaign', 'error');
    }
  };

  const handlePause = async (id) => {
    try {
      await campaignService.pauseCampaign(id);
      showToast('Campaign paused', 'info');
      fetchCampaigns();
    } catch (err) {
      showToast(err.message || 'Failed to pause campaign', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this campaign?')) return;
    try {
      await campaignService.deleteCampaign(id);
      showToast('Campaign deleted', 'info');
      fetchCampaigns();
    } catch (err) {
      showToast(err.message || 'Failed to delete campaign', 'error');
    }
  };

  const statusBadges = {
    DRAFT: 'bg-gray-100 text-gray-700 border-gray-300',
    PENDING_APPROVAL: 'bg-amber-100 text-amber-900 border-amber-300',
    ACTIVE: 'bg-emerald-100 text-emerald-900 border-emerald-300',
    PAUSED: 'bg-indigo-100 text-indigo-900 border-indigo-300',
    COMPLETED: 'bg-blue-100 text-blue-900 border-blue-300'
  };

  const activeCount = campaigns.filter(c => c.status === 'ACTIVE').length;
  const draftCount = campaigns.filter(c => c.status === 'DRAFT').length;

  return (
    <div className="space-y-6 text-xs text-[#172337]">
      
      {/* Header */}
      <div className="bg-white p-6 rounded-xl border border-[#E0E6ED] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-[#172337]">AI Marketing Campaigns</h1>
            <span className="px-2.5 py-0.5 text-[9px] font-black bg-[#2874F0] text-white rounded uppercase">
              CAMPAIGN AUTOMATION
            </span>
          </div>
          <p className="text-xs text-[#5F6B76] mt-0.5">
            Create, track, and activate targeted customer recovery campaigns and promotional offers.
          </p>
        </div>
      </div>

      {/* Campaign Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-[#E0E6ED] shadow-xs space-y-1">
          <div className="flex items-center justify-between text-gray-500 text-xs">
            <span>Total Campaigns</span>
            <Megaphone className="w-4 h-4 text-[#2874F0]" />
          </div>
          <div className="text-2xl font-black text-gray-900">{campaigns.length}</div>
          <div className="text-[11px] text-gray-500 font-medium">All generated campaigns</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#E0E6ED] shadow-xs space-y-1">
          <div className="flex items-center justify-between text-gray-500 text-xs">
            <span>Active Campaigns</span>
            <Play className="w-4 h-4 text-[#00875A]" />
          </div>
          <div className="text-2xl font-black text-gray-900">{activeCount}</div>
          <div className="text-[11px] text-[#00875A] font-bold">Currently running offers</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#E0E6ED] shadow-xs space-y-1">
          <div className="flex items-center justify-between text-gray-500 text-xs">
            <span>Draft Campaigns</span>
            <Sparkles className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-gray-900">{draftCount}</div>
          <div className="text-[11px] text-amber-700 font-medium">Awaiting merchant activation</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#E0E6ED] shadow-xs space-y-1">
          <div className="flex items-center justify-between text-gray-500 text-xs">
            <span>Customer Reach</span>
            <Target className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-black text-gray-900">Cart Abandoners</div>
          <div className="text-[11px] text-gray-500 font-medium">Targeted customer segment</div>
        </div>
      </div>

      {/* Campaigns Table */}
      <div className="bg-white rounded-xl border border-[#E0E6ED] p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <h3 className="font-black text-gray-900 text-sm">Campaign Directory ({campaigns.length})</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-700">
            <thead className="bg-gray-50 text-gray-500 uppercase text-[10px] tracking-wider font-bold">
              <tr>
                <th className="p-3">Campaign Name</th>
                <th className="p-3">Type</th>
                <th className="p-3">Target Segment</th>
                <th className="p-3">Offer Discount</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td colSpan="6" className="p-6 text-center text-gray-400">
                    Loading campaigns...
                  </td>
                </tr>
              ) : campaigns.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-6 text-center text-gray-400">
                    No marketing campaigns created yet. Ask AI Growth Copilot to generate a campaign draft!
                  </td>
                </tr>
              ) : (
                campaigns.map((camp) => (
                  <tr key={camp._id} className="hover:bg-gray-50">
                    <td className="p-3 font-bold text-gray-900 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#2874F0] flex-shrink-0" />
                      <span>{camp.name}</span>
                    </td>
                    <td className="p-3 font-medium">{camp.type}</td>
                    <td className="p-3 text-gray-500">{camp.targetSegment}</td>
                    <td className="p-3 font-extrabold text-[#00875A]">{camp.discountValue}% OFF</td>
                    <td className="p-3">
                      <span className={`px-2.5 py-0.5 text-[9px] font-black rounded border ${statusBadges[camp.status] || statusBadges.DRAFT}`}>
                        {camp.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {camp.status !== 'ACTIVE' ? (
                          <button
                            onClick={() => handleActivateClick(camp)}
                            className="px-3 py-1 bg-[#00875A] hover:bg-emerald-700 text-white rounded-lg font-bold flex items-center gap-1 text-[11px] cursor-pointer shadow-xs"
                          >
                            <Play className="w-3 h-3" />
                            <span>Activate</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => handlePause(camp._id)}
                            className="px-3 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-lg font-bold flex items-center gap-1 text-[11px] cursor-pointer"
                          >
                            <Pause className="w-3 h-3" />
                            <span>Pause</span>
                          </button>
                        )}

                        <button
                          onClick={() => handleDelete(camp._id)}
                          className="p-1 text-gray-400 hover:text-[#D32F2F]"
                          title="Delete Campaign"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* EXPLICIT MERCHANT CONFIRMATION MODAL */}
      {activeModalCampaign && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl border border-[#E0E6ED] p-6 space-y-4 shadow-xl relative text-center text-xs text-[#172337]">
            <div className="w-14 h-14 rounded-full bg-emerald-50 text-[#00875A] border border-emerald-200 flex items-center justify-center mx-auto shadow-xs">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-xl font-black text-gray-900">Explicit Activation Required</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Confirm activation of campaign <strong className="text-gray-900">"{activeModalCampaign.name}"</strong> offering a <strong className="text-[#00875A] font-black">{activeModalCampaign.discountValue}% discount</strong> to segment <strong className="text-gray-900">{activeModalCampaign.targetSegment}</strong>?
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setActiveModalCampaign(null)}
                className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold rounded-lg text-xs"
              >
                Cancel
              </button>

              <button
                onClick={confirmActivation}
                className="flex-1 py-2.5 bg-[#00875A] hover:bg-emerald-700 text-white font-extrabold rounded-lg text-xs shadow-xs"
              >
                Yes, Activate Campaign
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default MerchantCampaignsPage;
