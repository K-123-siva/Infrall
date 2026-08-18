const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const sequelize = require('../src/config/database');

async function checkListingSchema() {
  try {
    console.log('🔍 Checking listings table schema...\n');

    // Get table structure
    const [columns] = await sequelize.query(`
      DESCRIBE listings
    `);

    console.log('📋 Listings Table Columns:\n');
    console.log('Column Name'.padEnd(30) + 'Type'.padEnd(20) + 'Null'.padEnd(10) + 'Key'.padEnd(10) + 'Default');
    console.log('='.repeat(80));
    
    columns.forEach(col => {
      console.log(
        col.Field.padEnd(30) + 
        col.Type.padEnd(20) + 
        col.Null.padEnd(10) + 
        col.Key.padEnd(10) + 
        (col.Default || 'NULL')
      );
    });

    // Check if contactEmail, contactPerson, contactPhone exist
    console.log('\n✅ Checking for owner contact fields:');
    const hasContactEmail = columns.some(col => col.Field === 'contactEmail');
    const hasContactPerson = columns.some(col => col.Field === 'contactPerson');
    const hasContactPhone = columns.some(col => col.Field === 'contactPhone');
    
    console.log(`   contactEmail: ${hasContactEmail ? '✅ EXISTS' : '❌ MISSING'}`);
    console.log(`   contactPerson: ${hasContactPerson ? '✅ EXISTS' : '❌ MISSING'}`);
    console.log(`   contactPhone: ${hasContactPhone ? '✅ EXISTS' : '❌ MISSING'}`);

    // Check a sample listing
    console.log('\n📊 Sample listing data:');
    const [listings] = await sequelize.query(`
      SELECT 
        id, 
        title, 
        userId,
        contactEmail,
        contactPerson,
        contactPhone,
        createdAt
      FROM listings 
      ORDER BY createdAt DESC 
      LIMIT 3
    `);

    if (listings.length > 0) {
      listings.forEach(listing => {
        console.log(`\n   Listing ${listing.id}: ${listing.title}`);
        console.log(`   User ID: ${listing.userId}`);
        console.log(`   Contact Email: ${listing.contactEmail || 'NULL'}`);
        console.log(`   Contact Person: ${listing.contactPerson || 'NULL'}`);
        console.log(`   Contact Phone: ${listing.contactPhone || 'NULL'}`);
        console.log(`   Created: ${listing.createdAt}`);
      });
    } else {
      console.log('   No listings found');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await sequelize.close();
  }
}

checkListingSchema();
