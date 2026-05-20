const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ServiceRequest = sequelize.define('ServiceRequest', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  serviceType: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'Type of service: Plumbing, Electrical, Carpentry, etc.'
  },
  problemDescription: {
    type: DataTypes.TEXT,
    allowNull: false,
    comment: 'User describes their problem'
  },
  userPhone: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'User contact phone'
  },
  userAddress: {
    type: DataTypes.TEXT,
    allowNull: false,
    comment: 'User address'
  },
  status: {
    type: DataTypes.ENUM('pending', 'assigned', 'completed', 'cancelled'),
    defaultValue: 'pending'
  },
  workerName: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Name of assigned worker'
  },
  workerPhone: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Phone of assigned worker'
  },
  adminNotes: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Internal notes by admin'
  },
  vendorId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: { model: 'Vendors', key: 'id' },
    comment: 'Registered vendor assigned by admin (vendor portal)'
  },
  assignedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: 'When admin assigned the job to a vendor'
  },
  // Payment tracking fields
  paymentType: {
    type: DataTypes.ENUM('subscription', 'one_time'),
    defaultValue: 'one_time',
    comment: 'How user paid: subscription or one-time payment'
  },
  paymentAmount: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 149.00,
    comment: 'Amount paid for this request (₹149 for one-time, ₹0 for subscription)'
  },
  subscriptionId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'If paid via subscription, link to subscription ID'
  },
  razorpayOrderId: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Razorpay order ID for one-time payments'
  },
  razorpayPaymentId: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Razorpay payment ID for one-time payments'
  },
  paymentStatus: {
    type: DataTypes.ENUM('pending', 'paid', 'failed'),
    defaultValue: 'pending',
    comment: 'Payment status for one-time payments'
  }
}, {
  tableName: 'ServiceRequests',
  timestamps: true
});

// Set up associations
const User = require('./User');
const Vendor = require('./Vendor');

ServiceRequest.belongsTo(User, { foreignKey: 'userId', as: 'user' });
User.hasMany(ServiceRequest, { foreignKey: 'userId' });

ServiceRequest.belongsTo(Vendor, { foreignKey: 'vendorId', as: 'vendor' });
Vendor.hasMany(ServiceRequest, { foreignKey: 'vendorId', as: 'serviceRequests' });

module.exports = ServiceRequest;
