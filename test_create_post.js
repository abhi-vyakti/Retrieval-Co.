const http = require('http');

async function testCreatePost() {
    try {
        console.log('1. Logging in to get token...');
        const loginRes = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code: '22BCE1234', password: 'password123' }) // Using dummy credentials
        });

        const loginData = await loginRes.json();
        if (!loginRes.ok) throw new Error('Login failed: ' + JSON.stringify(loginData));

        const token = loginData.token;
        console.log('Login successful. Token received.');

        console.log('\n2. Testing Date formatting payload creation...');
        const payload = {
            type: 'lost',
            title: 'Programmatic Test API Date',
            category: 'Electronics',
            description: 'Testing if date parsing fixes the 400 error.',
            location: 'Main Gate',
            datetime: new Date().toISOString(), // Simulating the formatted string from frontend
            isAnonymous: false,
            isUrgent: true
        };

        console.log('Payload being sent:', JSON.stringify(payload, null, 2));

        const postRes = await fetch('http://localhost:5000/api/posts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(payload)
        });

        const postData = await postRes.json();
        if (!postRes.ok) {
            console.error('\n❌ Post creation failed:', postData);
            process.exit(1);
        } else {
            console.log('\n✅ Post successfully created!');
            console.log(postData);
            process.exit(0);
        }

    } catch (e) {
        console.error('Test crashed:', e);
        process.exit(1);
    }
}

testCreatePost();
