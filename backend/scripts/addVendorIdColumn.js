const sequelize = require('../src/config/database');

async function addVendorIdColumn() {
  try {
    console.log('🔧 Adding vendorId column to listings table...\n');

    // Check if column already exists
    const [columns] = await sequelize.query(`
      SHOW COLUMNS FROM listings LIKE 'vendorId'
    `);

    if (columns.length > 0) {
      console.log('✅ vendorId column already exists!');
      return;
    }

    // Add the column
    await sequelize.query(`
      ALTER TABLE listings 
      ADD COLUMN vendorId INT NULL,
      ADD CONSTRAINT fk_listing_vendor 
      FOREIGN KEY (vendorId) REFERENCES vendors(id) 
      ON DELETE SET NULL
    `);

    console.log('✅ Successfully added vendorId column to listings table!');

    // Verify the column was added
    const [verify] = await sequelize.query(`
      SHOW COLUMNS FROM listings LIKE 'vendorId'
    `);

    if (verify.length > 0) {
      console.log('✅ Verified: Column exists in database');
      console.log('   Column details:', verify[0]);
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await sequelize.close();
  }
}

addVendorIdColumn();
