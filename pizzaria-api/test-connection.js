const { Pool } = require('pg');
require('dotenv').config();

const testConnection = async () => {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    console.log('Testando conexão...');
    console.log('URL:', process.env.DATABASE_URL);
    
    const client = await pool.connect();
    console.log('✅ Conexão bem-sucedida!');
    
    const result = await client.query('SELECT NOW()');
    console.log('✅ Query executada:', result.rows[0]);
    
    client.release();
    await pool.end();
    
  } catch (err) {
    console.error('❌ Erro na conexão:', err.message);
    console.error('Código do erro:', err.code);
  }
};

testConnection();