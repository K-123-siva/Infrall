require('dotenv').config();
const sequelize = require('./src/config/database');
const BuyRequest = require('./src/models/BuyRequest');
const KYC = require('./src/models/KYC');
const User = require('./src/models/User');
const Listing = require('./src/models/Listing');

async function checkRequests() {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected\n');

    // Check Buy Requests
    console.log('=== BUY REQUESTS ===');
    const buyRequests = await BuyRequest.findAll({
      include: [
        { model: User, as: 'buyer', attributes: ['id', 'name', 'email'] },
        { model: Listing, as: 'property', attributes: ['id', 'title', 'price'] }
      ]
    });
    console.log(`Found ${buyRequests.length} buy requests:`);
    buyRequests.forEach(req => {
      console.log(`- ID: ${req.id}, Status: ${req.status}, User: ${req.buyer?.name}, Property: ${req.property?.title}`);
    });

    // Check KYC
    console.log('\n=== KYC DOCUMENTS ===');
    const kycDocs = await KYC.findAll();
    console.log(`Found ${kycDocs.length} KYC documents:`);
    kycDocs.forEach(kyc => {
      console.log(`- ID: ${kyc.id}, Status: ${kyc.status}, UserID: ${kyc.userId}, Occupation: ${kyc.occupation}`);
    });

    console.log('\n✅ Check complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

checkRequests();
