/**
 * PostgreSQL Database Configuration
 */

const { Pool } = require('pg');

// Create connection pool
const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT) || 5432,
    database: process.env.DB_NAME || 'medcare_hospital',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
});

// Test database connection
const testConnection = async () => {
    const client = await pool.connect();
    try {
        const result = await client.query('SELECT NOW()');
        return result.rows[0];
    } finally {
        client.release();
    }
};

// Query helper with error handling
const query = async (text, params) => {
    const start = Date.now();
    try {
        const result = await pool.query(text, params);
        const duration = Date.now() - start;
        if (process.env.NODE_ENV === 'development') {
            console.log('Query executed:', { text: text.substring(0, 50), duration: `${duration}ms`, rows: result.rowCount });
        }
        return result;
    } catch (error) {
        console.error('Database query error:', error.message);
        throw error;
    }
};

// Get a client from the pool for transactions
const getClient = async () => {
    return await pool.connect();
};

module.exports = {
    pool,
    query,
    getClient,
    testConnection
};
