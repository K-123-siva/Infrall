const sequelize = require('../src/config/database');

async function testOwnerFiltering() {
  try {
    console.log('🔍 Testing Owner Account Filtering...\n');

    // Get all users
    const [allUsers] = await sequelize.query(`
      SELECT 
        u.id,
        u.name,
        u.email,
        u.role,
        (SELECT COUNT(*) FROM listings WHERE userId = u.id) as propertyCount,
        (SELECT COUNT(*) FROM vendors WHERE userId = u.id) as isVendor
      FROM users u
      WHERE u.role = 'user'
      ORDER BY u.createdAt DESC
      LIMIT 20
    `);

    console.log('📊 All Users:\n');
    allUsers.forEach(user => {
      const tags = [];
      if (user.isVendor > 0) tags.push('VENDOR');
      if (user.propertyCount > 0) tags.push(`${user.propertyCount} properties`);
      if (user.propertyCount === 0) tags.push('NO PROPERTIES');
      
      console.log(`   ${user.id} | ${user.email} | ${tags.join(' | ')}`);
    });

    // Filter: Only owners with properties (exclude vendors and 0-property users)
    const owners = allUsers.filter(user => user.isVendor === 0 && user.propertyCount > 0);

    console.log('\n\n✅ Filtered Owner Accounts (should show in Account Management):\n');
    if (owners.length === 0) {
      console.log('   No owners with properties found');
    } else {
      owners.forEach(owner => {
        console.log(`   ${owner.id} | ${owner.email} | ${owner.propertyCount} properties`);
      });
    }

    // Show what's excluded
    const excluded = allUsers.filter(user => user.isVendor > 0 || user.propertyCount === 0);
    console.log('\n\n❌ Excluded from Owner Accounts:\n');
    if (excluded.length === 0) {
      console.log('   None excluded');
    } else {
      excluded.forEach(user => {
        const reason = user.isVendor > 0 ? 'Is a vendor' : 'Has 0 properties';
        console.log(`   ${user.id} | ${user.email} | ${reason}`);
      });
    }

    console.log('\n\n📝 Summary:');
    console.log(`   Total users: ${allUsers.length}`);
    console.log(`   Owners with properties: ${owners.length}`);
    console.log(`   Excluded: ${excluded.length}`);

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await sequelize.close();
  }
}

testOwnerFiltering();
