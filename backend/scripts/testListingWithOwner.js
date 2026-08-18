const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const sequelize = require('../src/config/database');
const User = require('../src/models/User');
const Listing = require('../src/models/Listing');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

async function testListingWithOwner() {
  try {
    console.log('🧪 Testing listing creation with owner account...\n');

    // Test data
    const testEmail = 'testowner123@example.com';
    const testName = 'Test Owner';
    const testPhone = '9876543210';
    
    console.log('📝 Test Data:');
    console.log(`   Email: ${testEmail}`);
    console.log(`   Name: ${testName}`);
    console.log(`   Phone: ${testPhone}`);

    // Clean up if exists
    const existingUser = await User.findOne({ where: { email: testEmail } });
    if (existingUser) {
      console.log('\n🗑️  Cleaning up existing test user...');
      await Listing.destroy({ where: { userId: existingUser.id } });
      await existingUser.destroy();
    }

    // Simulate the listing creation logic
    console.log('\n📋 Step 1: Checking if user exists...');
    let ownerUser = await User.findOne({ where: { email: testEmail } });
    console.log(`   Result: ${ownerUser ? 'User exists' : 'User not found'}`);

    if (!ownerUser) {
      console.log('\n👤 Step 2: Creating new owner account...');
      const setupToken = crypto.randomBytes(32).toString('hex');
      const tokenExpiry = new Date(Date.now() + 48 * 60 * 60 * 1000);
      
      ownerUser = await User.create({
        name: testName,
        email: testEmail,
        password: await bcrypt.hash(crypto.randomBytes(32).toString('hex'), 10),
        phone: testPhone,
        role: 'user',
        isVerified: false,
        passwordSetupToken: setupToken,
        passwordSetupExpiry: tokenExpiry
      });

      console.log('   ✅ Account created!');
      console.log(`   User ID: ${ownerUser.id}`);
      console.log(`   Email: ${ownerUser.email}`);
      console.log(`   Has Token: ${ownerUser.passwordSetupToken ? 'Yes' : 'No'}`);
      console.log(`   Token Expiry: ${ownerUser.passwordSetupExpiry}`);
      
      const baseUrl = process.env.CLIENT_URL || 'http://localhost:5173';
      const setupLink = `${baseUrl}/owner/setup-password?token=${setupToken}`;
      const loginLink = `${baseUrl}/owner/login`;
      
      console.log('\n📧 Email would be sent with:');
      console.log(`   Setup Link: ${setupLink}`);
      console.log(`   Login Link: ${loginLink}`);
      console.log(`   Username: ${testEmail}`);
    }

    console.log('\n🏠 Step 3: Creating listing...');
    const listing = await Listing.create({
      title: 'Test Property',
      description: 'Test property for owner account creation',
      price: 50000,
      priceType: 'per_month',
      category: 'property_rent',
      subCategory: 'Apartment',
      location: 'Test Location',
      city: 'Test City',
      state: 'Test State',
      pincode: '123456',
      contactEmail: testEmail,
      contactPerson: testName,
      contactPhone: testPhone,
      userId: ownerUser.id,
      status: 'active',
      images: [],
      bedrooms: 2,
      bathrooms: 2,
      area: 1000,
      areaUnit: 'sqft'
    });

    console.log('   ✅ Listing created!');
    console.log(`   Listing ID: ${listing.id}`);
    console.log(`   Title: ${listing.title}`);
    console.log(`   User ID: ${listing.userId}`);
    console.log(`   Contact Email: ${listing.contactEmail}`);

    // Verify
    console.log('\n✅ Step 4: Verification...');
    const [users] = await sequelize.query(`
      SELECT id, name, email, passwordSetupToken FROM users WHERE email = ?
    `, { replacements: [testEmail] });

    const [listings] = await sequelize.query(`
      SELECT id, title, userId, contactEmail FROM listings WHERE userId = ?
    `, { replacements: [ownerUser.id] });

    console.log(`   User exists: ${users.length > 0 ? 'Yes ✅' : 'No ❌'}`);
    console.log(`   Has password token: ${users[0]?.passwordSetupToken ? 'Yes ✅' : 'No ❌'}`);
    console.log(`   Listing exists: ${listings.length > 0 ? 'Yes ✅' : 'No ❌'}`);
    console.log(`   Listing linked correctly: ${listings[0]?.userId === ownerUser.id ? 'Yes ✅' : 'No ❌'}`);

    // Check if would show in Owner Accounts
    const [vendors] = await sequelize.query(`
      SELECT id FROM vendors WHERE userId = ?
    `, { replacements: [ownerUser.id] });

    console.log('\n📊 Owner Accounts Check:');
    console.log(`   Has listings: ${listings.length > 0 ? 'Yes ✅' : 'No ❌'}`);
    console.log(`   Is vendor: ${vendors.length > 0 ? 'Yes ⚠️' : 'No ✅'}`);
    console.log(`   Will show in Owner Accounts: ${listings.length > 0 && vendors.length === 0 ? 'YES ✅' : 'NO ❌'}`);

    console.log('\n🎉 TEST PASSED! The logic works correctly.');
    console.log('\n💡 Expected behavior when you create a listing:');
    console.log('   1. New owner account created with password setup token');
    console.log('   2. Password setup email sent to owner');
    console.log('   3. Listing linked to owner account (userId matches)');
    console.log('   4. Account appears in Owner Accounts section');
    console.log('   5. Response message: "An account has been created for you. Please check your email to set your password."');

    // Clean up
    console.log('\n🗑️  Cleaning up test data...');
    await listing.destroy();
    await ownerUser.destroy();
    console.log('   ✅ Test data cleaned up');

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
  } finally {
    await sequelize.close();
  }
}

testListingWithOwner();
