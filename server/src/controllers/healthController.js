/**
 * Controller to verify server status and health.
 * GET /api/health
 */
export const getHealthStatus = (req, res) => {
  res.status(200).json({
    success: true,
    message: 'PayPilot AI API is running'
  });
};
