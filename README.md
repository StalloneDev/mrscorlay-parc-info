# Central Gestion System

Une application full-stack moderne pour la gestion centralisée des ressources.

## Technologies Utilisées

### Frontend
- React avec TypeScript
- Vite pour le bundling
- TailwindCSS pour le styling
- Radix UI pour les composants
- React Query pour la gestion d'état
- React Hook Form pour les formulaires
- Zod pour la validation
- Recharts pour les graphiques

### Backend
- Node.js
- Express
- TypeScript
- PostgreSQL avec Drizzle ORM

## Installation

1. Cloner le repository
```bash
git clone [URL_DU_REPO]
cd CentralGestionSystem
```

2. Installer les dépendances
```bash
# Installation des dépendances du client
cd client
npm install

# Installation des dépendances du serveur
cd ../server
npm install
```

3. Configuration
- Créer un fichier `.env` dans le dossier server
- Copier le contenu de `.env.example` et remplir les variables

4. Démarrer l'application
```bash
# Démarrer le serveur
cd server
npm run dev

# Démarrer le client (dans un autre terminal)
cd client
npm run dev
```

## Structure du Projet

```
CentralGestionSystem/
├── client/             # Frontend React
├── server/             # Backend Node.js
├── shared/             # Types et utilitaires partagés
└── migrations/         # Migrations de base de données
```

## Déploiement

### Frontend (Netlify)
- Le frontend est configuré pour être déployé sur Netlify
- La configuration se trouve dans `netlify.toml`
- Les redirections sont configurées pour le routage côté client

### Backend
- Le backend nécessite un environnement Node.js
- Configuration de la base de données PostgreSQL requise
- Variables d'environnement à configurer selon l'environnement

## Contribution

1. Fork le projet
2. Créer une branche pour votre fonctionnalité (`git checkout -b feature/AmazingFeature`)
3. Commit vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## License

MIT 