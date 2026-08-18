const sequelize = require('../src/config/database');

async function addPasswordSetupFields() {
  try {
    console.log('🔧 Adding password setup fields to users table...\n');

    // Check if columns already exist
    const [columns] = await sequelize.query(`
      SHOW COLUMNS FROM users
    `);

    const columnNames = columns.map(col => col.Field);
    
    // Add passwordSetupToken if it doesn't exist
    if (!columnNames.includes('passwordSetupToken')) {
      await sequelize.query(`
        ALTER TABLE users 
        ADD COLUMN passwordSetupToken VARCHAR(255) NULL
      `);
      console.log('✅ Added passwordSetupToken column');
    } else {
      console.log('✅ passwordSetupToken column already exists');
    }

    // Add passwordSetupExpiry if it doesn't exist
    if (!columnNames.includes('passwordSetupExpiry')) {
      await sequelize.query(`
        ALTER TABLE users 
        ADD COLUMN passwordSetupExpiry DATETIME NULL
      `);
      console.log('✅ Added passwordSetupExpiry column');
    } else {
      console.log('✅ passwordSetupExpiry column already exists');
    }

    // Verify the columns were added
    const [verify] = await sequelize.query(`
      SHOW COLUMNS FROM users WHERE Field IN ('passwordSetupToken', 'passwordSetupExpiry')
    `);

    console.log('\n📋 Verification:');
    verify.forEach(col => {
      console.log(`   ${col.Field}: ${col.Type} (${col.Null === 'YES' ? 'Nullable' : 'Not Null'})`);
    });

    console.log('\n✅ Password setup fields added successfully!');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await sequelize.close();
  }
}

addPasswordSetupFields();
