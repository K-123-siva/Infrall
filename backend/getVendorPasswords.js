/**
 * Get vendor account details including login credentials
 */

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const sequelize = require('./src/config/database');
const Vendor = require('./src/models/Vendor');
const User = require('./src/models/User');

async function getVendorPasswords() {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected\n');

    console.log('=== VENDOR ACCOUNTS ===\n');

    const vendors = await Vendor.findAll({
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'name', 'email', 'phone', 'role', 'password']
      }],
      order: [['id', 'ASC']]
    });

    if (vendors.length === 0) {
      console.log('❌ No vendor accounts found in database');
    } else {
      console.log(`Found ${vendors.length} vendor account(s):\n`);
      
      vendors.forEach((vendor, index) => {
        console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
        console.log(`VENDOR #${index + 1}`);
        console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
        console.log(`Vendor ID: ${vendor.id}`);
        console.log(`Business Name: ${vendor.businessName}`);
        console.log(`Contact Person: ${vendor.contactPerson}`);
        console.log(`Contact Email: ${vendor.contactEmail}`);
        console.log(`Contact Phone: ${vendor.contactPhone}`);
        console.log(`Vendor Type: ${vendor.vendorType}`);
        console.log(`Status: ${vendor.isActive ? '✅ Active' : '❌ Inactive'}`);
        console.log(`City: ${vendor.city}`);
        console.log(`Locality: ${vendor.locality}`);
        
        if (vendor.user) {
          console.log(`\n📧 LOGIN CREDENTIALS:`);
          console.log(`   User ID: ${vendor.user.id}`);
          console.log(`   Name: ${vendor.user.name}`);
          console.log(`   Email: ${vendor.user.email}`);
          console.log(`   Phone: ${vendor.user.phone}`);
          console.log(`   Role: ${vendor.user.role}`);
          console.log(`   Password: ${vendor.user.password || '(No password - may use Google login)'}`);
        } else {
          console.log(`\n⚠️  No user account linked!`);
        }
        console.log('');
      });

      console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
      console.log(`TOTAL: ${vendors.length} vendor account(s)`);
      console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);

      // Summary table
      console.log('QUICK REFERENCE - LOGIN CREDENTIALS:');
      console.log('═════════════════════════════════════════════════════════════');
      vendors.forEach((vendor, index) => {
        console.log(`${index + 1}. ${vendor.businessName}`);
        if (vendor.user) {
          console.log(`   📧 Email: ${vendor.user.email}`);
          console.log(`   🔑 Password: ${vendor.user.password || '(Google login)'}`);
        } else {
          console.log(`   ⚠️  No login account`);
        }
        console.log('');
      });
      console.log('═════════════════════════════════════════════════════════════');
    }

    console.log('\n✅ Done!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
    process.exit(1);
  }
}

getVendorPasswords();
