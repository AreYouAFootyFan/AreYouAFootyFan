const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const pool = new Pool({
  host: process.env.PGHOST,
  user: process.env.PGUSER,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: parseInt(process.env.PGPORT || '5432'),
});

async function runMigrations() {
  try {
    console.log('Starting database migrations...');
    
    await pool.query(`
      CREATE TABLE IF NOT EXISTS migrations (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    const { rows } = await pool.query('SELECT name FROM migrations');
    const appliedMigrations = rows.map(row => row.name);
    
    const migrationsPath = path.join(__dirname, 'Migrations');
    const migrationFiles = fs.readdirSync(migrationsPath)
      .filter(file => file.endsWith('.sql'))
      .sort();
    
    for (const file of migrationFiles) {
      if (!appliedMigrations.includes(file)) {
        console.log(`Applying migration: ${file}`);
        const sql = fs.readFileSync(path.join(migrationsPath, file), 'utf8');
        
        const client = await pool.connect();
        try {
          await client.query('BEGIN');
          
          await client.query(sql);
          
          await client.query(
            'INSERT INTO migrations (name) VALUES ($1)',
            [file]
          );
          
          await client.query('COMMIT');
          console.log(`Migration ${file} applied successfully`);
        } catch (error) {
          await client.query('ROLLBACK');
          console.error(`Error applying migration ${file}:`, error);
          throw error;
        } finally {
          client.release();
        }
      } else {
        console.log(`Migration ${file} already applied`);
      }
    }
    
    console.log('All migrations applied successfully');
  } catch (error) {
    console.error('Migration error:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

runMigrations();