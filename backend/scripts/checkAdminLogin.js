const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const sequelize = require('../src/config/database');
const bcrypt = require('bcryptjs');

async function checkAdminLogin() {
  try {
    console.log('🔍 Checking admin user...\n');

    // Find admin user
    const [admins] = await sequelize.query(`
      SELECT id, name, email, password, role, isVerified 
      FROM users 
      WHERE role = 'admin'
    `);

    if (admins.length === 0) {
      console.log('❌ No admin user found in database!');
      console.log('\n💡 Creating admin user...');
      
      const adminEmail = process.env.ADMIN_EMAIL || 'sivaprasad072611@gmail.com';
      const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@123456';
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      
      await sequelize.query(`
        INSERT INTO users (name, email, password, role, isVerified, createdAt, updatedAt)
        VALUES (?, ?, ?, 'admin', 1, NOW(), NOW())
      `, { replacements: ['Admin', adminEmail, hashedPassword] });
      
      console.log('✅ Admin user created!');
      console.log(`   Email: ${adminEmail}`);
      console.log(`   Password: ${adminPassword}`);
      return;
    }

    const admin = admins[0];
    console.log('👤 Admin User Found:');
    console.log(`   ID: ${admin.id}`);
    console.log(`   Name: ${admin.name}`);
    console.log(`   Email: ${admin.email}`);
    console.log(`   Role: ${admin.role}`);
    console.log(`   Verified: ${admin.isVerified ? 'Yes' : 'No'}`);

    // Check if password matches the one in .env
    const envPassword = process.env.ADMIN_PASSWORD || 'Admin@123456';
    const passwordMatches = await bcrypt.compare(envPassword, admin.password);
    
    console.log('\n🔐 Password Check:');
    console.log(`   .env password: ${envPassword}`);
    console.log(`   Password matches: ${passwordMatches ? '✅ Yes' : '❌ No'}`);

    if (!passwordMatches) {
      console.log('\n⚠️  Password in database does not match .env file!');
      console.log('💡 Updating admin password...');
      
      const newHashedPassword = await bcrypt.hash(envPassword, 10);
      await sequelize.query(`
        UPDATE users SET password = ? WHERE id = ?
      `, { replacements: [newHashedPassword, admin.id] });
      
      console.log('✅ Admin password updated!');
    }

    console.log('\n✅ Admin Login Credentials:');
    console.log(`   Email: ${admin.email}`);
    console.log(`   Password: ${envPassword}`);
    console.log(`   Login URL: ${process.env.CLIENT_URL}/admin/login`);

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await sequelize.close();
  }
}

checkAdminLogin();
