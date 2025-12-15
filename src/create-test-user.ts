import pool from './config/db';
import bcrypt from 'bcrypt';

async function createTestUser() {
    try {
        console.log('Connecting to database...');
        const client = await pool.connect();
        console.log('Connected successfully.');

        // Test user credentials
        const username = 'test';
        const password = 'test1234';
        const name = '테스트 사용자';
        const phone_number = '010-1234-5678';

        // Check if user already exists
        const userCheck = await client.query('SELECT * FROM users WHERE username = $1', [username]);
        
        if (userCheck.rows.length > 0) {
            console.log('Test user already exists!');
            console.log('Username:', username);
            console.log('Password:', password);
            client.release();
            return;
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Insert test user
        const result = await client.query(
            'INSERT INTO users (username, password, name, phone_number) VALUES ($1, $2, $3, $4) RETURNING id, username, name',
            [username, hashedPassword, name, phone_number]
        );

        console.log('✅ Test user created successfully!');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('Username:', username);
        console.log('Password:', password);
        console.log('Name:', name);
        console.log('User ID:', result.rows[0].id);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('You can now login with these credentials!');

        client.release();
    } catch (err) {
        console.error('❌ Error creating test user:', err);
    } finally {
        pool.end();
    }
}

createTestUser();
