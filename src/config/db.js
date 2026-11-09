import 'dotenv/config';
import mysql from 'mysql2/promise';

export const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

export const connectDB = async () => {
    let conn;
    try {
        conn = await pool.getConnection();
        await conn.ping();
        console.log('Kết nối cơ sở dữ liệu thành công!');
    } catch (error) {
        console.error('Kết nối thất bại:', error.message);
        throw error;
    } finally {
        if (conn) conn.release();
    }
};
