const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const sequelize = require('../src/config/database');
const bcrypt = require('bcryptjs');

async function createDummyUser1() {
  try {
    console.log('🔧 Creating dummy user with ID 1...\n');

    // Check if user 1 exists
    const [existing] = await sequelize.query(`
      SELECT id FROM users WHERE id = 1
    `);

    if (existing.length > 0) {
      console.log('✅ User ID 1 already exists');
      return;
    }

    // Create user with ID 1
    const hashedPassword = await bcrypt.hash('dummy123', 10);
    
    await sequelize.query(`
      INSERT INTO users (id, name, email, password, role, isVerified, createdAt, updatedAt)
      VALUES (1, 'Dummy User', 'dummy@temp.com', ?, 'user', 1, NOW(), NOW())
    `, { replacements: [hashedPassword] });

    console.log('✅ Dummy user created with ID 1');
    console.log('   Email: dummy@temp.com');
    console.log('   This is temporary until frontend cache clears');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await sequelize.close();
  }
}

createDummyUser1();
