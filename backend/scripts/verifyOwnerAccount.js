const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const sequelize = require('../src/config/database');

async function verifyOwnerAccount() {
  try {
    const email = '99220040577@klu.ac.in';
    
    console.log(`🔍 Verifying Owner Account for: ${email}\n`);

    // Check user
    const [users] = await sequelize.query(`
      SELECT id, name, email, isVerified FROM users WHERE email = ?
    `, { replacements: [email] });

    if (users.length === 0) {
      console.log('❌ User not found');
      return;
    }

    const user = users[0];
    console.log('👤 User Account:');
    console.log(`   ID: ${user.id}`);
    console.log(`   Name: ${user.name}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Verified: ${user.isVerified ? 'Yes' : 'No'}`);

    // Check listings
    const [listings] = await sequelize.query(`
      SELECT id, title, category, status, userId, contactEmail
      FROM listings 
      WHERE userId = ?
      ORDER BY createdAt DESC
    `, { replacements: [user.id] });

    console.log(`\n📋 Listings: ${listings.length}`);
    if (listings.length > 0) {
      listings.forEach(listing => {
        console.log(`   ${listing.id} | ${listing.title} | ${listing.category} | ${listing.status}`);
      });
    }

    // Check if vendor
    const [vendors] = await sequelize.query(`
      SELECT id, businessName FROM vendors WHERE userId = ?
    `, { replacements: [user.id] });

    const isVendor = vendors.length > 0;
    console.log(`\n🏢 Is Vendor: ${isVendor ? 'Yes' : 'No'}`);
    if (isVendor) {
      vendors.forEach(v => {
        console.log(`   ${v.businessName} (ID: ${v.id})`);
      });
    }

    // Final verdict
    console.log('\n📊 Owner Account Status:');
    console.log(`   Has listings: ${listings.length > 0 ? '✅ Yes' : '❌ No'}`);
    console.log(`   Is vendor: ${isVendor ? '⚠️  Yes (excluded)' : '✅ No'}`);
    console.log(`   Should show in Owner Accounts: ${listings.length > 0 && !isVendor ? '✅ YES' : '❌ NO'}`);

    if (listings.length > 0 && !isVendor) {
      console.log('\n🎉 This account WILL appear in Owner Accounts section!');
    } else if (isVendor) {
      console.log('\n⚠️  This account is excluded because user is a vendor');
    } else {
      console.log('\n⚠️  This account is excluded because user has no listings');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await sequelize.close();
  }
}

verifyOwnerAccount();
