const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const sequelize = require('../src/config/database');

async function checkPasswordStatus() {
  try {
    const email = '99220040577@klu.ac.in';
    
    console.log(`🔍 Checking password status for: ${email}\n`);

    const [users] = await sequelize.query(`
      SELECT 
        id, 
        name, 
        email, 
        isVerified,
        passwordSetupToken,
        passwordSetupExpiry,
        createdAt
      FROM users 
      WHERE email = ?
    `, { replacements: [email] });

    if (users.length === 0) {
      console.log('❌ User not found');
      return;
    }

    const user = users[0];
    console.log('👤 User Account:');
    console.log(`   ID: ${user.id}`);
    console.log(`   Name: ${user.name}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Verified: ${user.isVerified ? '✅ Yes' : '❌ No'}`);
    console.log(`   Created: ${user.createdAt}`);

    console.log('\n🔐 Password Setup Status:');
    if (user.passwordSetupToken) {
      const expired = new Date(user.passwordSetupExpiry) < new Date();
      console.log(`   Has Token: Yes`);
      console.log(`   Token Status: ${expired ? '❌ EXPIRED' : '✅ Valid'}`);
      console.log(`   Expiry: ${user.passwordSetupExpiry}`);
      
      if (expired) {
        console.log('\n⚠️  Password setup token has expired!');
        console.log('💡 User needs a new password setup email.');
      } else {
        console.log('\n✅ User can still use the existing password setup link.');
      }
    } else {
      console.log(`   Has Token: No`);
      
      if (user.isVerified) {
        console.log('\n✅ User has already set their password and verified their account.');
        console.log('💡 User can login with their email and password.');
      } else {
        console.log('\n⚠️  User has no password setup token and is not verified.');
        console.log('💡 User may need a new password setup email.');
      }
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await sequelize.close();
  }
}

checkPasswordStatus();
