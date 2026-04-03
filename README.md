# CESIZen API

API REST du projet **CESIZen**, une application de gestion du stress et du bien-être mental destinée aux étudiants CESI.

Construite avec **Node.js**, **Express**, **TypeScript**, **Prisma** et **MySQL**.

Campagne minimale avant toute livraison
Avant chaque démonstration ou livraison, les étapes suivantes doivent être validées :

    1. Ouvrir l'application mobile — vérifier l'affichage de l'accueil (exercices + contenus)
    2. Ouvrir la liste des exercices — vérifier les filtres par catégorie
    3. Lancer un exercice — vérifier l'animation (bulle ou barre selon le type)
    4. Se connecter — vérifier l'accès au profil avec nom/prénom/email
    5. Ajouter un exercice en favori — vérifier la présence dans le profil
    6. Consulter un contenu informatif — vérifier les likes et commentaires
    7. Se connecter au back-office admin — vérifier l'accès au dashboard
    8. Se déconnecter depuis l'app mobile

---

## Présentation du projet

CESIZen est composé de 3 projets :

| Projet                    | Description               | Lien                                                |
| ------------------------- | ------------------------- | --------------------------------------------------- |
| **cesizen-api** (ce repo) | Backend REST              | -                                                   |
| **cesizen-web**           | Interface admin (React)   | [Repo](https://github.com/ItsMaxou1/cesizen-web)    |
| **cesizen-mobile**        | Application mobile (Expo) | [Repo](https://github.com/ItsMaxou1/cesizen-mobile) |

> L'API doit être lancée en premier avant le web et le mobile.

---

## Prérequis

- [Node.js](https://nodejs.org/) v18+
- [MySQL](https://www.mysql.com/)
- npm

## Installation

```bash
git clone https://github.com/ItsMaxou1/cesizen-api.git
cd cesizen-api
git checkout develop
npm install
```

## Configuration

Créer un fichier `.env` à la racine :

```env
DATABASE_URL="mysql://USER:PASSWORD@localhost:3306/cesizen"
JWT_SECRET="votre_secret_jwt"
PORT=3001
```

> Remplacer `USER` et `PASSWORD` par vos identifiants MySQL.  
> La base de données `cesizen` doit exister sur votre serveur MySQL.

## Base de données

```bash
# Générer le client Prisma
npx prisma generate

# Créer les tables via les migrations
npx prisma migrate dev
```

## Lancer le serveur

```bash
# Développement (hot reload)
npm run dev

# Production
npm run build
npm start
```

Le serveur tourne sur http://localhost:3001

## Tests

```bash
# Lancer tous les tests (unitaires + fonctionnels) avec rapport de couverture
npm test

# Mode watch
npm run test:watch
```

Les tests couvrent :

- `auth.controller` — register, login (unitaires)
- `exercice.controller` — CRUD exercices (unitaires)
- `POST /api/auth/register` et `POST /api/auth/login` (fonctionnels HTTP)

## Structure du projet

```
cesizen-api/
├── src/
│   ├── __tests__/        # Tests unitaires et fonctionnels
│   ├── controllers/      # Logique métier
│   ├── middlewares/      # Auth JWT, vérification rôle admin
│   ├── prisma/           # Schéma et migrations BDD
│   ├── routes/           # Définition des routes Express
│   ├── utils/            # Prisma client, génération JWT
│   ├── app.ts            # Application Express (exportée pour les tests)
│   └── index.ts          # Point d'entrée (démarre le serveur)
├── jest.config.ts
├── tsconfig.json
└── .env                  # À créer (non versionné)
```

## Routes principales

| Méthode | Route                            | Auth  | Description                     |
| ------- | -------------------------------- | ----- | ------------------------------- |
| POST    | `/api/auth/register`             | Non   | Inscription                     |
| POST    | `/api/auth/login`                | Non   | Connexion                       |
| GET     | `/api/exercices`                 | Non   | Liste des exercices actifs      |
| GET     | `/api/exercices/:id`             | Non   | Détail d'un exercice            |
| POST    | `/api/exercices`                 | Admin | Créer un exercice               |
| PUT     | `/api/exercices/:id`             | Admin | Modifier un exercice            |
| PATCH   | `/api/exercices/:id/toggle`      | Admin | Activer/désactiver              |
| DELETE  | `/api/exercices/:id`             | Admin | Supprimer                       |
| GET     | `/api/contenus`                  | Non   | Liste des contenus              |
| GET     | `/api/categories`                | Non   | Liste des catégories            |
| GET     | `/api/favoris/mes-favoris`       | User  | Mes favoris                     |
| POST    | `/api/favoris`                   | User  | Ajouter un favori               |
| GET     | `/api/historique/mon-historique` | User  | Mon historique                  |
| POST    | `/api/historique`                | User  | Enregistrer un exercice réalisé |

## Dépannage

**Erreur `prisma generate` :** lancer `npx prisma generate` avant `npm run dev`  
**Port déjà utilisé :** modifier `PORT` dans `.env`  
**Erreur de connexion MySQL :** vérifier que MySQL fonctionne et que `DATABASE_URL` est correcte
