const sequelize = require('../src/config/database');

async function deleteExcludedUsers() {
  try {
    console.log('🗑️  Deleting excluded users (0 properties and non-vendor users)...\n');

    // Get all users with 0 properties and no vendor profile
    const [usersToDelete] = await sequelize.query(`
      SELECT 
        u.id,
        u.name,
        u.email,
        (SELECT COUNT(*) FROM listings WHERE userId = u.id) as propertyCount,
        (SELECT COUNT(*) FROM vendors WHERE userId = u.id) as isVendor
      FROM users u
      WHERE u.role = 'user'
      HAVING propertyCount = 0 AND isVendor = 0
    `);

    console.log(`📋 Found ${usersToDelete.length} users to delete:\n`);
    
    if (usersToDelete.length === 0) {
      console.log('   No users to delete');
      return;
    }

    usersToDelete.forEach(user => {
      console.log(`   ${user.id} | ${user.email} | ${user.name}`);
    });

    console.log('\n⚠️  WARNING: This will permanently delete these users!');
    console.log('Proceeding in 3 seconds...\n');
    
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Delete users
    const userIds = usersToDelete.map(u => u.id);
    
    if (userIds.length > 0) {
      // Delete related records first
      console.log('Deleting related records...');
      
      // Delete any related data (add more tables if needed)
      await sequelize.query(`DELETE FROM wishlists WHERE userId IN (${userIds.join(',')})`);
      await sequelize.query(`DELETE FROM reviews WHERE userId IN (${userIds.join(',')})`);
      await sequelize.query(`DELETE FROM messages WHERE senderId IN (${userIds.join(',')}) OR receiverId IN (${userIds.join(',')})`);
      
      // Delete users
      const [result] = await sequelize.query(`
        DELETE FROM users WHERE id IN (${userIds.join(',')})
      `);
      
      console.log(`\n✅ Deleted ${usersToDelete.length} users successfully!`);
    }

    // Show remaining users
    const [remaining] = await sequelize.query(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN (SELECT COUNT(*) FROM listings WHERE userId = u.id) > 0 THEN 1 ELSE 0 END) as withProperties,
        SUM(CASE WHEN (SELECT COUNT(*) FROM vendors WHERE userId = u.id) > 0 THEN 1 ELSE 0 END) as vendors
      FROM users u
      WHERE u.role = 'user'
    `);

    console.log('\n📊 Remaining users:');
    console.log(`   Total: ${remaining[0].total}`);
    console.log(`   With properties: ${remaining[0].withProperties}`);
    console.log(`   Vendors: ${remaining[0].vendors}`);

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await sequelize.close();
  }
}

deleteExcludedUsers();
