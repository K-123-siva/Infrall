require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const sequelize = require('../src/config/database');

async function addLeaseDuration() {
  try {
    console.log('🏖️ Adding lease duration field to LeisureLeases table...');

    // Add leaseDurationYears column to LeisureLeases table
    await sequelize.query(`
      ALTER TABLE LeisureLeases 
      ADD COLUMN leaseDurationYears INT DEFAULT 1 
      COMMENT 'Number of years for the lease (e.g., 1, 2, 3, 4, 5)'
    `);
    console.log('✅ Added leaseDurationYears column to LeisureLeases table');

    console.log('🎉 Lease duration field added successfully!');
    console.log('');
    console.log('📋 What was added:');
    console.log('  • leaseDurationYears field to LeisureLeases table');
    console.log('  • Allows multi-year leases (1, 2, 3, 4, 5+ years)');
    console.log('');
    console.log('🏖️ How it works:');
    console.log('  • Users can now lease properties for multiple years');
    console.log('  • Example: Lease for 3 years starting 2024 (covers 2024, 2025, 2026)');
    console.log('  • Total amount will be calculated based on duration');

  } catch (error) {
    console.error('❌ Error adding lease duration field:', error);
    
    if (error.message.includes('Duplicate column name')) {
      console.log('ℹ️  leaseDurationYears column already exists, skipping...');
    }
  } finally {
    await sequelize.close();
  }
}

// Run the migration
addLeaseDuration();
