async function testAI() {
    try {
        console.log('1. Logging in to get token...');
        const loginRes = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code: '22BCE1234', password: 'password123' })
        });

        const loginData = await loginRes.json();
        if (!loginRes.ok) throw new Error('Login failed: ' + JSON.stringify(loginData));

        const token = loginData.token;
        console.log('Login successful. Token received.\n');

        console.log('2. Testing AI NLP Parsing...');
        const payload = {
            text: "I lost my blue Nike backpack near the library yesterday afternoon. It has my ID inside."
        };

        console.log('Sending text:', payload.text);

        const aiRes = await fetch('http://localhost:5000/api/ai/parse-post', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(payload)
        });

        const aiData = await aiRes.json();

        if (!aiRes.ok) {
            console.error('\n❌ AI Parsing failed:', aiData);
            process.exit(1);
        } else {
            console.log('\n✅ AI Parse successful! Parsed JSON schema:');
            console.log(JSON.stringify(aiData.parsed, null, 2));
            process.exit(0);
        }

    } catch (e) {
        console.error('Test crashed:', e);
        process.exit(1);
    }
}

testAI();
