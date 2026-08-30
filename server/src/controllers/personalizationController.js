import personalizationService from '../services/personalization/personalizationService.js';

export const getHomePageFeeds = async (req, res, next) => {
  try {
    const data = await personalizationService.getPersonalizedHomePage(req.user._id);
    res.status(200).json({ success: true, message: 'Personalized home feeds fetched', data });
  } catch (err) {
    next(err);
  }
};

export const getSimilarProducts = async (req, res, next) => {
  try {
    const data = await personalizationService.findSimilarProducts(req.params.id);
    res.status(200).json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

export const getUserPreferences = async (req, res, next) => {
  try {
    const preferences = await personalizationService.getUserPreferences(req.user._id);
    res.status(200).json({ success: true, data: { preferences } });
  } catch (err) {
    next(err);
  }
};

export const updateUserPreferences = async (req, res, next) => {
  try {
    const preferences = await personalizationService.updateUserPreferences(req.user._id, req.body);
    res.status(200).json({ success: true, message: 'Preferences updated successfully', data: { preferences } });
  } catch (err) {
    next(err);
  }
};

export const resetUserPreferences = async (req, res, next) => {
  try {
    const preferences = await personalizationService.resetUserPreferences(req.user._id);
    res.status(200).json({ success: true, message: 'Preferences reset to defaults', data: { preferences } });
  } catch (err) {
    next(err);
  }
};

export const togglePersonalization = async (req, res, next) => {
  try {
    const { enabled } = req.body;
    const preferences = await personalizationService.togglePersonalization(req.user._id, enabled);
    res.status(200).json({
      success: true,
      message: `Personalization ${enabled ? 'enabled' : 'disabled'}`,
      data: { preferences }
    });
  } catch (err) {
    next(err);
  }
};
