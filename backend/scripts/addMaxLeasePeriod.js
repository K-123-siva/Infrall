require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const sequelize = require('../src/config/database');

async function addMaxLeasePeriod() {
  try {
    console.log('🏖️ Adding max lease period field to Listings table...');

    // Add maxLeasePeriodYears column to Listings table
    await sequelize.query(`
      ALTER TABLE Listings 
      ADD COLUMN maxLeasePeriodYears INT DEFAULT NULL 
      COMMENT 'Maximum number of years the owner allows for leisure lease (e.g., 1, 2, 3, 4, 5)'
    `);
    console.log('✅ Added maxLeasePeriodYears column to Listings table');

    console.log('🎉 Max lease period field added successfully!');
    console.log('');
    console.log('📋 What was added:');
    console.log('  • maxLeasePeriodYears field to Listings table');
    console.log('  • Allows values like 1, 2, 3, 4, 5 years');
    console.log('');
    console.log('🏖️ How it works:');
    console.log('  • When owner lists property with isLeisure=true, they specify max years');
    console.log('  • Users can lease the property for 1 year up to the max years specified');
    console.log('  • Example: If maxLeasePeriodYears=4, user can lease for 1, 2, 3, or 4 years');

  } catch (error) {
    console.error('❌ Error adding max lease period field:', error);
    
    if (error.message.includes('Duplicate column name')) {
      console.log('ℹ️  maxLeasePeriodYears column already exists, skipping...');
    }
  } finally {
    await sequelize.close();
  }
}

// Run the migration
addMaxLeasePeriod();
