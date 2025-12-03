import pool from './config/db';

async function checkDb() {
    try {
        console.log('Connecting to database...');
        const client = await pool.connect();
        console.log('Connected successfully.');

        const res = await client.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
        `);

        console.log('Tables found:', res.rows.map(row => row.table_name));

        const usersTable = res.rows.find(row => row.table_name === 'users');
        if (usersTable) {
            console.log('Users table exists.');
            const columns = await client.query(`
                SELECT column_name 
                FROM information_schema.columns 
                WHERE table_name = 'users'
            `);
            console.log('Columns in users table:', columns.rows.map(row => row.column_name));
        } else {
            console.log('Users table does NOT exist.');
        }

        client.release();
    } catch (err) {
        console.error('Database connection error:', err);
    } finally {
        pool.end();
    }
}

checkDb();
