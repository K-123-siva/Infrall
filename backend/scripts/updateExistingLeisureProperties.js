require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const sequelize = require('../src/config/database');

async function updateExistingLeisureProperties() {
  try {
    console.log('🏖️ Updating existing leisure properties with random max lease periods...');

    // Get all leisure properties
    const [leisureProperties] = await sequelize.query(`
      SELECT id, title, isLeisure, maxLeasePeriodYears 
      FROM Listings 
      WHERE isLeisure = TRUE
    `);

    if (leisureProperties.length === 0) {
      console.log('ℹ️  No leisure properties found in database');
      return;
    }

    console.log(`\n📋 Found ${leisureProperties.length} leisure properties`);
    console.log('─'.repeat(80));

    // Possible max lease period values (weighted towards common values)
    const maxPeriodOptions = [1, 2, 3, 3, 4, 4, 5, 5, 10]; // 3, 4, 5 are more common

    let updatedCount = 0;

    for (const property of leisureProperties) {
      // Skip if already has a value
      if (property.maxLeasePeriodYears !== null) {
        console.log(`⏭️  Skipping: "${property.title}" (already has ${property.maxLeasePeriodYears} years)`);
        continue;
      }

      // Pick a random max lease period
      const randomMaxPeriod = maxPeriodOptions[Math.floor(Math.random() * maxPeriodOptions.length)];

      // Update the property
      await sequelize.query(`
        UPDATE Listings 
        SET maxLeasePeriodYears = ? 
        WHERE id = ?
      `, {
        replacements: [randomMaxPeriod, property.id]
      });

      console.log(`✅ Updated: "${property.title}" → Max ${randomMaxPeriod} ${randomMaxPeriod === 1 ? 'year' : 'years'}`);
      updatedCount++;
    }

    console.log('─'.repeat(80));
    console.log(`\n🎉 Update complete!`);
    console.log(`   • Total leisure properties: ${leisureProperties.length}`);
    console.log(`   • Updated: ${updatedCount}`);
    console.log(`   • Skipped (already set): ${leisureProperties.length - updatedCount}`);

    // Show summary statistics
    const [summary] = await sequelize.query(`
      SELECT 
        maxLeasePeriodYears,
        COUNT(*) as count
      FROM Listings 
      WHERE isLeisure = TRUE AND maxLeasePeriodYears IS NOT NULL
      GROUP BY maxLeasePeriodYears
      ORDER BY maxLeasePeriodYears
    `);

    if (summary.length > 0) {
      console.log('\n📊 Distribution of max lease periods:');
      summary.forEach(row => {
        console.log(`   • ${row.maxLeasePeriodYears} ${row.maxLeasePeriodYears === 1 ? 'year' : 'years'}: ${row.count} ${row.count === 1 ? 'property' : 'properties'}`);
      });
    }

  } catch (error) {
    console.error('❌ Error updating leisure properties:', error);
  } finally {
    await sequelize.close();
  }
}

// Run the update
updateExistingLeisureProperties();
