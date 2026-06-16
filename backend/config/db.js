import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const connectionUri = process.env.DATABASE_URL || process.env.MYSQL_URL;
let pool;

if (connectionUri) {
  try {
    const dbUrl = new URL(connectionUri);
    pool = mysql.createPool({
      host: dbUrl.hostname,
      port: dbUrl.port ? parseInt(dbUrl.port, 10) : 3306,
      user: decodeURIComponent(dbUrl.username),
      password: decodeURIComponent(dbUrl.password),
      database: dbUrl.pathname.startsWith('/') ? dbUrl.pathname.slice(1) : dbUrl.pathname,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });
  } catch (error) {
    console.error('Failed to parse database connection URI, falling back to direct string:', error);
    pool = mysql.createPool(connectionUri);
  }
} else {
  pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'prepduniya',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });
}

// Test connection
try {
  const connection = await pool.getConnection();
  console.log('Successfully connected to MySQL database.');
  connection.release();
} catch (error) {
  console.error('Error connecting to MySQL database:', error);
}

export default pool;

