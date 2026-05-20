const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const sequelize = require('../src/config/database');

async function deleteSivaUser() {
  try {
    const userId = 1;
    const email = 'sekharravi406@gmail.com';
    
    console.log(`🗑️  Deleting user: siva (ID: ${userId}, Email: ${email})\n`);

    // Check user
    const [users] = await sequelize.query(`
      SELECT id, name, email, role FROM users WHERE id = ?
    `, { replacements: [userId] });

    if (users.length === 0) {
      console.log('❌ User not found');
      return;
    }

    console.log('👤 User to delete:');
    console.log(`   ID: ${users[0].id}`);
    console.log(`   Name: ${users[0].name}`);
    console.log(`   Email: ${users[0].email}`);
    console.log(`   Role: ${users[0].role}`);

    // Check listings
    const [listings] = await sequelize.query(`
      SELECT COUNT(*) as count FROM listings WHERE userId = ?
    `, { replacements: [userId] });

    console.log(`\n📋 Listings: ${listings[0].count}`);

    // Delete related records
    console.log('\n🗑️  Deleting related records...');
    
    try {
      await sequelize.query(`DELETE FROM monthly_payments WHERE userId = ?`, { replacements: [userId] });
      console.log('   ✅ Monthly payments deleted');
    } catch (e) { console.log(`   ⚠️  ${e.message}`); }
    
    try {
      await sequelize.query(`DELETE FROM leisureleases WHERE userId = ?`, { replacements: [userId] });
      console.log('   ✅ Leisure leases deleted');
    } catch (e) { console.log(`   ⚠️  ${e.message}`); }
    
    try {
      await sequelize.query(`DELETE FROM property_rentals WHERE userId = ?`, { replacements: [userId] });
      console.log('   ✅ Property rentals deleted');
    } catch (e) { console.log(`   ⚠️  ${e.message}`); }
    
    try {
      await sequelize.query(`DELETE FROM purchases WHERE userId = ?`, { replacements: [userId] });
      console.log('   ✅ Purchases deleted');
    } catch (e) { console.log(`   ⚠️  ${e.message}`); }
    
    try {
      await sequelize.query(`DELETE FROM kyc_documents WHERE userId = ?`, { replacements: [userId] });
      console.log('   ✅ KYC documents deleted');
    } catch (e) { console.log(`   ⚠️  ${e.message}`); }
    
    try {
      await sequelize.query(`DELETE FROM wishlists WHERE userId = ?`, { replacements: [userId] });
      console.log('   ✅ Wishlists deleted');
    } catch (e) { console.log(`   ⚠️  ${e.message}`); }
    
    try {
      await sequelize.query(`DELETE FROM messages WHERE senderId = ? OR receiverId = ?`, { replacements: [userId, userId] });
      console.log('   ✅ Messages deleted');
    } catch (e) { console.log(`   ⚠️  ${e.message}`); }
    
    try {
      await sequelize.query(`DELETE FROM reviews WHERE userId = ?`, { replacements: [userId] });
      console.log('   ✅ Reviews deleted');
    } catch (e) { console.log(`   ⚠️  ${e.message}`); }
    
    try {
      // Delete visit bookings for this user's listings
      await sequelize.query(`
        DELETE FROM visit_bookings 
        WHERE listingId IN (SELECT id FROM listings WHERE userId = ?)
      `, { replacements: [userId] });
      console.log('   ✅ Visit bookings (by listing) deleted');
    } catch (e) { console.log(`   ⚠️  ${e.message}`); }
    
    try {
      await sequelize.query(`DELETE FROM visit_bookings WHERE userId = ?`, { replacements: [userId] });
      console.log('   ✅ Visit bookings (by user) deleted');
    } catch (e) { console.log(`   ⚠️  ${e.message}`); }
    
    try {
      await sequelize.query(`DELETE FROM subscriptions WHERE userId = ?`, { replacements: [userId] });
      console.log('   ✅ Subscriptions deleted');
    } catch (e) { console.log(`   ⚠️  ${e.message}`); }
    
    try {
      await sequelize.query(`DELETE FROM servicerequests WHERE userId = ?`, { replacements: [userId] });
      console.log('   ✅ Service requests deleted');
    } catch (e) { console.log(`   ⚠️  ${e.message}`); }
    
    try {
      await sequelize.query(`DELETE FROM service_requests WHERE userId = ?`, { replacements: [userId] });
      console.log('   ✅ Service requests (alt) deleted');
    } catch (e) { console.log(`   ⚠️  ${e.message}`); }
    
    try {
      // Delete buy requests for this user's listings
      await sequelize.query(`
        DELETE FROM buy_requests 
        WHERE listingId IN (SELECT id FROM listings WHERE userId = ?)
      `, { replacements: [userId] });
      console.log('   ✅ Buy requests (by listing) deleted');
    } catch (e) { console.log(`   ⚠️  ${e.message}`); }
    
    try {
      await sequelize.query(`DELETE FROM buy_requests WHERE userId = ?`, { replacements: [userId] });
      console.log('   ✅ Buy requests (by user) deleted');
    } catch (e) { console.log(`   ⚠️  ${e.message}`); }
    
    try {
      await sequelize.query(`DELETE FROM listings WHERE userId = ?`, { replacements: [userId] });
      console.log('   ✅ Listings deleted');
    } catch (e) { console.log(`   ⚠️  ${e.message}`); }
    
    try {
      await sequelize.query(`DELETE FROM vendors WHERE userId = ?`, { replacements: [userId] });
      console.log('   ✅ Vendors deleted');
    } catch (e) { console.log(`   ⚠️  ${e.message}`); }
    
    // Delete user
    await sequelize.query(`DELETE FROM users WHERE id = ?`, { replacements: [userId] });

    console.log('\n✅ User "siva" deleted successfully!');
    console.log('\n💡 Now logout and login again as admin');
    console.log('   Email: sivaprasad072611@gmail.com');
    console.log('   Password: Admin@123456');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await sequelize.close();
  }
}

deleteSivaUser();
