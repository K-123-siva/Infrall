const sequelize = require('../src/config/database');

async function deleteListingsByEmail() {
  try {
    const email = '99220040577@klu.ac.in';
    
    console.log(`🗑️  Deleting listings for: ${email}\n`);

    // Find user
    const [users] = await sequelize.query(`
      SELECT id, name, email FROM users WHERE email = ?
    `, { replacements: [email] });

    if (users.length === 0) {
      console.log('❌ User not found');
      return;
    }

    const user = users[0];
    console.log(`Found user: ID ${user.id} - ${user.name} (${user.email})`);

    // Find listings
    const [listings] = await sequelize.query(`
      SELECT id, title, category, status FROM listings WHERE userId = ?
    `, { replacements: [user.id] });

    console.log(`\n📋 Found ${listings.length} listings:\n`);
    
    if (listings.length === 0) {
      console.log('   No listings found for this user');
      return;
    }

    listings.forEach(listing => {
      console.log(`   ${listing.id} | ${listing.title} | ${listing.category} | ${listing.status}`);
    });

    // Delete listings
    await sequelize.query(`DELETE FROM listings WHERE userId = ?`, { replacements: [user.id] });

    console.log(`\n✅ Deleted ${listings.length} listing(s) successfully!`);
    console.log(`\n💡 Account ${email} still exists.`);
    console.log('💡 You can now create a new property with this email.');
    console.log('💡 Since account exists, NO email will be sent (as per new logic).');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await sequelize.close();
  }
}

deleteListingsByEmail();
