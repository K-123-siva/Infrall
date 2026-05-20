/**
 * Create a test home services subscription for testing
 * This will create a monthly subscription for a user
 */

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const sequelize = require('../src/config/database');
const Subscription = require('../src/models/Subscription');
const User = require('../src/models/User');

async function createTestSubscription() {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected\n');

    // Get first user
    const user = await User.findOne({ where: { role: 'user' } });
    
    if (!user) {
      console.log('❌ No user found. Please create a user account first.');
      process.exit(1);
    }

    console.log(`Creating test subscription for user: ${user.name} (${user.email})\n`);

    // Check if user already has home services subscription
    const existing = await Subscription.findOne({
      where: {
        userId: user.id,
        packageType: ['home_services_weekly', 'home_services_monthly', 'home_services_yearly'],
        status: 'active'
      }
    });

    if (existing) {
      console.log('⚠️  User already has an active home services subscription:');
      console.log(`   Package: ${existing.packageType}`);
      console.log(`   Amount: ₹${existing.amount}`);
      console.log(`   Valid until: ${existing.endDate}`);
      console.log('\nTo create a new one, cancel the existing subscription first.');
      process.exit(0);
    }

    // Create monthly subscription
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 30); // 30 days from now

    const subscription = await Subscription.create({
      userId: user.id,
      packageType: 'home_services_monthly',
      amount: 499.00,
      startDate: startDate,
      endDate: endDate,
      status: 'active',
      razorpayOrderId: 'test_order_' + Date.now(),
      razorpayPaymentId: 'test_payment_' + Date.now(),
      razorpaySignature: 'test_signature'
    });

    console.log('✅ Test subscription created successfully!\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Subscription Details:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`User: ${user.name}`);
    console.log(`Email: ${user.email}`);
    console.log(`Package: Monthly Home Services`);
    console.log(`Amount: ₹499`);
    console.log(`Start Date: ${startDate.toLocaleDateString()}`);
    console.log(`End Date: ${endDate.toLocaleDateString()}`);
    console.log(`Status: Active ✅`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    console.log('\n🎉 Now login as this user and visit /services page!');
    console.log('You should see:');
    console.log('  🟢 Active Subscription - Unlimited FREE Requests');
    console.log('  👑 Submit Request (FREE) button');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
    process.exit(1);
  }
}

createTestSubscription();
