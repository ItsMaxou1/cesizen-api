/**
 * TESTS FONCTIONNELS - Routes /api/auth
 *
 * Tests d'intégration avec Supertest : on envoie de vraies requêtes HTTP
 * à l'application Express, sans démarrer de serveur.
 * Prisma est toujours mocké pour ne pas toucher la BDD.
 *
 * Différence avec les tests unitaires :
 *  - Tests unitaires  → on teste UNE fonction isolée
 *  - Tests fonctionnels → on teste la ROUTE complète (middleware + controller)
 *
 * Commande pour lancer : npm test
 */

// ─── Mocks ───────────────────────────────────────────────────────────────────

jest.mock('../utils/prisma', () => ({
  __esModule: true,
  default: {
    utilisateur: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  },
}));

jest.mock('bcryptjs', () => ({
  hash: jest.fn().mockResolvedValue('hashed-password'),
  compare: jest.fn(),
}));

jest.mock('../utils/jwt', () => ({
  generateToken: jest.fn(() => 'fake-token'),
}));

// ─── Imports ─────────────────────────────────────────────────────────────────

import request from 'supertest';
import app from '../app';
import prisma from '../utils/prisma';
import bcrypt from 'bcryptjs';

const mockFindUnique = prisma.utilisateur.findUnique as jest.Mock;
const mockCreate = prisma.utilisateur.create as jest.Mock;
const mockCompare = bcrypt.compare as jest.Mock;

// ─── TESTS FONCTIONNELS : POST /api/auth/register ────────────────────────────

describe('POST /api/auth/register', () => {
  it('retourne 201 avec token si inscription réussie', async () => {
    // ARRANGE
    mockFindUnique.mockResolvedValue(null);
    mockCreate.mockResolvedValue({
      id: 1,
      email: 'nouveau@cesi.fr',
      nom: 'Doe',
      prenom: 'John',
      role: 'USER',
    });

    // ACT : vraie requête HTTP
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'nouveau@cesi.fr', mot_de_passe: '123456', nom: 'Doe', prenom: 'John' });

    // ASSERT
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('token', 'fake-token');
  });

  it('retourne 400 si l\'email est déjà utilisé', async () => {
    // ARRANGE : email déjà en BDD
    mockFindUnique.mockResolvedValue({ id: 1, email: 'existe@cesi.fr' });

    // ACT
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'existe@cesi.fr', mot_de_passe: '123456' });

    // ASSERT
    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Email déjà utilisé');
  });
});

// ─── TESTS FONCTIONNELS : POST /api/auth/login ───────────────────────────────

describe('POST /api/auth/login', () => {
  it('retourne 200 avec token si connexion réussie', async () => {
    // ARRANGE
    mockFindUnique.mockResolvedValue({
      id: 1,
      email: 'test@cesi.fr',
      mot_de_passe: 'hashed',
      nom: 'Doe',
      prenom: 'John',
      role: 'USER',
      isActive: true,
    });
    mockCompare.mockResolvedValue(true);

    // ACT
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@cesi.fr', mot_de_passe: '123456' });

    // ASSERT
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token', 'fake-token');
  });

  it('retourne 401 si identifiants incorrects', async () => {
    // ARRANGE
    mockFindUnique.mockResolvedValue(null);

    // ACT
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'inconnu@x.fr', mot_de_passe: 'wrong' });

    // ASSERT
    expect(res.status).toBe(401);
  });

  it('retourne 401 si le mot de passe est mauvais (non régression)', async () => {
    // ARRANGE
    mockFindUnique.mockResolvedValue({
      id: 1,
      email: 'test@cesi.fr',
      mot_de_passe: 'hashed',
      isActive: true,
    });
    mockCompare.mockResolvedValue(false); // mauvais mot de passe

    // ACT
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@cesi.fr', mot_de_passe: 'mauvais' });

    // ASSERT
    expect(res.status).toBe(401);
    expect(res.body.message).toBe('Email ou mot de passe incorrect');
  });
});
