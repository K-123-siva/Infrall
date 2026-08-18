/**
 * Test script to verify the /api/requests/all endpoint
 * Run this AFTER restarting the backend server
 */

const http = require('http');

console.log('🧪 Testing /api/requests/all endpoint...\n');

// You'll need to replace this with a valid admin token
// To get a token: Login as admin in the frontend, then check browser DevTools > Application > Local Storage
const ADMIN_TOKEN = 'YOUR_ADMIN_TOKEN_HERE';

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/requests/all',
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${ADMIN_TOKEN}`,
    'Content-Type': 'application/json'
  }
};

const req = http.request(options, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    console.log(`Status Code: ${res.statusCode}\n`);
    
    if (res.statusCode === 200) {
      try {
        const json = JSON.parse(data);
        console.log('✅ SUCCESS! Requests loaded:\n');
        console.log(`Total Requests: ${json.requests?.length || 0}`);
        console.log(`\nBreakdown:`);
        console.log(`- Buy Requests: ${json.counts?.buy_request || 0}`);
        console.log(`- KYC Documents: ${json.counts?.kyc_request || 0}`);
        console.log(`- Service Requests: ${json.counts?.service_requests || 0}`);
        console.log(`- Visit Bookings: ${json.counts?.visit_booking || 0}`);
        console.log(`- Rental Requests: ${json.counts?.rental_request || 0}`);
        console.log(`- Vacate Requests: ${json.counts?.vacate_request || 0}`);
        console.log(`- Furniture: ${json.counts?.furniture_inquiry || 0}`);
        console.log(`- Materials: ${json.counts?.material_inquiry || 0}`);
        console.log(`\nPending: ${json.counts?.pending || 0}`);
        
        if (json.requests?.length > 0) {
          console.log('\n📋 Sample Request:');
          const sample = json.requests[0];
          console.log(`- Type: ${sample.typeLabel}`);
          console.log(`- User: ${sample.user?.name}`);
          console.log(`- Status: ${sample.status}`);
          console.log(`- Created: ${new Date(sample.createdAt).toLocaleString()}`);
        }
      } catch (e) {
        console.error('❌ Failed to parse response:', e.message);
        console.log('Response:', data);
      }
    } else if (res.statusCode === 401) {
      console.log('❌ UNAUTHORIZED - You need to update ADMIN_TOKEN in this script');
      console.log('\nTo get your token:');
      console.log('1. Login as admin in the frontend');
      console.log('2. Open browser DevTools (F12)');
      console.log('3. Go to Application > Local Storage');
      console.log('4. Copy the "token" value');
      console.log('5. Replace ADMIN_TOKEN in this script');
    } else {
      console.error('❌ ERROR:', data);
    }
  });
});

req.on('error', (error) => {
  console.error('❌ Connection Error:', error.message);
  console.log('\n⚠️  Make sure the backend server is running on port 5000');
  console.log('Run: node src/index.js');
});

req.end();
