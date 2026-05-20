const axios = require('axios');

async function testListingsAPI() {
  try {
    console.log('🔍 Testing /listings API endpoint...\n');

    // Read backend URL from .env
    const backendURL = process.env.BACKEND_URL || 'http://localhost:5000';
    const apiURL = `${backendURL}/api/listings`;

    console.log(`Testing: ${apiURL}\n`);

    // Test 1: Get all listings
    console.log('Test 1: Fetching all listings...');
    const response1 = await axios.get(apiURL, {
      params: { page: 1, limit: 12 }
    });
    console.log(`✅ Status: ${response1.status}`);
    console.log(`✅ Total listings: ${response1.data.total}`);
    console.log(`✅ Listings returned: ${response1.data.listings.length}`);
    console.log(`✅ Pages: ${response1.data.pages}\n`);

    if (response1.data.listings.length > 0) {
      console.log('Sample listings:');
      response1.data.listings.slice(0, 5).forEach(listing => {
        console.log(`   - ID: ${listing.id} | ${listing.title} | ${listing.category} | ${listing.status}`);
      });
    }

    // Test 2: Filter by category
    console.log('\n\nTest 2: Fetching property_rent listings...');
    const response2 = await axios.get(apiURL, {
      params: { category: 'property_rent', page: 1, limit: 12 }
    });
    console.log(`✅ Status: ${response2.status}`);
    console.log(`✅ Property rent listings: ${response2.data.listings.length}`);

    // Test 3: Filter by city
    console.log('\n\nTest 3: Fetching Bangalore listings...');
    const response3 = await axios.get(apiURL, {
      params: { city: 'Bangalore', page: 1, limit: 12 }
    });
    console.log(`✅ Status: ${response3.status}`);
    console.log(`✅ Bangalore listings: ${response3.data.listings.length}`);

    console.log('\n\n✅ API is working correctly!');

  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      console.error('❌ ERROR: Cannot connect to backend server!');
      console.error('   Make sure the backend server is running on the correct port.');
      console.error(`   Expected URL: ${error.config?.url || 'unknown'}`);
    } else if (error.response) {
      console.error(`❌ API Error: ${error.response.status} - ${error.response.statusText}`);
      console.error('Response:', error.response.data);
    } else {
      console.error('❌ Error:', error.message);
    }
  }
}

testListingsAPI();
