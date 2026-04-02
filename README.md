# CESIZen API

API REST backend du projet CESIZen. Construite avec **Node.js**, **Express**, **TypeScript**, **Prisma** et **MySQL**.

## Prérequis

- [Node.js](https://nodejs.org/) v18+
- [MySQL](https://www.mysql.com/) (base de données)
- npm

## Installation

```bash
# 1. Cloner le projet
git clone https://github.com/ItsMaxou1/cesizen-api.git
cd cesizen-api

# 2. Se mettre sur la branche develop
git checkout develop

# 3. Installer les dépendances
npm install
```

## Configuration

Créer un fichier `.env` à la racine du projet :

```env
DATABASE_URL="mysql://USER:PASSWORD@localhost:3306/cesizen"
JWT_SECRET="votre_secret_jwt"
PORT=3001
```

> Remplacer `USER`, `PASSWORD` par vos identifiants MySQL.

## Base de données

```bash
# Générer le client Prisma
npx prisma generate

# Appliquer les migrations
npx prisma migrate dev
```

## Lancer le serveur

```bash
# Mode développement (avec hot reload)
npm run dev

# Mode production
npm run build
npm start
```

Le serveur tourne sur `http://localhost:3001`.

## Tests

```bash
# Lancer tous les tests unitaires et fonctionnels
npm test

# Mode watch (relance automatiquement à chaque modification)
npm run test:watch
```

Les tests couvrent :

- `auth.controller` — register, login (tests unitaires)
- `exercice.controller` — CRUD exercices (tests unitaires)
- `POST /api/auth/register` et `POST /api/auth/login` (tests fonctionnels HTTP)

## Structure du projet

```
src/
├── __tests__/          # Tests unitaires et fonctionnels
├── controllers/        # Logique métier (auth, exercices, contenus...)
├── middlewares/        # Authentification JWT, rôle admin
├── prisma/             # Schéma et migrations de la base de données
├── routes/             # Définition des routes Express
├── utils/              # Prisma client, JWT helpers
├── app.ts              # Application Express (sans listen)
└── index.ts            # Point d'entrée (démarre le serveur)
```

## Routes principales

| Méthode | Route                            | Auth  | Description          |
| ------- | -------------------------------- | ----- | -------------------- |
| POST    | `/api/auth/register`             | Non   | Inscription          |
| POST    | `/api/auth/login`                | Non   | Connexion            |
| GET     | `/api/exercices`                 | Non   | Liste des exercices  |
| GET     | `/api/exercices/:id`             | Non   | Détail d'un exercice |
| POST    | `/api/exercices`                 | Admin | Créer un exercice    |
| GET     | `/api/contenus`                  | Non   | Liste des contenus   |
| GET     | `/api/favoris/mes-favoris`       | User  | Mes favoris          |
| GET     | `/api/historique/mon-historique` | User  | Mon historique       |
