const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const PropertyRequest = sequelize.define('PropertyRequest', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

  // Owner details
  ownerName:    { type: DataTypes.STRING, allowNull: false },
  ownerEmail:   { type: DataTypes.STRING, allowNull: false },
  ownerPhone:   { type: DataTypes.STRING, allowNull: false },

  // Property details
  listingType:  { type: DataTypes.ENUM('property_sell', 'property_rent'), allowNull: false },
  title:        { type: DataTypes.STRING, allowNull: false },
  address:      { type: DataTypes.TEXT, allowNull: false },
  city:         { type: DataTypes.STRING, allowNull: false },
  price:        { type: DataTypes.DECIMAL(12, 2), allowNull: true },
  bedrooms:     { type: DataTypes.INTEGER, allowNull: true },
  bathrooms:    { type: DataTypes.INTEGER, allowNull: true },
  area:         { type: DataTypes.STRING, allowNull: true },
  description:  { type: DataTypes.TEXT, allowNull: true },

  // Photos uploaded by user (Cloudinary URLs)
  photos:       { type: DataTypes.JSON, defaultValue: [] },

  // Admin workflow
  status: {
    type: DataTypes.ENUM('pending', 'approved', 'rejected'),
    defaultValue: 'pending'
  },
  adminNotes:   { type: DataTypes.TEXT, allowNull: true },

  // Link to the user who submitted
  userId:       { type: DataTypes.INTEGER, allowNull: true },

  // Link to listing created by admin after approval
  listingId:    { type: DataTypes.INTEGER, allowNull: true },
}, {
  tableName: 'property_requests',
  timestamps: true,
});

module.exports = PropertyRequest;
