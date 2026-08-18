const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const sequelize = require('../src/config/database');

async function debugLatestListing() {
  try {
    console.log('🔍 Debugging latest listing...\n');

    // Get the latest listing
    const [listings] = await sequelize.query(`
      SELECT * FROM listings ORDER BY createdAt DESC LIMIT 1
    `);

    if (listings.length === 0) {
      console.log('❌ No listings found');
      return;
    }

    const listing = listings[0];
    console.log('📋 Latest Listing:');
    console.log(`   ID: ${listing.id}`);
    console.log(`   Title: ${listing.title}`);
    console.log(`   Category: ${listing.category}`);
    console.log(`   Contact Email: ${listing.contactEmail}`);
    console.log(`   Contact Person: ${listing.contactPerson}`);
    console.log(`   Contact Phone: ${listing.contactPhone}`);
    console.log(`   User ID: ${listing.userId}`);
    console.log(`   Created: ${listing.createdAt}`);

    // Get the user who created it
    const [users] = await sequelize.query(`
      SELECT id, name, email, role FROM users WHERE id = ?
    `, { replacements: [listing.userId] });

    if (users.length > 0) {
      const user = users[0];
      console.log(`\n👤 Listing Owner (userId ${listing.userId}):`);
      console.log(`   Name: ${user.name}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Role: ${user.role}`);
    }

    // Check if contactEmail user exists
    if (listing.contactEmail) {
      const [contactUsers] = await sequelize.query(`
        SELECT id, name, email, role FROM users WHERE email = ?
      `, { replacements: [listing.contactEmail] });

      console.log(`\n📧 Contact Email User (${listing.contactEmail}):`);
      if (contactUsers.length > 0) {
        const contactUser = contactUsers[0];
        console.log(`   ✅ User exists!`);
        console.log(`   ID: ${contactUser.id}`);
        console.log(`   Name: ${contactUser.name}`);
        console.log(`   Email: ${contactUser.email}`);
        console.log(`   Role: ${contactUser.role}`);
        
        if (listing.userId !== contactUser.id) {
          console.log(`\n❌ PROBLEM FOUND:`);
          console.log(`   Listing userId (${listing.userId}) does NOT match contactEmail user ID (${contactUser.id})`);
          console.log(`   This listing should belong to ${contactUser.name} but belongs to user ${listing.userId}`);
          
          console.log(`\n💡 Fixing this listing...`);
          await sequelize.query(`
            UPDATE listings SET userId = ? WHERE id = ?
          `, { replacements: [contactUser.id, listing.id] });
          console.log(`   ✅ Fixed! Listing ${listing.id} now belongs to user ${contactUser.id}`);
        } else {
          console.log(`\n✅ Listing is correctly linked to contactEmail user`);
        }
      } else {
        console.log(`   ❌ User does NOT exist`);
        console.log(`   💡 A new account should have been created for this email`);
      }
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await sequelize.close();
  }
}

debugLatestListing();
