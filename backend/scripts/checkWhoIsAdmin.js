const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const sequelize = require('../src/config/database');

async function checkWhoIsAdmin() {
  try {
    console.log('🔍 Checking who is admin and who is user ID 1...\n');

    // Find admin users
    const [admins] = await sequelize.query(`
      SELECT id, name, email, role FROM users WHERE role = 'admin'
    `);

    console.log('👑 Admin Users:');
    if (admins.length > 0) {
      admins.forEach(admin => {
        console.log(`   ID: ${admin.id} | Name: ${admin.name} | Email: ${admin.email}`);
      });
    } else {
      console.log('   No admin users found!');
    }

    // Find user ID 1
    const [user1] = await sequelize.query(`
      SELECT id, name, email, role FROM users WHERE id = 1
    `);

    console.log('\n👤 User ID 1 (siva):');
    if (user1.length > 0) {
      console.log(`   ID: ${user1[0].id}`);
      console.log(`   Name: ${user1[0].name}`);
      console.log(`   Email: ${user1[0].email}`);
      console.log(`   Role: ${user1[0].role}`);
      
      if (user1[0].role !== 'admin') {
        console.log('\n⚠️  USER ID 1 IS NOT ADMIN!');
        console.log('   This is why listings are being created with userId: 1');
        console.log('   You are logged in as a regular user, not admin');
      }
    }

    console.log('\n💡 Solution:');
    console.log('   You need to login as the ADMIN user, not as "siva"');
    console.log('   Or change user ID 1 (siva) role to "admin"');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await sequelize.close();
  }
}

checkWhoIsAdmin();
