const sequelize = require('../src/config/database');

async function deleteTestAccount() {
  try {
    const email = 'komitireddyprabhavathi2@gmail.com';
    
    console.log(`🗑️  Deleting test account: ${email}\n`);

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

    // Delete related records first
    console.log('\nDeleting related records...');
    
    // Delete vendors
    const [vendors] = await sequelize.query(`
      DELETE FROM vendors WHERE userId = ?
    `, { replacements: [user.id] });
    console.log(`✅ Deleted ${vendors.affectedRows || 0} vendor records`);

    // Delete listings
    const [listings] = await sequelize.query(`
      DELETE FROM listings WHERE userId = ?
    `, { replacements: [user.id] });
    console.log(`✅ Deleted ${listings.affectedRows || 0} listing records`);

    // Delete the user
    await sequelize.query(`
      DELETE FROM users WHERE id = ?
    `, { replacements: [user.id] });

    console.log('\n✅ User deleted successfully!');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await sequelize.close();
  }
}

deleteTestAccount();
