const User = require('./User');
const KYC = require('./KYC');
const Listing = require('./Listing');
const LeisureLease = require('./LeisureLease');
const PropertyRequest = require('./PropertyRequest');

// ── User ↔ KYC ────────────────────────────────────────────────────────────────
User.hasOne(KYC, { foreignKey: 'userId', as: 'kyc' });
KYC.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// ── Listing ↔ LeisureLease ────────────────────────────────────────────────────
User.hasMany(LeisureLease, { foreignKey: 'userId', as: 'leisureLeases' });
Listing.hasMany(LeisureLease, { foreignKey: 'listingId', as: 'leisureLeases' });

// ── PropertyRequest ↔ User ────────────────────────────────────────────────────
User.hasMany(PropertyRequest, { foreignKey: 'userId', as: 'propertyRequests' });
PropertyRequest.belongsTo(User, { foreignKey: 'userId', as: 'submittedBy' });

module.exports = {
  User,
  KYC,
  Listing,
  LeisureLease,
  PropertyRequest
};
