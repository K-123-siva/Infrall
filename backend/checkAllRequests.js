require('dotenv').config();
const sequelize = require('./src/config/database');
const BuyRequest = require('./src/models/BuyRequest');
const KYC = require('./src/models/KYC');
const ServiceRequest = require('./src/models/ServiceRequest');
const PropertyRental = require('./src/models/PropertyRental');
const VisitBooking = require('./src/models/VisitBooking');
const User = require('./src/models/User');
const Listing = require('./src/models/Listing');

async function checkAllRequests() {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected\n');

    // Check Buy Requests
    console.log('=== BUY REQUESTS ===');
    const buyRequests = await BuyRequest.findAll({
      include: [
        { model: User, as: 'buyer', attributes: ['id', 'name', 'email'], required: false },
        { model: Listing, as: 'property', attributes: ['id', 'title'], required: false }
      ]
    });
    console.log(`Found ${buyRequests.length} buy requests:`);
    buyRequests.forEach(req => {
      console.log(`- ID: ${req.id}, Status: ${req.status}, User: ${req.buyer?.name || 'N/A'}, Property: ${req.property?.title || 'N/A'}`);
    });

    // Check KYC
    console.log('\n=== KYC DOCUMENTS ===');
    const kycDocs = await KYC.findAll();
    console.log(`Found ${kycDocs.length} KYC documents:`);
    kycDocs.forEach(kyc => {
      console.log(`- ID: ${kyc.id}, Status: ${kyc.status}, UserID: ${kyc.userId}, Occupation: ${kyc.occupation}`);
    });

    // Check Service Requests
    console.log('\n=== SERVICE REQUESTS ===');
    const serviceRequests = await ServiceRequest.findAll({
      include: [{ model: User, as: 'user', attributes: ['id', 'name', 'email'], required: false }]
    });
    console.log(`Found ${serviceRequests.length} service requests:`);
    serviceRequests.forEach(req => {
      console.log(`- ID: ${req.id}, Status: ${req.status}, User: ${req.user?.name || 'N/A'}, Service: ${req.serviceType}`);
    });

    // Check Property Rentals
    console.log('\n=== PROPERTY RENTALS ===');
    const rentals = await PropertyRental.findAll({
      include: [
        { model: User, as: 'tenant', attributes: ['id', 'name', 'email'], required: false },
        { model: Listing, as: 'property', attributes: ['id', 'title'], required: false }
      ]
    });
    console.log(`Found ${rentals.length} property rentals:`);
    rentals.forEach(rental => {
      console.log(`- ID: ${rental.id}, Status: ${rental.status}, User: ${rental.tenant?.name || 'N/A'}, Property: ${rental.property?.title || 'N/A'}`);
    });

    // Check Visit Bookings
    console.log('\n=== VISIT BOOKINGS ===');
    const visits = await VisitBooking.findAll({
      include: [
        { model: User, as: 'user', attributes: ['id', 'name', 'email'], required: false },
        { model: Listing, as: 'listing', attributes: ['id', 'title'], required: false }
      ]
    });
    console.log(`Found ${visits.length} visit bookings:`);
    visits.forEach(visit => {
      console.log(`- ID: ${visit.id}, Status: ${visit.status}, User: ${visit.user?.name || 'N/A'}, Property: ${visit.listing?.title || 'N/A'}`);
    });

    console.log('\n=== SUMMARY ===');
    console.log(`Total Buy Requests: ${buyRequests.length}`);
    console.log(`Total KYC Documents: ${kycDocs.length}`);
    console.log(`Total Service Requests: ${serviceRequests.length}`);
    console.log(`Total Property Rentals: ${rentals.length}`);
    console.log(`Total Visit Bookings: ${visits.length}`);
    console.log(`GRAND TOTAL: ${buyRequests.length + kycDocs.length + serviceRequests.length + rentals.length + visits.length}`);

    console.log('\n✅ Check complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
    process.exit(1);
  }
}

checkAllRequests();
