// Test script to debug AI API
const testAI = async () => {
  try {
    console.log('Testing AI API...');
    
    const response = await fetch('http://localhost:3001/api/ai/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: 'Hello, this is a test. Please respond with a brief message.',
        type: 'text',
        options: {
          temperature: 0.7,
          maxTokens: 100
        }
      }),
    });

    console.log('Response status:', response.status);
    console.log('Response ok:', response.ok);
    
    const data = await response.json();
    console.log('Response data:', JSON.stringify(data, null, 2));
    
    if (data.success && data.data?.text) {
      console.log('✅ AI is working! Response:', data.data.text);
    } else {
      console.log('❌ AI response issue:', data);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
};

// Run the test
testAI();
