const db = require('./config/db');

async function testConnection() {
    try {
        console.log('Testing Database Connection...');
        const [rows] = await db.query('SELECT 1 as val');
        console.log('✅ Connection Successful! Value:', rows[0].val);

        console.log('Checking for tables...');
        const [tables] = await db.query('SHOW TABLES');
        console.log('Tables found:', tables.map(t => Object.values(t)[0]));

        const [users] = await db.query('SELECT * FROM users');
        console.log(`✅ Users table exists. Count: ${users.length}`);

    } catch (error) {
        console.error('❌ Database Error:', error.message);
        if (error.code === 'ECONNREFUSED') {
            console.error('Hint: Is MySQL running? Is the port 3306?');
        } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
            console.error('Hint: Check username/password in server/config/db.js');
        } else if (error.code === 'ER_BAD_DB_ERROR') {
            console.error('Hint: Does the database "dayflow_db" exist?');
        } else if (error.code === 'ER_NO_SUCH_TABLE') {
            console.error('Hint: The tables do not exist. Did you run schema.sql?');
        }
    } finally {
        process.exit();
    }
}

testConnection();
