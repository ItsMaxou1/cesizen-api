/**
 * TESTS UNITAIRES - auth.controller.ts
 *
 * On teste les fonctions register() et login() en isolation totale.
 * Pour ça, on "mock" (simule) toutes les dépendances externes :
 *  - prisma : la base de données (on ne veut pas d'une vraie BDD dans les tests)
 *  - bcryptjs : le hachage de mot de passe
 *  - jwt : la génération de token
 *
 * Commande pour lancer : npm test
 */

// ─── Mocks (à déclarer AVANT les imports des controllers) ───────────────────

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
  hash: jest.fn(),
  compare: jest.fn(),
}));

jest.mock('../utils/jwt', () => ({
  generateToken: jest.fn(() => 'fake-token'),
}));

// ─── Imports ─────────────────────────────────────────────────────────────────

import { register, login } from '../controllers/auth.controller';
import prisma from '../utils/prisma';
import bcrypt from 'bcryptjs';
import { Request, Response } from 'express';

// Raccourcis pour accéder aux mocks Prisma plus facilement
const mockFindUnique = prisma.utilisateur.findUnique as jest.Mock;
const mockCreate = prisma.utilisateur.create as jest.Mock;
const mockHash = bcrypt.hash as jest.Mock;
const mockCompare = bcrypt.compare as jest.Mock;

// ─── Helper : crée un faux req/res Express ───────────────────────────────────

const mockReqRes = (body: object) => {
  const req = { body } as Request;
  const res = {
    status: jest.fn().mockReturnThis(), // permet d'écrire res.status(200).json(...)
    json: jest.fn(),
  } as unknown as Response;
  return { req, res };
};

// ─── TESTS : register ────────────────────────────────────────────────────────

describe('register()', () => {
  it('crée un utilisateur et retourne 201 avec un token', async () => {
    // ARRANGE : on prépare les données simulées
    mockFindUnique.mockResolvedValue(null); // aucun utilisateur existant
    mockHash.mockResolvedValue('hashed-password');
    mockCreate.mockResolvedValue({
      id: 1,
      email: 'test@cesi.fr',
      nom: 'Doe',
      prenom: 'John',
      role: 'USER',
    });

    const { req, res } = mockReqRes({
      email: 'test@cesi.fr',
      mot_de_passe: '123456',
      nom: 'Doe',
      prenom: 'John',
    });

    // ACT : on appelle la vraie fonction
    await register(req, res);

    // ASSERT : on vérifie le résultat attendu
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ token: 'fake-token' })
    );
  });

  it('retourne 400 si l\'email est déjà utilisé', async () => {
    // ARRANGE : l'utilisateur existe déjà
    mockFindUnique.mockResolvedValue({ id: 1, email: 'test@cesi.fr' });

    const { req, res } = mockReqRes({
      email: 'test@cesi.fr',
      mot_de_passe: '123456',
    });

    // ACT
    await register(req, res);

    // ASSERT
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Email déjà utilisé' });
  });

  it('retourne 500 si Prisma plante (non régression erreur serveur)', async () => {
    // ARRANGE : Prisma lève une exception
    mockFindUnique.mockRejectedValue(new Error('DB error'));

    const { req, res } = mockReqRes({ email: 'x@x.fr', mot_de_passe: '123' });

    // ACT
    await register(req, res);

    // ASSERT
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Erreur serveur' });
  });
});

// ─── TESTS : login ───────────────────────────────────────────────────────────

describe('login()', () => {
  it('retourne 200 avec un token si les identifiants sont corrects', async () => {
    // ARRANGE
    mockFindUnique.mockResolvedValue({
      id: 1,
      email: 'test@cesi.fr',
      mot_de_passe: 'hashed-password',
      nom: 'Doe',
      prenom: 'John',
      role: 'USER',
      isActive: true,
    });
    mockCompare.mockResolvedValue(true); // mot de passe correct

    const { req, res } = mockReqRes({
      email: 'test@cesi.fr',
      mot_de_passe: '123456',
    });

    // ACT
    await login(req, res);

    // ASSERT
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ token: 'fake-token' })
    );
  });

  it('retourne 401 si l\'utilisateur n\'existe pas', async () => {
    // ARRANGE : aucun utilisateur trouvé
    mockFindUnique.mockResolvedValue(null);

    const { req, res } = mockReqRes({ email: 'inconnu@x.fr', mot_de_passe: '123' });

    // ACT
    await login(req, res);

    // ASSERT
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Email ou mot de passe incorrect' });
  });

  it('retourne 401 si le compte est désactivé (isActive = false)', async () => {
    // ARRANGE : utilisateur trouvé mais désactivé
    mockFindUnique.mockResolvedValue({
      id: 2,
      email: 'ban@x.fr',
      mot_de_passe: 'hashed',
      isActive: false,
    });

    const { req, res } = mockReqRes({ email: 'ban@x.fr', mot_de_passe: '123' });

    // ACT
    await login(req, res);

    // ASSERT
    expect(res.status).toHaveBeenCalledWith(401);
  });

  it('retourne 401 si le mot de passe est incorrect', async () => {
    // ARRANGE
    mockFindUnique.mockResolvedValue({
      id: 1,
      email: 'test@cesi.fr',
      mot_de_passe: 'hashed',
      isActive: true,
    });
    mockCompare.mockResolvedValue(false); // mauvais mot de passe

    const { req, res } = mockReqRes({ email: 'test@cesi.fr', mot_de_passe: 'wrong' });

    // ACT
    await login(req, res);

    // ASSERT
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Email ou mot de passe incorrect' });
  });

  it('retourne 500 si Prisma plante (non régression erreur serveur)', async () => {
    // ARRANGE
    mockFindUnique.mockRejectedValue(new Error('DB crash'));

    const { req, res } = mockReqRes({ email: 'x@x.fr', mot_de_passe: '123' });

    // ACT
    await login(req, res);

    // ASSERT
    expect(res.status).toHaveBeenCalledWith(500);
  });
});
