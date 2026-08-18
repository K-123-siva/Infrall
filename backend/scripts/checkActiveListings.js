const sequelize = require('../src/config/database');

async function checkActiveListings() {
  try {
    console.log('🔍 Checking active listings in database...\n');

    // Get all active listings
    const [activeListings] = await sequelize.query(`
      SELECT id, title, category, status, createdAt, city, price
      FROM listings 
      WHERE status = 'active'
      ORDER BY createdAt DESC
      LIMIT 20
    `);

    console.log(`📋 Found ${activeListings.length} active listings:\n`);
    activeListings.forEach(listing => {
      console.log(`   ID: ${listing.id} | ${listing.title}`);
      console.log(`      Category: ${listing.category} | Status: ${listing.status}`);
      console.log(`      City: ${listing.city} | Price: ${listing.price}`);
      console.log(`      Created: ${listing.createdAt}\n`);
    });

    // Check total counts by status
    console.log('\n📊 Total listings by status:\n');
    const [statusCounts] = await sequelize.query(`
      SELECT status, COUNT(*) as count
      FROM listings
      GROUP BY status
    `);

    statusCounts.forEach(row => {
      console.log(`   ${row.status}: ${row.count}`);
    });

    // Check if there are any filters that might be hiding listings
    console.log('\n🔍 Checking for potential issues:\n');
    
    const [missingFields] = await sequelize.query(`
      SELECT id, title, 
        CASE WHEN city IS NULL OR city = '' THEN 'Missing City' ELSE 'Has City' END as city_status,
        CASE WHEN price IS NULL OR price = 0 THEN 'Missing Price' ELSE 'Has Price' END as price_status,
        CASE WHEN images IS NULL OR images = '[]' THEN 'No Images' ELSE 'Has Images' END as image_status
      FROM listings
      WHERE status = 'active'
      LIMIT 10
    `);

    console.log('Field completeness for active listings:');
    missingFields.forEach(listing => {
      console.log(`   ID ${listing.id}: ${listing.city_status} | ${listing.price_status} | ${listing.image_status}`);
    });

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await sequelize.close();
  }
}

checkActiveListings();
