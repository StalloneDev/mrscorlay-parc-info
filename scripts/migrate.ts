import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";

// Vérification de la variable d'environnement DATABASE_URL
if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set");
}

// Création du client postgres pour les migrations
const migrationClient = postgres(process.env.DATABASE_URL, { max: 1 });

// Application des migrations
async function main() {
  try {
    const db = drizzle(migrationClient);
    
    console.log("Applying migrations...");
    await migrate(db, { migrationsFolder: "migrations" });
    console.log("Migrations applied successfully!");
    
    process.exit(0);
  } catch (error) {
    console.error("Error applying migrations:", error);
    process.exit(1);
  }
}

main(); 