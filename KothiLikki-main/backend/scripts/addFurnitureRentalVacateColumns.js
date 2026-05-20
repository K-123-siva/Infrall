/**
 * Add furniture rental vacate columns to purchases table
 * These columns are needed for furniture rental return/vacate functionality
 */

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const sequelize = require('../src/config/database');

async function addFurnitureRentalVacateColumns() {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected\n');

    console.log('Adding furniture rental vacate columns to purchases table...\n');

    // Check if columns already exist
    const [results] = await sequelize.query(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = DATABASE() 
      AND TABLE_NAME = 'purchases' 
      AND COLUMN_NAME IN ('vacateRequested', 'vacateDate', 'vacateReason', 'rentalStartDate', 'rentalEndDate')
    `);

    const existingColumns = results.map(r => r.COLUMN_NAME);
    console.log('Existing columns:', existingColumns.length > 0 ? existingColumns.join(', ') : 'none');

    // Add vacateRequested column
    if (!existingColumns.includes('vacateRequested')) {
      await sequelize.query(`
        ALTER TABLE purchases 
        ADD COLUMN vacateRequested TINYINT(1) DEFAULT 0 
        COMMENT 'Whether user has requested to vacate/return furniture'
      `);
      console.log('✅ Added vacateRequested column');
    } else {
      console.log('⏭️  vacateRequested column already exists');
    }

    // Add vacateDate column
    if (!existingColumns.includes('vacateDate')) {
      await sequelize.query(`
        ALTER TABLE purchases 
        ADD COLUMN vacateDate DATE NULL 
        COMMENT 'Requested vacate/return date'
      `);
      console.log('✅ Added vacateDate column');
    } else {
      console.log('⏭️  vacateDate column already exists');
    }

    // Add vacateReason column
    if (!existingColumns.includes('vacateReason')) {
      await sequelize.query(`
        ALTER TABLE purchases 
        ADD COLUMN vacateReason TEXT NULL 
        COMMENT 'Reason for vacate/return request'
      `);
      console.log('✅ Added vacateReason column');
    } else {
      console.log('⏭️  vacateReason column already exists');
    }

    // Add rentalStartDate column
    if (!existingColumns.includes('rentalStartDate')) {
      await sequelize.query(`
        ALTER TABLE purchases 
        ADD COLUMN rentalStartDate DATE NULL 
        COMMENT 'Start date of furniture rental'
      `);
      console.log('✅ Added rentalStartDate column');
    } else {
      console.log('⏭️  rentalStartDate column already exists');
    }

    // Add rentalEndDate column
    if (!existingColumns.includes('rentalEndDate')) {
      await sequelize.query(`
        ALTER TABLE purchases 
        ADD COLUMN rentalEndDate DATE NULL 
        COMMENT 'End date of furniture rental'
      `);
      console.log('✅ Added rentalEndDate column');
    } else {
      console.log('⏭️  rentalEndDate column already exists');
    }

    console.log('\n✅ All furniture rental vacate columns added successfully!');
    console.log('\nYou can now:');
    console.log('1. Restart the backend server');
    console.log('2. Test the admin all requests page');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
    process.exit(1);
  }
}

addFurnitureRentalVacateColumns();
