/**
 * Add payment tracking fields to ServiceRequests table
 * For home services subscription and one-time payment tracking
 */

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const sequelize = require('../src/config/database');

async function addServiceRequestPaymentFields() {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected\n');

    console.log('Adding payment tracking fields to ServiceRequests table...\n');

    // Check existing columns
    const [results] = await sequelize.query(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = DATABASE() 
      AND TABLE_NAME = 'ServiceRequests' 
      AND COLUMN_NAME IN ('paymentType', 'paymentAmount', 'subscriptionId', 'razorpayOrderId', 'razorpayPaymentId', 'paymentStatus')
    `);

    const existingColumns = results.map(r => r.COLUMN_NAME);
    console.log('Existing columns:', existingColumns.length > 0 ? existingColumns.join(', ') : 'none\n');

    // Add paymentType column
    if (!existingColumns.includes('paymentType')) {
      await sequelize.query(`
        ALTER TABLE ServiceRequests 
        ADD COLUMN paymentType ENUM('subscription', 'one_time') DEFAULT 'one_time'
        COMMENT 'How user paid: subscription or one-time payment'
      `);
      console.log('✅ Added paymentType column');
    } else {
      console.log('⏭️  paymentType column already exists');
    }

    // Add paymentAmount column
    if (!existingColumns.includes('paymentAmount')) {
      await sequelize.query(`
        ALTER TABLE ServiceRequests 
        ADD COLUMN paymentAmount DECIMAL(10,2) DEFAULT 149.00
        COMMENT 'Amount paid for this request (₹149 for one-time, ₹0 for subscription)'
      `);
      console.log('✅ Added paymentAmount column');
    } else {
      console.log('⏭️  paymentAmount column already exists');
    }

    // Add subscriptionId column
    if (!existingColumns.includes('subscriptionId')) {
      await sequelize.query(`
        ALTER TABLE ServiceRequests 
        ADD COLUMN subscriptionId INT NULL
        COMMENT 'If paid via subscription, link to subscription ID'
      `);
      console.log('✅ Added subscriptionId column');
    } else {
      console.log('⏭️  subscriptionId column already exists');
    }

    // Add razorpayOrderId column
    if (!existingColumns.includes('razorpayOrderId')) {
      await sequelize.query(`
        ALTER TABLE ServiceRequests 
        ADD COLUMN razorpayOrderId VARCHAR(255) NULL
        COMMENT 'Razorpay order ID for one-time payments'
      `);
      console.log('✅ Added razorpayOrderId column');
    } else {
      console.log('⏭️  razorpayOrderId column already exists');
    }

    // Add razorpayPaymentId column
    if (!existingColumns.includes('razorpayPaymentId')) {
      await sequelize.query(`
        ALTER TABLE ServiceRequests 
        ADD COLUMN razorpayPaymentId VARCHAR(255) NULL
        COMMENT 'Razorpay payment ID for one-time payments'
      `);
      console.log('✅ Added razorpayPaymentId column');
    } else {
      console.log('⏭️  razorpayPaymentId column already exists');
    }

    // Add paymentStatus column
    if (!existingColumns.includes('paymentStatus')) {
      await sequelize.query(`
        ALTER TABLE ServiceRequests 
        ADD COLUMN paymentStatus ENUM('pending', 'paid', 'failed') DEFAULT 'pending'
        COMMENT 'Payment status for one-time payments'
      `);
      console.log('✅ Added paymentStatus column');
    } else {
      console.log('⏭️  paymentStatus column already exists');
    }

    console.log('\n✅ All payment tracking fields added successfully!');
    console.log('\nPayment Model:');
    console.log('- One-time payment: ₹149 per request');
    console.log('- Subscription: ₹0 per request (unlimited during subscription period)');
    console.log('- Weekly: ₹299, Monthly: ₹499, Yearly: ₹699');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
    process.exit(1);
  }
}

addServiceRequestPaymentFields();
