const sequelize = require('../src/config/database');

async function checkPasswordSetupTokens() {
  try {
    console.log('🔍 Checking password setup tokens...\n');

    // Check users with password setup tokens
    const [usersWithTokens] = await sequelize.query(`
      SELECT 
        id, 
        name, 
        email, 
        role,
        isVerified,
        passwordSetupToken,
        passwordSetupExpiry,
        createdAt
      FROM users 
      WHERE passwordSetupToken IS NOT NULL
      ORDER BY createdAt DESC
    `);

    console.log(`📋 Found ${usersWithTokens.length} users with pending password setup:\n`);
    
    if (usersWithTokens.length === 0) {
      console.log('   No pending password setups found.');
      console.log('\n💡 To create a test account, use the admin panel or run:');
      console.log('   POST /api/account-management/owners/initiate');
    } else {
      usersWithTokens.forEach(user => {
        const expired = new Date(user.passwordSetupExpiry) < new Date();
        console.log(`   User ID: ${user.id}`);
        console.log(`   Name: ${user.name}`);
        console.log(`   Email: ${user.email}`);
        console.log(`   Role: ${user.role}`);
        console.log(`   Token: ${user.passwordSetupToken}`);
        console.log(`   Expiry: ${user.passwordSetupExpiry}`);
        console.log(`   Status: ${expired ? '❌ EXPIRED' : '✅ Valid'}`);
        console.log(`   Created: ${user.createdAt}`);
        
        if (!expired) {
          const baseUrl = process.env.CLIENT_URL || 'http://localhost:5173';
          const setupLink = `${baseUrl}/owner/setup-password?token=${user.passwordSetupToken}`;
          console.log(`   Setup Link: ${setupLink}`);
        }
        console.log('');
      });
    }

    // Check all users
    const [allUsers] = await sequelize.query(`
      SELECT 
        id, 
        name, 
        email, 
        role,
        isVerified,
        CASE 
          WHEN passwordSetupToken IS NOT NULL THEN 'Pending Setup'
          WHEN isVerified = 1 THEN 'Active'
          ELSE 'Inactive'
        END as status
      FROM users 
      ORDER BY createdAt DESC
      LIMIT 10
    `);

    console.log('\n📊 Recent users (last 10):\n');
    allUsers.forEach(user => {
      console.log(`   ${user.id} | ${user.email} | ${user.role} | ${user.status}`);
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await sequelize.close();
  }
}

checkPasswordSetupTokens();
