// Quick test script to call the revalidate endpoint
const fetch = require('node-fetch');

async function testRevalidate() {
  try {
    console.log('🔄 Calling revalidate endpoint...');
    
    const response = await fetch('http://localhost:3000/api/revalidate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        path: '/launch'
      })
    });
    
    const result = await response.json();
    
    console.log('✅ Response status:', response.status);
    console.log('✅ Response body:', result);
    
    if (response.ok) {
      console.log('🎉 Revalidation successful! Launch page cache should be refreshed.');
    } else {
      console.log('❌ Revalidation failed:', result);
    }
    
  } catch (error) {
    console.error('❌ Error calling revalidate:', error.message);
  }
}

testRevalidate();
