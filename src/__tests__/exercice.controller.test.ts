/**
 * TESTS UNITAIRES - exercice.controller.ts
 *
 * On teste les fonctions CRUD des exercices en isolation.
 * Prisma est mocké : aucune base de données réelle n'est utilisée.
 *
 * Commande pour lancer : npm test
 */

// ─── Mock Prisma ─────────────────────────────────────────────────────────────

jest.mock('../utils/prisma', () => ({
  __esModule: true,
  default: {
    exerciceRespiration: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  },
}));

// ─── Imports ─────────────────────────────────────────────────────────────────

import {
  getAllExercices,
  getExerciceById,
  createExercice,
  toggleExerciceActif,
  deleteExercice,
} from '../controllers/exercice.controller';
import prisma from '../utils/prisma';
import { Request, Response } from 'express';

// Raccourcis vers les mocks Prisma
const mockFindMany = prisma.exerciceRespiration.findMany as jest.Mock;
const mockFindUnique = prisma.exerciceRespiration.findUnique as jest.Mock;
const mockCreate = prisma.exerciceRespiration.create as jest.Mock;
const mockUpdate = prisma.exerciceRespiration.update as jest.Mock;
const mockDelete = prisma.exerciceRespiration.delete as jest.Mock;

// ─── Helper ──────────────────────────────────────────────────────────────────

const mockReqRes = (body: object = {}, params: object = {}) => {
  const req = { body, params } as unknown as Request;
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  } as unknown as Response;
  return { req, res };
};

// Exemple d'exercice réutilisé dans les tests
const fakeExercice = {
  id: 1,
  titre: 'Cohérence cardiaque',
  description: 'Respiration rythmée',
  duree_secondes: 300,
  inspiration: 5,
  apnee: 0,
  expiration: 5,
  isActive: true,
  categorie: { id: 1, nom: 'Relaxation' },
};

// ─── TESTS : getAllExercices ──────────────────────────────────────────────────

describe('getAllExercices()', () => {
  it('retourne 200 avec la liste des exercices actifs', async () => {
    // ARRANGE
    mockFindMany.mockResolvedValue([fakeExercice]);

    const { req, res } = mockReqRes();

    // ACT
    await getAllExercices(req, res);

    // ASSERT
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith([fakeExercice]);
    // Vérifie que seuls les exercices actifs sont demandés (non régression)
    expect(mockFindMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { isActive: true } })
    );
  });

  it('retourne 500 si Prisma plante (non régression erreur serveur)', async () => {
    // ARRANGE
    mockFindMany.mockRejectedValue(new Error('DB error'));

    const { req, res } = mockReqRes();

    // ACT
    await getAllExercices(req, res);

    // ASSERT
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Erreur serveur' });
  });
});

// ─── TESTS : getExerciceById ──────────────────────────────────────────────────

describe('getExerciceById()', () => {
  it('retourne 200 avec l\'exercice si il existe', async () => {
    // ARRANGE
    mockFindUnique.mockResolvedValue(fakeExercice);

    const { req, res } = mockReqRes({}, { id: '1' });

    // ACT
    await getExerciceById(req, res);

    // ASSERT
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(fakeExercice);
  });

  it('retourne 404 si l\'exercice n\'existe pas', async () => {
    // ARRANGE : Prisma retourne null = pas trouvé
    mockFindUnique.mockResolvedValue(null);

    const { req, res } = mockReqRes({}, { id: '999' });

    // ACT
    await getExerciceById(req, res);

    // ASSERT
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Exercice non trouvé' });
  });

  it('retourne 500 si Prisma plante (non régression erreur serveur)', async () => {
    // ARRANGE
    mockFindUnique.mockRejectedValue(new Error('DB error'));

    const { req, res } = mockReqRes({}, { id: '1' });

    // ACT
    await getExerciceById(req, res);

    // ASSERT
    expect(res.status).toHaveBeenCalledWith(500);
  });
});

// ─── TESTS : createExercice ───────────────────────────────────────────────────

describe('createExercice()', () => {
  it('retourne 201 avec l\'exercice créé', async () => {
    // ARRANGE
    mockCreate.mockResolvedValue(fakeExercice);

    const { req, res } = mockReqRes({
      titre: 'Cohérence cardiaque',
      description: 'Respiration rythmée',
      duree_secondes: 300,
      inspiration: 5,
      apnee: 0,
      expiration: 5,
      categorieId: 1,
    });

    // ACT
    await createExercice(req, res);

    // ASSERT
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(fakeExercice);
  });

  it('retourne 500 si Prisma plante (non régression erreur serveur)', async () => {
    // ARRANGE
    mockCreate.mockRejectedValue(new Error('DB error'));

    const { req, res } = mockReqRes({ titre: 'Test' });

    // ACT
    await createExercice(req, res);

    // ASSERT
    expect(res.status).toHaveBeenCalledWith(500);
  });
});

// ─── TESTS : toggleExerciceActif ─────────────────────────────────────────────

describe('toggleExerciceActif()', () => {
  it('désactive un exercice actif et retourne 200', async () => {
    // ARRANGE : exercice actif → sera désactivé
    mockFindUnique.mockResolvedValue({ ...fakeExercice, isActive: true });
    mockUpdate.mockResolvedValue({ ...fakeExercice, isActive: false });

    const { req, res } = mockReqRes({}, { id: '1' });

    // ACT
    await toggleExerciceActif(req, res);

    // ASSERT
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'Exercice désactivé' });
  });

  it('retourne 404 si l\'exercice n\'existe pas (non régression toggle sur id inexistant)', async () => {
    // ARRANGE
    mockFindUnique.mockResolvedValue(null);

    const { req, res } = mockReqRes({}, { id: '999' });

    // ACT
    await toggleExerciceActif(req, res);

    // ASSERT
    expect(res.status).toHaveBeenCalledWith(404);
  });
});

// ─── TESTS : deleteExercice ───────────────────────────────────────────────────

describe('deleteExercice()', () => {
  it('supprime l\'exercice et retourne 200', async () => {
    // ARRANGE
    mockDelete.mockResolvedValue(fakeExercice);

    const { req, res } = mockReqRes({}, { id: '1' });

    // ACT
    await deleteExercice(req, res);

    // ASSERT
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'Exercice supprimé' });
  });

  it('retourne 500 si Prisma plante (non régression erreur serveur)', async () => {
    // ARRANGE
    mockDelete.mockRejectedValue(new Error('DB error'));

    const { req, res } = mockReqRes({}, { id: '1' });

    // ACT
    await deleteExercice(req, res);

    // ASSERT
    expect(res.status).toHaveBeenCalledWith(500);
  });
});
