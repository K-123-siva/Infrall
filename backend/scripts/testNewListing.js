const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const sequelize = require('../src/config/database');

async function testNewListing() {
  try {
    const testEmail = 'test@example.com';
    
    console.log('🔍 Testing listing creation flow...\n');

    // Check if user exists
    const [users] = await sequelize.query(`
      SELECT id, name, email FROM users WHERE email = ?
    `, { replacements: [testEmail] });

    console.log('📧 Test Email:', testEmail);
    console.log('👤 User exists:', users.length > 0 ? 'Yes' : 'No');
    
    if (users.length > 0) {
      console.log('   User ID:', users[0].id);
      console.log('   User Name:', users[0].name);
      console.log('\n💡 Expected behavior: Property added to existing account, NO email sent');
    } else {
      console.log('\n💡 Expected behavior: New account created, password setup email sent');
    }

    // Check recent listings
    console.log('\n📋 Recent listings (last 5):');
    const [listings] = await sequelize.query(`
      SELECT 
        l.id, 
        l.title, 
        l.contactEmail, 
        l.userId,
        u.name as ownerName,
        u.email as ownerEmail,
        l.createdAt
      FROM listings l
      LEFT JOIN users u ON l.userId = u.id
      ORDER BY l.createdAt DESC
      LIMIT 5
    `);

    listings.forEach(listing => {
      console.log(`\n   Listing ${listing.id}: ${listing.title}`);
      console.log(`   Contact Email: ${listing.contactEmail}`);
      console.log(`   User ID: ${listing.userId}`);
      console.log(`   Owner: ${listing.ownerName} (${listing.ownerEmail})`);
      console.log(`   Created: ${listing.createdAt}`);
      
      if (listing.contactEmail !== listing.ownerEmail) {
        console.log('   ⚠️  WARNING: contactEmail does not match owner email!');
      }
    });

    // Check for users with password setup tokens
    console.log('\n🔐 Users with pending password setup:');
    const [pendingUsers] = await sequelize.query(`
      SELECT 
        id, 
        name, 
        email, 
        passwordSetupToken,
        passwordSetupExpiry,
        isVerified
      FROM users 
      WHERE passwordSetupToken IS NOT NULL
      ORDER BY createdAt DESC
      LIMIT 5
    `);

    if (pendingUsers.length === 0) {
      console.log('   None');
    } else {
      pendingUsers.forEach(user => {
        const expired = new Date(user.passwordSetupExpiry) < new Date();
        console.log(`\n   ${user.name} (${user.email})`);
        console.log(`   Token: ${expired ? '❌ EXPIRED' : '✅ Valid'}`);
        console.log(`   Verified: ${user.isVerified ? 'Yes' : 'No'}`);
      });
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await sequelize.close();
  }
}

testNewListing();
