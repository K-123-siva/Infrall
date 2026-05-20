require('dotenv').config();
const sequelize = require('./src/config/database');
const LeisureLease = require('./src/models/LeisureLease');

async function fixLeisureLeaseTable() {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected\n');

    // Check if table exists
    const [tables] = await sequelize.query("SHOW TABLES LIKE 'LeisureLeases'");
    
    if (tables.length === 0) {
      console.log('❌ LeisureLeases table does not exist. Creating...');
      await LeisureLease.sync({ force: false });
      console.log('✅ LeisureLeases table created!');
    } else {
      console.log('✅ LeisureLeases table exists');
      
      // Check existing data
      const leases = await LeisureLease.findAll();
      console.log(`\nFound ${leases.length} existing leases:`);
      leases.forEach(lease => {
        console.log(`- ID: ${lease.id}, Property: ${lease.listingId}, Year: ${lease.leaseYear}, Status: ${lease.status}, Payment: ${lease.paymentStatus}`);
      });
      
      // Check for duplicates
      const [duplicates] = await sequelize.query(`
        SELECT listingId, leaseYear, COUNT(*) as count 
        FROM LeisureLeases 
        GROUP BY listingId, leaseYear 
        HAVING count > 1
      `);
      
      if (duplicates.length > 0) {
        console.log('\n⚠️  Found duplicate leases:');
        duplicates.forEach(dup => {
          console.log(`  Property ${dup.listingId}, Year ${dup.leaseYear}: ${dup.count} leases`);
        });
        console.log('\n💡 You need to delete duplicates before the unique constraint can work.');
      } else {
        console.log('\n✅ No duplicate leases found');
      }
    }

    // Try to sync the model (will add missing columns/indexes)
    console.log('\n🔄 Syncing model with database...');
    await LeisureLease.sync({ alter: true });
    console.log('✅ Model synced successfully!');

    console.log('\n✅ Fix complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
    process.exit(1);
  }
}

fixLeisureLeaseTable();
