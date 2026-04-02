/**
 * TESTS UNITAIRES - user.controller.ts
 *
 * On teste les handlers utilisateurs en isolation (Prisma/Bcrypt mockes).
 */

jest.mock('../utils/prisma', () => ({
  __esModule: true,
  default: {
    utilisateur: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      create: jest.fn(),
    },
  },
}));

jest.mock('bcryptjs', () => ({
  hash: jest.fn(),
}));

import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import prisma from '../utils/prisma';
import {
  createAdmin,
  deleteUser,
  getAllUsers,
  getMonProfil,
  modifierMonProfil,
  toggleUserActif,
} from '../controllers/user.controller';
import { AuthRequest } from '../middlewares/auth.middleware';

const mockFindUnique = prisma.utilisateur.findUnique as jest.Mock;
const mockFindMany = prisma.utilisateur.findMany as jest.Mock;
const mockUpdate = prisma.utilisateur.update as jest.Mock;
const mockDelete = prisma.utilisateur.delete as jest.Mock;
const mockCreate = prisma.utilisateur.create as jest.Mock;
const mockHash = bcrypt.hash as jest.Mock;

const mockReqRes = (
  body: Record<string, unknown> = {},
  params: Record<string, string> = {},
  user?: { id: number; role: string }
) => {
  const req = { body, params, user } as unknown as AuthRequest;
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  } as unknown as Response;

  return { req, res };
};

describe('getMonProfil()', () => {
  it('retourne 200 avec le profil utilisateur', async () => {
    mockFindUnique.mockResolvedValue({ id: 1, email: 'a@a.fr', role: 'USER' });
    const { req, res } = mockReqRes({}, {}, { id: 1, role: 'USER' });

    await getMonProfil(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ id: 1 }));
  });

  it('retourne 500 si prisma echoue', async () => {
    mockFindUnique.mockRejectedValue(new Error('DB error'));
    const { req, res } = mockReqRes({}, {}, { id: 1, role: 'USER' });

    await getMonProfil(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Erreur serveur' });
  });
});

describe('modifierMonProfil()', () => {
  it('met a jour les champs et hash le mot de passe si fourni', async () => {
    mockHash.mockResolvedValue('hashed-password');
    mockUpdate.mockResolvedValue({ id: 1, email: 'new@a.fr', role: 'USER' });

    const { req, res } = mockReqRes(
      { email: 'new@a.fr', mot_de_passe: 'secret', nom: 'Doe', prenom: 'John' },
      {},
      { id: 1, role: 'USER' }
    );

    await modifierMonProfil(req, res);

    expect(mockHash).toHaveBeenCalledWith('secret', 10);
    expect(mockUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 1 },
        data: expect.objectContaining({
          email: 'new@a.fr',
          nom: 'Doe',
          prenom: 'John',
          mot_de_passe: 'hashed-password',
        }),
      })
    );
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it('retourne 500 si prisma echoue', async () => {
    mockUpdate.mockRejectedValue(new Error('DB error'));
    const { req, res } = mockReqRes({ email: 'new@a.fr' }, {}, { id: 1, role: 'USER' });

    await modifierMonProfil(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Erreur serveur' });
  });
});

describe('getAllUsers()', () => {
  it('retourne 200 avec tous les utilisateurs', async () => {
    mockFindMany.mockResolvedValue([{ id: 1 }, { id: 2 }]);
    const { req, res } = mockReqRes();

    await getAllUsers(req as unknown as Request, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith([{ id: 1 }, { id: 2 }]);
  });
});

describe('toggleUserActif()', () => {
  it('retourne 404 si utilisateur introuvable', async () => {
    mockFindUnique.mockResolvedValue(null);
    const { req, res } = mockReqRes({}, { id: '99' });

    await toggleUserActif(req as unknown as Request, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Utilisateur non trouvé' });
  });

  it('bascule isActive et retourne 200', async () => {
    mockFindUnique.mockResolvedValue({ id: 1, isActive: true });
    mockUpdate.mockResolvedValue({ id: 1, isActive: false });
    const { req, res } = mockReqRes({}, { id: '1' });

    await toggleUserActif(req as unknown as Request, res);

    expect(mockUpdate).toHaveBeenCalledWith(
      expect.objectContaining({ data: { isActive: false } })
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'Utilisateur désactivé' });
  });
});

describe('deleteUser()', () => {
  it('supprime un utilisateur et retourne 200', async () => {
    mockDelete.mockResolvedValue({ id: 1 });
    const { req, res } = mockReqRes({}, { id: '1' });

    await deleteUser(req as unknown as Request, res);

    expect(mockDelete).toHaveBeenCalledWith({ where: { id: 1 } });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'Utilisateur supprimé' });
  });
});

describe('createAdmin()', () => {
  it('cree un admin avec mot de passe hashe', async () => {
    mockHash.mockResolvedValue('hashed-admin');
    mockCreate.mockResolvedValue({ id: 10, email: 'admin@cesi.fr', role: 'ADMIN' });

    const { req, res } = mockReqRes({
      email: 'admin@cesi.fr',
      mot_de_passe: 'secret',
      nom: 'Boss',
      prenom: 'Big',
    });

    await createAdmin(req as unknown as Request, res);

    expect(mockHash).toHaveBeenCalledWith('secret', 10);
    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ role: 'ADMIN', mot_de_passe: 'hashed-admin' }),
      })
    );
    expect(res.status).toHaveBeenCalledWith(201);
  });
});
