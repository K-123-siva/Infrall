const sequelize = require('../src/config/database');

async function deleteSpecificAccount() {
  try {
    const email = '99220040577@klu.ac.in';
    
    console.log(`🗑️  Deleting account: ${email}\n`);

    // Check if user exists
    const [users] = await sequelize.query(`
      SELECT id, name, email FROM users WHERE email = ?
    `, { replacements: [email] });

    if (users.length === 0) {
      console.log('❌ User not found');
      return;
    }

    const user = users[0];
    console.log(`Found user: ID ${user.id} - ${user.name} (${user.email})`);

    // Check properties
    const [properties] = await sequelize.query(`
      SELECT id, title, category FROM listings WHERE userId = ?
    `, { replacements: [user.id] });

    console.log(`\nProperties: ${properties.length}`);
    properties.forEach(prop => {
      console.log(`   - ${prop.id}: ${prop.title} (${prop.category})`);
    });

    // Delete related records first
    console.log('\nDeleting related records...');
    
    // Delete listings
    if (properties.length > 0) {
      await sequelize.query(`DELETE FROM listings WHERE userId = ?`, { replacements: [user.id] });
      console.log(`✅ Deleted ${properties.length} listings`);
    }

    // Delete other related records
    await sequelize.query(`DELETE FROM wishlists WHERE userId = ?`, { replacements: [user.id] });
    await sequelize.query(`DELETE FROM reviews WHERE userId = ?`, { replacements: [user.id] });
    await sequelize.query(`DELETE FROM messages WHERE senderId = ? OR receiverId = ?`, { replacements: [user.id, user.id] });
    await sequelize.query(`DELETE FROM vendors WHERE userId = ?`, { replacements: [user.id] });
    await sequelize.query(`DELETE FROM kyc_documents WHERE userId = ?`, { replacements: [user.id] });
    await sequelize.query(`DELETE FROM buy_requests WHERE userId = ?`, { replacements: [user.id] });
    await sequelize.query(`DELETE FROM property_rentals WHERE userId = ?`, { replacements: [user.id] });
    await sequelize.query(`DELETE FROM purchases WHERE userId = ?`, { replacements: [user.id] });
    
    console.log('✅ Deleted related records');

    // Delete the user
    await sequelize.query(`DELETE FROM users WHERE id = ?`, { replacements: [user.id] });

    console.log('\n✅ User deleted successfully!');
    console.log('\n💡 You can now create a new property with this email and a fresh account will be created.');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await sequelize.close();
  }
}

deleteSpecificAccount();
