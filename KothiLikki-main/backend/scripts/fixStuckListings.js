const { Sequelize } = require('sequelize');
const sequelize = require('../src/config/database');

async function fixStuckListings() {
  try {
    console.log('🔍 Checking for listings that should be active...\n');

    // 1. Find properties marked as 'rented' but have NO active rental
    const [rentedWithoutActiveRental] = await sequelize.query(`
      SELECT l.id, l.title, l.status, l.category
      FROM listings l
      LEFT JOIN property_rentals pr ON l.id = pr.listingId AND pr.status = 'active'
      WHERE l.status = 'rented' 
      AND l.category = 'property_rent'
      AND pr.id IS NULL
    `);

    console.log(`📋 Found ${rentedWithoutActiveRental.length} properties marked as 'rented' with NO active rental:\n`);
    rentedWithoutActiveRental.forEach(prop => {
      console.log(`   - ID: ${prop.id} | ${prop.title}`);
    });

    // 2. Find properties marked as 'sold' but have NO completed purchase
    const [soldWithoutPurchase] = await sequelize.query(`
      SELECT l.id, l.title, l.status, l.category
      FROM listings l
      LEFT JOIN purchases p ON l.id = p.listingId AND p.paymentStatus = 'paid'
      WHERE l.status = 'sold'
      AND l.category IN ('property_sell', 'vehicles')
      AND p.id IS NULL
    `);

    console.log(`\n📋 Found ${soldWithoutPurchase.length} properties marked as 'sold' with NO purchase:\n`);
    soldWithoutPurchase.forEach(prop => {
      console.log(`   - ID: ${prop.id} | ${prop.title}`);
    });

    // 3. Fix rented properties without active rental
    if (rentedWithoutActiveRental.length > 0) {
      console.log('\n🔧 Fixing properties marked as rented...');
      const [result1] = await sequelize.query(`
        UPDATE listings l
        LEFT JOIN property_rentals pr ON l.id = pr.listingId AND pr.status = 'active'
        SET l.status = 'active'
        WHERE l.status = 'rented' 
        AND l.category = 'property_rent'
        AND pr.id IS NULL
      `);
      console.log(`✅ Updated ${result1.affectedRows || rentedWithoutActiveRental.length} properties to 'active'`);
    }

    // 4. Fix sold properties without purchase
    if (soldWithoutPurchase.length > 0) {
      console.log('\n🔧 Fixing properties marked as sold...');
      const [result2] = await sequelize.query(`
        UPDATE listings l
        LEFT JOIN purchases p ON l.id = p.listingId AND p.paymentStatus = 'paid'
        SET l.status = 'active'
        WHERE l.status = 'sold'
        AND l.category IN ('property_sell', 'vehicles')
        AND p.id IS NULL
      `);
      console.log(`✅ Updated ${result2.affectedRows || soldWithoutPurchase.length} properties to 'active'`);
    }

    // 5. Show final status
    console.log('\n📊 Final Status Check:\n');
    const [finalStatus] = await sequelize.query(`
      SELECT 
        status,
        category,
        COUNT(*) as count
      FROM listings
      GROUP BY status, category
      ORDER BY category, status
    `);

    console.log('Listings by Status and Category:');
    finalStatus.forEach(row => {
      console.log(`   ${row.category} - ${row.status}: ${row.count}`);
    });

    console.log('\n✅ Done! Old listings should now be visible on the website.');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await sequelize.close();
  }
}

fixStuckListings();
