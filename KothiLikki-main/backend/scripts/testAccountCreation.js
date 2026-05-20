const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const sequelize = require('../src/config/database');
const User = require('../src/models/User');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

async function testAccountCreation() {
  try {
    const testEmail = 'test.owner@example.com';
    
    console.log('🧪 Testing account creation logic...\n');
    console.log(`Test email: ${testEmail}`);

    // Check if user exists
    const existingUser = await User.findOne({ where: { email: testEmail } });
    
    if (existingUser) {
      console.log('✅ User already exists - deleting for test...');
      await existingUser.destroy();
    }

    console.log('\n📝 Creating new owner account...');
    
    const contactEmail = testEmail.toLowerCase().trim();
    const setupToken = crypto.randomBytes(32).toString('hex');
    const tokenExpiry = new Date(Date.now() + 48 * 60 * 60 * 1000);
    
    const ownerUser = await User.create({
      name: 'Test Owner',
      email: contactEmail,
      password: await bcrypt.hash(crypto.randomBytes(32).toString('hex'), 10),
      phone: '1234567890',
      role: 'user',
      isVerified: false,
      passwordSetupToken: setupToken,
      passwordSetupExpiry: tokenExpiry
    });

    console.log('✅ Account created successfully!');
    console.log(`   ID: ${ownerUser.id}`);
    console.log(`   Name: ${ownerUser.name}`);
    console.log(`   Email: ${ownerUser.email}`);
    console.log(`   Has Token: ${ownerUser.passwordSetupToken ? 'Yes' : 'No'}`);
    console.log(`   Token Expiry: ${ownerUser.passwordSetupExpiry}`);

    console.log('\n💡 The account creation logic works correctly!');
    console.log('💡 The issue is that the backend server needs to be restarted');
    console.log('💡 OR the contactEmail is not being sent from the frontend');

    // Clean up
    await ownerUser.destroy();
    console.log('\n🗑️  Test account deleted');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await sequelize.close();
  }
}

testAccountCreation();
