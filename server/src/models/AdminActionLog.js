import mongoose from 'mongoose';

const adminActionLogSchema = new mongoose.Schema(
  {
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    action: {
      type: String,
      enum: [
        'USER_STATUS_UPDATED',
        'MERCHANT_STATUS_UPDATED',
        'PRODUCT_STATUS_UPDATED',
        'CAMPAIGN_MODERATED',
        'SETTINGS_UPDATED'
      ],
      required: true
    },
    resource: {
      type: String,
      required: true
    },
    resourceId: {
      type: String,
      default: ''
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },
    status: {
      type: String,
      default: 'SUCCESS'
    }
  },
  {
    timestamps: true
  }
);

const AdminActionLog = mongoose.model('AdminActionLog', adminActionLogSchema);
export default AdminActionLog;
