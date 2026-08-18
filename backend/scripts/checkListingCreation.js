const sequelize = require('../src/config/database');

async function checkListingCreation() {
  try {
    const email = '99220040577@klu.ac.in';
    
    console.log(`🔍 Checking listing creation for: ${email}\n`);

    // Find user
    const [users] = await sequelize.query(`
      SELECT 
        id, 
        name, 
        email, 
        isVerified,
        passwordSetupToken,
        passwordSetupExpiry,
        createdAt
      FROM users 
      WHERE email = ?
    `, { replacements: [email] });

    if (users.length === 0) {
      console.log('❌ User not found');
      console.log('💡 When you create a listing with this email, a new account will be created.');
      return;
    }

    const user = users[0];
    console.log('👤 User Account:');
    console.log(`   ID: ${user.id}`);
    console.log(`   Name: ${user.name}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Verified: ${user.isVerified ? 'Yes' : 'No'}`);
    console.log(`   Has Password Setup Token: ${user.passwordSetupToken ? 'Yes' : 'No'}`);
    if (user.passwordSetupToken) {
      const expired = new Date(user.passwordSetupExpiry) < new Date();
      console.log(`   Token Status: ${expired ? '❌ EXPIRED' : '✅ Valid'}`);
      console.log(`   Token Expiry: ${user.passwordSetupExpiry}`);
    }
    console.log(`   Created: ${user.createdAt}`);

    // Find listings
    const [listings] = await sequelize.query(`
      SELECT 
        id, 
        title, 
        category, 
        status,
        contactEmail,
        userId,
        createdAt
      FROM listings 
      WHERE userId = ? OR contactEmail = ?
      ORDER BY createdAt DESC
    `, { replacements: [user.id, email] });

    console.log(`\n📋 Listings: ${listings.length}\n`);
    
    if (listings.length === 0) {
      console.log('   No listings found');
      console.log('\n💡 This is why the account is not showing in Owner Accounts!');
      console.log('💡 Owner Accounts only shows users with at least 1 property.');
    } else {
      listings.forEach(listing => {
        console.log(`   ${listing.id} | ${listing.title}`);
        console.log(`      Category: ${listing.category} | Status: ${listing.status}`);
        console.log(`      Contact Email: ${listing.contactEmail}`);
        console.log(`      User ID: ${listing.userId}`);
        console.log(`      Created: ${listing.createdAt}\n`);
      });
    }

    // Check if user is a vendor
    const [vendors] = await sequelize.query(`
      SELECT id, businessName FROM vendors WHERE userId = ?
    `, { replacements: [user.id] });

    if (vendors.length > 0) {
      console.log('⚠️  This user is also a VENDOR!');
      console.log('⚠️  Vendors are excluded from Owner Accounts.');
      vendors.forEach(v => {
        console.log(`   Vendor: ${v.businessName} (ID: ${v.id})`);
      });
    }

    // Summary
    console.log('\n📊 Summary:');
    console.log(`   Account exists: Yes`);
    console.log(`   Has listings: ${listings.length > 0 ? 'Yes' : 'No'}`);
    console.log(`   Is vendor: ${vendors.length > 0 ? 'Yes' : 'No'}`);
    console.log(`   Should show in Owner Accounts: ${listings.length > 0 && vendors.length === 0 ? 'YES ✅' : 'NO ❌'}`);

    if (listings.length === 0) {
      console.log('\n💡 To make this account appear in Owner Accounts:');
      console.log('   1. Create a listing with contactEmail: ' + email);
      console.log('   2. The listing will be linked to this account');
      console.log('   3. Account will appear in Owner Accounts');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await sequelize.close();
  }
}

checkListingCreation();
