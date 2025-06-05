import { config } from "dotenv";
config(); // Charger les variables d'environnement

import { db } from "../server/db";
import { users } from "../shared/schema";
import bcrypt from "bcrypt";

async function createUsers() {
  try {
    const saltRounds = 10;
    
    // Créer l'administrateur
    const adminPassword = await bcrypt.hash("mrscorlay@1234", saltRounds);
    await db.insert(users).values({
      email: "admin@mrsholdings.com",
      password: adminPassword,
      role: "admin",
      firstName: "Admin",
      lastName: "MRS",
      isActive: true
    });
    console.log("✅ Administrateur créé avec succès");

    // Créer le technicien
    const techPassword = await bcrypt.hash("mrscorlay@1234", saltRounds);
    await db.insert(users).values({
      email: "technicien@mrsholdings.com",
      password: techPassword,
      role: "technicien",
      firstName: "Technicien",
      lastName: "MRS",
      isActive: true
    });
    console.log("✅ Technicien créé avec succès");

    console.log("Tous les utilisateurs ont été créés avec succès !");
  } catch (error) {
    if (error.code === "23505") { // Code PostgreSQL pour violation de contrainte unique
      console.log("⚠️ Un ou plusieurs utilisateurs existent déjà");
    } else {
      console.error("Erreur lors de la création des utilisateurs:", error);
    }
  } finally {
    process.exit(0);
  }
}

createUsers(); 