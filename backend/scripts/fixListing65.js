const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const sequelize = require('../src/config/database');

async function fixListing65() {
  try {
    const email = '99220040577@klu.ac.in';
    const listingId = 65;
    
    console.log(`🔧 Fixing listing ${listingId} for ${email}\n`);

    // Find user
    const [users] = await sequelize.query(`
      SELECT id, name, email FROM users WHERE email = ?
    `, { replacements: [email] });

    if (users.length === 0) {
      console.log('❌ User not found');
      return;
    }

    const user = users[0];
    console.log(`✅ Found user: ${user.name} (ID: ${user.id})`);

    // Check current listing
    const [listings] = await sequelize.query(`
      SELECT id, title, userId, contactEmail FROM listings WHERE id = ?
    `, { replacements: [listingId] });

    if (listings.length === 0) {
      console.log('❌ Listing not found');
      return;
    }

    const listing = listings[0];
    console.log(`\n📋 Current Listing State:`);
    console.log(`   ID: ${listing.id}`);
    console.log(`   Title: ${listing.title}`);
    console.log(`   Current userId: ${listing.userId}`);
    console.log(`   Contact Email: ${listing.contactEmail}`);

    if (listing.userId === user.id) {
      console.log('\n✅ Listing already has correct userId!');
      return;
    }

    // Update listing to correct userId
    await sequelize.query(`
      UPDATE listings SET userId = ? WHERE id = ?
    `, { replacements: [user.id, listingId] });

    console.log(`\n✅ Updated listing ${listingId}:`);
    console.log(`   Old userId: ${listing.userId}`);
    console.log(`   New userId: ${user.id}`);
    console.log(`   Owner: ${user.name} (${user.email})`);

    // Verify the update
    const [updated] = await sequelize.query(`
      SELECT id, title, userId, contactEmail FROM listings WHERE id = ?
    `, { replacements: [listingId] });

    console.log(`\n✅ Verified:`);
    console.log(`   Listing ${updated[0].id} now has userId: ${updated[0].userId}`);
    console.log(`\n🎉 Listing successfully linked to correct owner account!`);

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await sequelize.close();
  }
}

fixListing65();
