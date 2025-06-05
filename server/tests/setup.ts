import { config } from 'dotenv';
import { beforeAll } from 'vitest';

// Charger les variables d'environnement depuis .env.test s'il existe
config({ path: '.env.test' });

// Configuration globale avant tous les tests
beforeAll(async () => {
  // S'assurer que nous sommes en environnement de test
  process.env.NODE_ENV = 'test';
  
  // Autres configurations globales si nécessaire
}); 