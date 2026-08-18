const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const sequelize = require('../src/config/database');

async function checkSivaAccount() {
  try {
    const email = 'ssivaa302@gmail.com';
    
    console.log(`🔍 Checking account: ${email}\n`);

    // Find user
    const [users] = await sequelize.query(`
      SELECT 
        id, 
        name, 
        email, 
        role,
        isVerified,
        passwordSetupToken,
        passwordSetupExpiry,
        createdAt
      FROM users 
      WHERE email = ?
    `, { replacements: [email] });

    if (users.length === 0) {
      console.log('❌ User NOT found');
      console.log('💡 This means the account creation failed or contactEmail was not provided');
      
      // Check latest listing
      console.log('\n📋 Checking latest listing...');
      const [listings] = await sequelize.query(`
        SELECT id, title, contactEmail, contactPerson, userId, createdAt
        FROM listings 
        ORDER BY createdAt DESC 
        LIMIT 1
      `);
      
      if (listings.length > 0) {
        const listing = listings[0];
        console.log(`   Latest listing: ${listing.title}`);
        console.log(`   Contact Email: ${listing.contactEmail}`);
        console.log(`   Contact Person: ${listing.contactPerson}`);
        console.log(`   User ID: ${listing.userId}`);
        console.log(`   Created: ${listing.createdAt}`);
        
        if (listing.contactEmail !== email) {
          console.log(`\n⚠️  Latest listing has different email: ${listing.contactEmail}`);
        }
      }
      return;
    }

    const user = users[0];
    console.log('✅ User FOUND:');
    console.log(`   ID: ${user.id}`);
    console.log(`   Name: ${user.name}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Role: ${user.role}`);
    console.log(`   Verified: ${user.isVerified ? 'Yes' : 'No'}`);
    console.log(`   Created: ${user.createdAt}`);

    console.log('\n🔐 Password Setup:');
    if (user.passwordSetupToken) {
      const expired = new Date(user.passwordSetupExpiry) < new Date();
      console.log(`   Has Token: Yes`);
      console.log(`   Token Status: ${expired ? '❌ EXPIRED' : '✅ Valid'}`);
      console.log(`   Expiry: ${user.passwordSetupExpiry}`);
      console.log('\n💡 This is a NEW account - password setup email should have been sent');
    } else {
      console.log(`   Has Token: No`);
      if (user.isVerified) {
        console.log('\n💡 This is an EXISTING account - no email should be sent');
      } else {
        console.log('\n⚠️  Account exists but has no token and is not verified');
      }
    }

    // Check listings
    const [listings] = await sequelize.query(`
      SELECT id, title, category, status, contactEmail, userId
      FROM listings 
      WHERE userId = ? OR contactEmail = ?
      ORDER BY createdAt DESC
    `, { replacements: [user.id, email] });

    console.log(`\n📋 Listings: ${listings.length}`);
    if (listings.length > 0) {
      listings.forEach(listing => {
        console.log(`   ${listing.id} | ${listing.title} | ${listing.category}`);
        console.log(`      Contact: ${listing.contactEmail} | User ID: ${listing.userId}`);
        
        if (listing.userId !== user.id) {
          console.log(`      ⚠️  WARNING: userId mismatch!`);
        }
      });
    }

    // Check if vendor
    const [vendors] = await sequelize.query(`
      SELECT id, businessName FROM vendors WHERE userId = ?
    `, { replacements: [user.id] });

    if (vendors.length > 0) {
      console.log(`\n⚠️  User is also a VENDOR (excluded from Owner Accounts)`);
    }

    console.log('\n📊 Summary:');
    console.log(`   Account exists: Yes`);
    console.log(`   Is new account: ${user.passwordSetupToken ? 'Yes' : 'No'}`);
    console.log(`   Has listings: ${listings.length > 0 ? 'Yes' : 'No'}`);
    console.log(`   Is vendor: ${vendors.length > 0 ? 'Yes' : 'No'}`);
    console.log(`   Should show in Owner Accounts: ${listings.length > 0 && vendors.length === 0 ? 'YES ✅' : 'NO ❌'}`);

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await sequelize.close();
  }
}

checkSivaAccount();
