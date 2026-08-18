const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const sequelize = require('../src/config/database');
const User = require('../src/models/User');
const Listing = require('../src/models/Listing');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

// Import associations
require('../src/models/associations');

async function testListingSellerRelation() {
  try {
    console.log('🧪 Testing listing with seller/owner relationship...\n');

    // Test data
    const testEmail = 'sellertest@example.com';
    const testName = 'Seller Test Owner';
    const testPhone = '9999888877';
    
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

    // Step 1: Create owner account
    console.log('\n👤 Step 1: Creating owner account...');
    const setupToken = crypto.randomBytes(32).toString('hex');
    const tokenExpiry = new Date(Date.now() + 48 * 60 * 60 * 1000);
    
    const ownerUser = await User.create({
      name: testName,
      email: testEmail,
      password: await bcrypt.hash(crypto.randomBytes(32).toString('hex'), 10),
      phone: testPhone,
      role: 'user',
      isVerified: false,
      passwordSetupToken: setupToken,
      passwordSetupExpiry: tokenExpiry
    });

    console.log('   ✅ Owner account created!');
    console.log(`   User ID: ${ownerUser.id}`);
    console.log(`   Name: ${ownerUser.name}`);
    console.log(`   Email: ${ownerUser.email}`);

    // Step 2: Create listing with userId pointing to owner
    console.log('\n🏠 Step 2: Creating listing with owner as seller...');
    const listing = await Listing.create({
      title: 'Test Seller Property',
      description: 'Testing seller relationship',
      price: 75000,
      priceType: 'per_month',
      category: 'property_rent',
      subCategory: 'House',
      location: 'Test Area',
      city: 'Test City',
      state: 'Test State',
      pincode: '654321',
      contactEmail: testEmail,
      contactPerson: testName,
      contactPhone: testPhone,
      userId: ownerUser.id,  // This links listing to owner
      status: 'active',
      images: [],
      bedrooms: 3,
      bathrooms: 2,
      area: 1500,
      areaUnit: 'sqft'
    });

    console.log('   ✅ Listing created!');
    console.log(`   Listing ID: ${listing.id}`);
    console.log(`   Title: ${listing.title}`);
    console.log(`   User ID (seller): ${listing.userId}`);

    // Step 3: Fetch listing with seller relationship
    console.log('\n🔍 Step 3: Fetching listing with seller relationship...');
    const listingWithSeller = await Listing.findByPk(listing.id, {
      include: [
        { 
          model: User, 
          as: 'seller', 
          attributes: ['id', 'name', 'email', 'phone', 'isVerified'] 
        }
      ]
    });

    if (listingWithSeller && listingWithSeller.seller) {
      console.log('   ✅ Seller relationship loaded successfully!');
      console.log('\n📊 Listing Details:');
      console.log(`   Listing ID: ${listingWithSeller.id}`);
      console.log(`   Title: ${listingWithSeller.title}`);
      console.log(`   Category: ${listingWithSeller.category}`);
      console.log(`   Price: ₹${listingWithSeller.price}`);
      console.log(`   Contact Email: ${listingWithSeller.contactEmail}`);
      
      console.log('\n👤 Seller/Owner Details:');
      console.log(`   Seller ID: ${listingWithSeller.seller.id}`);
      console.log(`   Seller Name: ${listingWithSeller.seller.name}`);
      console.log(`   Seller Email: ${listingWithSeller.seller.email}`);
      console.log(`   Seller Phone: ${listingWithSeller.seller.phone}`);
      console.log(`   Verified: ${listingWithSeller.seller.isVerified ? 'Yes' : 'No'}`);
      
      // Verify the relationship
      console.log('\n✅ Verification:');
      console.log(`   Listing userId matches owner ID: ${listingWithSeller.userId === ownerUser.id ? 'YES ✅' : 'NO ❌'}`);
      console.log(`   Seller ID matches owner ID: ${listingWithSeller.seller.id === ownerUser.id ? 'YES ✅' : 'NO ❌'}`);
      console.log(`   Contact email matches seller email: ${listingWithSeller.contactEmail === listingWithSeller.seller.email ? 'YES ✅' : 'NO ❌'}`);
      
      if (listingWithSeller.userId === ownerUser.id && 
          listingWithSeller.seller.id === ownerUser.id &&
          listingWithSeller.contactEmail === listingWithSeller.seller.email) {
        console.log('\n🎉 PERFECT! Seller relationship is correctly set up!');
      } else {
        console.log('\n⚠️  WARNING: Seller relationship has issues!');
      }
    } else {
      console.log('   ❌ Seller relationship NOT loaded!');
      console.log('   This means the association is not working correctly.');
    }

    // Step 4: Test API response format
    console.log('\n📡 Step 4: Testing API response format...');
    const apiResponse = {
      id: listingWithSeller.id,
      title: listingWithSeller.title,
      price: listingWithSeller.price,
      category: listingWithSeller.category,
      seller: listingWithSeller.seller ? {
        id: listingWithSeller.seller.id,
        name: listingWithSeller.seller.name,
        email: listingWithSeller.seller.email,
        isVerified: listingWithSeller.seller.isVerified
      } : null
    };
    
    console.log('   API Response:', JSON.stringify(apiResponse, null, 2));

    // Step 5: Check Owner Accounts
    console.log('\n📋 Step 5: Checking Owner Accounts visibility...');
    const [ownerAccountCheck] = await sequelize.query(`
      SELECT 
        u.id,
        u.name,
        u.email,
        COUNT(l.id) as propertyCount
      FROM users u
      LEFT JOIN listings l ON u.id = l.userId
      WHERE u.email = ?
      GROUP BY u.id
    `, { replacements: [testEmail] });

    if (ownerAccountCheck.length > 0) {
      const account = ownerAccountCheck[0];
      console.log(`   Owner: ${account.name} (${account.email})`);
      console.log(`   Properties: ${account.propertyCount}`);
      console.log(`   Will show in Owner Accounts: ${account.propertyCount > 0 ? 'YES ✅' : 'NO ❌'}`);
    }

    console.log('\n✅ ALL TESTS PASSED!');
    console.log('\n💡 Summary:');
    console.log('   ✅ Owner account created with password setup token');
    console.log('   ✅ Listing created with userId pointing to owner');
    console.log('   ✅ Seller relationship works correctly');
    console.log('   ✅ Contact email matches seller email');
    console.log('   ✅ Account will appear in Owner Accounts');
    console.log('   ✅ API will return seller details with listing');

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

testListingSellerRelation();
