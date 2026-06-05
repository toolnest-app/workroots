import "dotenv/config";
import { readFileSync } from "fs";
import { Pool } from "@neondatabase/serverless";

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not set");

  const path = process.argv[2];
  if (!path) throw new Error("Usage: tsx scripts/run-sql-file.ts <path.sql>");

  const pool = new Pool({ connectionString: url });
  const contents = readFileSync(path, "utf-8");
  await pool.query(contents);
  await pool.end();
  console.log(`Applied SQL from ${path}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});