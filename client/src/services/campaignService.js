import api from './api';

export const campaignService = {
  async getCampaigns(params = {}) {
    const response = await api.get('/merchant/campaigns', { params });
    return response;
  },

  async getCampaign(id) {
    const response = await api.get(`/merchant/campaigns/${id}`);
    return response;
  },

  async createCampaign(data) {
    const response = await api.post('/merchant/campaigns', data);
    return response;
  },

  async updateCampaign(id, data) {
    const response = await api.put(`/merchant/campaigns/${id}`, data);
    return response;
  },

  async activateCampaign(id) {
    const response = await api.patch(`/merchant/campaigns/${id}/activate`);
    return response;
  },

  async pauseCampaign(id) {
    const response = await api.patch(`/merchant/campaigns/${id}/pause`);
    return response;
  },

  async deleteCampaign(id) {
    const response = await api.delete(`/merchant/campaigns/${id}`);
    return response;
  }
};

export default campaignService;
