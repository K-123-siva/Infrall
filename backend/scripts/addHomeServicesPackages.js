/**
 * Add home services subscription package types to database
 * This allows users to subscribe for unlimited home service requests
 */

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const sequelize = require('../src/config/database');

async function addHomeServicesPackages() {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected\n');

    console.log('Adding home services subscription package types...\n');

    // Check current ENUM values
    const [results] = await sequelize.query(`
      SELECT COLUMN_TYPE 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = DATABASE() 
      AND TABLE_NAME = 'Subscriptions' 
      AND COLUMN_NAME = 'packageType'
    `);

    if (results.length > 0) {
      console.log('Current packageType values:', results[0].COLUMN_TYPE);
      console.log('');
    }

    // Add new package types to ENUM
    console.log('Adding new package types to Subscriptions table...');
    
    try {
      await sequelize.query(`
        ALTER TABLE Subscriptions 
        MODIFY COLUMN packageType ENUM(
          'basic', 
          'premium', 
          'enterprise',
          'home_services_weekly',
          'home_services_monthly',
          'home_services_yearly'
        ) NOT NULL
      `);
      console.log('✅ Added home services package types to Subscriptions table');
    } catch (error) {
      if (error.message.includes('Duplicate entry')) {
        console.log('⏭️  Package types already exist');
      } else {
        throw error;
      }
    }

    console.log('\n✅ Home services subscription packages configured!');
    console.log('\nAvailable Packages:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('1. home_services_weekly  - ₹299 (7 days)');
    console.log('2. home_services_monthly - ₹499 (30 days)');
    console.log('3. home_services_yearly  - ₹699 (365 days)');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    console.log('\nNext Steps:');
    console.log('1. Users can now subscribe to home services plans');
    console.log('2. Subscriptions will show in user profile');
    console.log('3. Service requests will be FREE for subscribers');
    console.log('4. Non-subscribers pay ₹149 per request');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
    process.exit(1);
  }
}

addHomeServicesPackages();
