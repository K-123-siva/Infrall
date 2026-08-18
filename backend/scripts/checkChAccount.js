const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const sequelize = require('../src/config/database');

async function checkChAccount() {
  try {
    const email = 'ch@gmail.com';
    
    console.log(`🔍 Checking if account was created for: ${email}\n`);

    const [users] = await sequelize.query(`
      SELECT id, name, email, passwordSetupToken FROM users WHERE email = ?
    `, { replacements: [email] });

    if (users.length > 0) {
      console.log('✅ Account EXISTS');
      console.log(`   ID: ${users[0].id}`);
      console.log(`   Name: ${users[0].name}`);
      console.log(`   Email: ${users[0].email}`);
      console.log(`   Has Token: ${users[0].passwordSetupToken ? 'Yes' : 'No'}`);
    } else {
      console.log('❌ Account NOT created');
      console.log('\n💡 This confirms the backend is running OLD code!');
      console.log('💡 The account creation logic did NOT execute.');
    }

    // Check listing 75
    const [listings] = await sequelize.query(`
      SELECT id, title, userId, contactEmail FROM listings WHERE id = 75
    `);

    if (listings.length > 0) {
      console.log(`\n📋 Listing 75:`);
      console.log(`   Title: ${listings[0].title}`);
      console.log(`   Contact Email: ${listings[0].contactEmail}`);
      console.log(`   User ID: ${listings[0].userId}`);
      console.log(`   Problem: userId is 1 (admin) instead of owner's ID`);
    }

    console.log('\n⚠️  YOU MUST RESTART THE BACKEND SERVER!');
    console.log('\n📝 Steps:');
    console.log('   1. Find the terminal running the backend');
    console.log('   2. Press Ctrl+C to stop it');
    console.log('   3. Run: npm start');
    console.log('   4. Try creating a listing again');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await sequelize.close();
  }
}

checkChAccount();
