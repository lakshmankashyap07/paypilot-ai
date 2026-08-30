import campaignService from '../services/campaignService.js';

export const getCampaigns = async (req, res, next) => {
  try {
    const data = await campaignService.getCampaigns(req.user._id, req.query);
    res.status(200).json({ success: true, message: 'Campaigns fetched successfully', data });
  } catch (err) {
    next(err);
  }
};

export const getCampaignById = async (req, res, next) => {
  try {
    const campaign = await campaignService.getCampaignById(req.user._id, req.params.id);
    res.status(200).json({ success: true, data: { campaign } });
  } catch (err) {
    next(err);
  }
};

export const createCampaign = async (req, res, next) => {
  try {
    const campaign = await campaignService.createCampaign(req.user._id, req.body);
    res.status(201).json({ success: true, message: 'Campaign created successfully', data: { campaign } });
  } catch (err) {
    next(err);
  }
};

export const updateCampaign = async (req, res, next) => {
  try {
    const campaign = await campaignService.updateCampaign(req.user._id, req.params.id, req.body);
    res.status(200).json({ success: true, message: 'Campaign updated successfully', data: { campaign } });
  } catch (err) {
    next(err);
  }
};

export const activateCampaign = async (req, res, next) => {
  try {
    const campaign = await campaignService.activateCampaign(req.user._id, req.params.id);
    res.status(200).json({ success: true, message: 'Campaign activated successfully', data: { campaign } });
  } catch (err) {
    next(err);
  }
};

export const pauseCampaign = async (req, res, next) => {
  try {
    const campaign = await campaignService.pauseCampaign(req.user._id, req.params.id);
    res.status(200).json({ success: true, message: 'Campaign paused successfully', data: { campaign } });
  } catch (err) {
    next(err);
  }
};

export const deleteCampaign = async (req, res, next) => {
  try {
    await campaignService.deleteCampaign(req.user._id, req.params.id);
    res.status(200).json({ success: true, message: 'Campaign deleted successfully', data: null });
  } catch (err) {
    next(err);
  }
};
