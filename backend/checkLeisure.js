require('dotenv').config();
const sequelize = require('./src/config/database');
const Listing = require('./src/models/Listing');
const KYC = require('./src/models/KYC');
const User = require('./src/models/User');
const LeisureLease = require('./src/models/LeisureLease');

async function checkLeisure() {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected\n');

    // Check leisure properties
    console.log('=== LEISURE PROPERTIES ===');
    const leisureProperties = await Listing.findAll({
      where: { isLeisure: true },
      attributes: ['id', 'title', 'price', 'category', 'isLeisure', 'maxLeasePeriodYears', 'status']
    });
    console.log(`Found ${leisureProperties.length} leisure properties:`);
    leisureProperties.forEach(prop => {
      console.log(`- ID: ${prop.id}, Title: ${prop.title}, Price: ₹${prop.price}/month, Max Lease: ${prop.maxLeasePeriodYears} years, Status: ${prop.status}`);
    });

    // Check KYC status for user kavya (ID: 42)
    console.log('\n=== KYC STATUS (User kavya) ===');
    const kyc = await KYC.findOne({ where: { userId: 42 } });
    if (kyc) {
      console.log(`Status: ${kyc.status}, Occupation: ${kyc.occupation}`);
    } else {
      console.log('❌ No KYC found for user');
    }

    // Check existing leisure leases
    console.log('\n=== EXISTING LEISURE LEASES ===');
    const leases = await LeisureLease.findAll({
      include: [
        { model: User, as: 'tenant', attributes: ['name', 'email'] },
        { model: Listing, as: 'property', attributes: ['title'] }
      ]
    });
    console.log(`Found ${leases.length} leisure leases:`);
    leases.forEach(lease => {
      console.log(`- ID: ${lease.id}, Property: ${lease.property?.title}, Year: ${lease.leaseYear}, Duration: ${lease.leaseDurationYears} years, Status: ${lease.status}, Payment: ${lease.paymentStatus}`);
    });

    console.log('\n✅ Check complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

checkLeisure();
