const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const sequelize = require('../src/config/database');

async function deleteKavyaAccount() {
  try {
    const email = '99220040577@klu.ac.in';
    
    console.log(`🗑️  Deleting account: ${email}\n`);

    // Find user
    const [users] = await sequelize.query(`
      SELECT id, name, email FROM users WHERE email = ?
    `, { replacements: [email] });

    if (users.length === 0) {
      console.log('❌ User not found');
      return;
    }

    const user = users[0];
    console.log('👤 Found user:');
    console.log(`   ID: ${user.id}`);
    console.log(`   Name: ${user.name}`);
    console.log(`   Email: ${user.email}`);

    // Check listings
    const [listings] = await sequelize.query(`
      SELECT id, title FROM listings WHERE userId = ?
    `, { replacements: [user.id] });

    console.log(`\n📋 Listings: ${listings.length}`);
    if (listings.length > 0) {
      listings.forEach(l => {
        console.log(`   ${l.id} | ${l.title}`);
      });
    }

    // Delete related records first (with error handling)
    console.log(`\n🗑️  Deleting related records...`);
    
    try {
      await sequelize.query(`DELETE FROM monthly_payments WHERE userId = ?`, { replacements: [user.id] });
      console.log(`   ✅ Monthly payments deleted`);
    } catch (e) { console.log(`   ⚠️  Monthly payments: ${e.message}`); }
    
    try {
      await sequelize.query(`DELETE FROM leisureleases WHERE userId = ?`, { replacements: [user.id] });
      console.log(`   ✅ Leisure leases deleted`);
    } catch (e) { console.log(`   ⚠️  Leisure leases: ${e.message}`); }
    
    try {
      await sequelize.query(`DELETE FROM property_rentals WHERE userId = ?`, { replacements: [user.id] });
      console.log(`   ✅ Property rentals deleted`);
    } catch (e) { console.log(`   ⚠️  Property rentals: ${e.message}`); }
    
    try {
      await sequelize.query(`DELETE FROM purchases WHERE userId = ?`, { replacements: [user.id] });
      console.log(`   ✅ Purchases deleted`);
    } catch (e) { console.log(`   ⚠️  Purchases: ${e.message}`); }
    
    try {
      await sequelize.query(`DELETE FROM kyc_documents WHERE userId = ?`, { replacements: [user.id] });
      console.log(`   ✅ KYC documents deleted`);
    } catch (e) { console.log(`   ⚠️  KYC documents: ${e.message}`); }
    
    try {
      await sequelize.query(`DELETE FROM wishlists WHERE userId = ?`, { replacements: [user.id] });
      console.log(`   ✅ Wishlists deleted`);
    } catch (e) { console.log(`   ⚠️  Wishlists: ${e.message}`); }
    
    try {
      await sequelize.query(`DELETE FROM messages WHERE senderId = ? OR receiverId = ?`, { replacements: [user.id, user.id] });
      console.log(`   ✅ Messages deleted`);
    } catch (e) { console.log(`   ⚠️  Messages: ${e.message}`); }
    
    try {
      await sequelize.query(`DELETE FROM reviews WHERE userId = ?`, { replacements: [user.id] });
      console.log(`   ✅ Reviews deleted`);
    } catch (e) { console.log(`   ⚠️  Reviews: ${e.message}`); }
    
    try {
      await sequelize.query(`DELETE FROM listings WHERE userId = ?`, { replacements: [user.id] });
      console.log(`   ✅ Listings deleted`);
    } catch (e) { console.log(`   ⚠️  Listings: ${e.message}`); }
    
    // Delete user
    await sequelize.query(`DELETE FROM users WHERE id = ?`, { replacements: [user.id] });

    console.log(`\n✅ User account and all related data deleted!`);
    console.log(`💡 Now when you create a listing with ${email}, a NEW account will be created`);
    console.log(`💡 And a password setup email will be sent`);

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await sequelize.close();
  }
}

deleteKavyaAccount();
