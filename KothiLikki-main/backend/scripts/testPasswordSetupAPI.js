const axios = require('axios');

async function testPasswordSetupAPI() {
  try {
    const backendURL = process.env.BACKEND_URL || 'http://localhost:5000';
    const token = 'b8cddc4b3eb19b34e8eaf02d3d15fa488d67193eefd67f8d7ae7c029a3d863b5';
    
    console.log('🔍 Testing password setup API...\n');
    console.log(`Backend URL: ${backendURL}`);
    console.log(`Token: ${token}\n`);

    // Test 1: Verify token for owner
    console.log('Test 1: Verifying owner token...');
    try {
      const response = await axios.get(`${backendURL}/api/account-management/verify-token`, {
        params: { token, type: 'owner' }
      });
      console.log('✅ Success!');
      console.log('Response:', JSON.stringify(response.data, null, 2));
    } catch (error) {
      console.log('❌ Failed!');
      if (error.response) {
        console.log('Status:', error.response.status);
        console.log('Error:', error.response.data);
      } else {
        console.log('Error:', error.message);
      }
    }

    console.log('\n---\n');

    // Test 2: Complete password setup
    console.log('Test 2: Testing complete password setup...');
    try {
      const response = await axios.post(`${backendURL}/api/account-management/complete-setup`, {
        token,
        password: 'TestPassword123',
        type: 'owner'
      });
      console.log('✅ Success!');
      console.log('Response:', JSON.stringify(response.data, null, 2));
    } catch (error) {
      console.log('❌ Failed!');
      if (error.response) {
        console.log('Status:', error.response.status);
        console.log('Error:', error.response.data);
      } else {
        console.log('Error:', error.message);
      }
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testPasswordSetupAPI();
