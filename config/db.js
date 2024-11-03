//connection pool for postgresql
import pkg from 'pg';
const { Pool } = pkg;

export const pool = new Pool({
    user: 'sheetsDB',          
    host: 'db',                
    database: 'sheetsDB',      
    password: 'sheetsDB',      
    port: 5432,                
  });
  