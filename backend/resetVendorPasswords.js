/**
 * Reset vendor passwords to simple defaults
 */

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const sequelize = require('./src/config/database');
const Vendor = require('./src/models/Vendor');
const User = require('./src/models/User');
const bcrypt = require('bcryptjs');

async function resetVendorPasswords() {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected\n');

    console.log('=== RESETTING VENDOR PASSWORDS ===\n');

    const vendors = await Vendor.findAll({
      include: [{
        model: User,
        as: 'user'
      }],
      order: [['id', 'ASC']]
    });

    if (vendors.length === 0) {
      console.log('❌ No vendor accounts found');
      process.exit(0);
    }

    console.log(`Found ${vendors.length} vendor account(s)\n`);

    // Default password for all vendors
    const defaultPassword = 'Vendor@123';
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);

    for (const vendor of vendors) {
      if (vendor.user) {
        await User.update(
          { password: hashedPassword },
          { where: { id: vendor.user.id } }
        );

        console.log(`✅ Reset password for: ${vendor.businessName}`);
        console.log(`   Email: ${vendor.user.email}`);
        console.log(`   New Password: ${defaultPassword}`);
        console.log('');
      } else {
        console.log(`⚠️  Skipped ${vendor.businessName} - no user account linked`);
        console.log('');
      }
    }

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('SUMMARY - ALL VENDOR LOGIN CREDENTIALS:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    vendors.forEach((vendor, index) => {
      if (vendor.user) {
        console.log(`${index + 1}. ${vendor.businessName}`);
        console.log(`   📧 Email: ${vendor.user.email}`);
        console.log(`   🔑 Password: ${defaultPassword}`);
        console.log('');
      }
    });

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ All vendor passwords have been reset!');
    console.log(`\n📝 Default password for all vendors: ${defaultPassword}`);
    console.log('\nVendors can login at: http://localhost:5173/login');
    console.log('They should change their password after first login.');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
    process.exit(1);
  }
}

resetVendorPasswords();
