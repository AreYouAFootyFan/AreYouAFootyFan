import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
  host: process.env.PGHOST,
  user: process.env.PGUSER,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: parseInt(process.env.PGPORT || "5432"),
});

// Test database connection
pool.query("SELECT NOW()", (error, response) => {
  if (error) {
    console.error("Database connection error", error.stack);
  } else {
    console.log("Database connected:", response.rows[0].now);
  }
});

export default pool;
