/**
 * TESTS UNITAIRES - auth.middleware.ts
 *
 * On teste authMiddleware et adminMiddleware en isolation.
 */

jest.mock('../utils/jwt', () => ({
  verifyToken: jest.fn(),
}));

import { NextFunction, Response } from 'express';
import { authMiddleware, adminMiddleware, AuthRequest } from '../middlewares/auth.middleware';
import { verifyToken } from '../utils/jwt';

const mockVerifyToken = verifyToken as jest.Mock;

const mockReqResNext = (
  authorization?: string,
  user?: { id: number; role: string }
): { req: AuthRequest; res: Response; next: NextFunction } => {
  const req = {
    headers: authorization ? { authorization } : {},
    user,
  } as unknown as AuthRequest;

  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  } as unknown as Response;

  const next = jest.fn() as unknown as NextFunction;

  return { req, res, next };
};

describe('authMiddleware()', () => {
  it('retourne 401 si le header Authorization est absent', () => {
    const { req, res, next } = mockReqResNext();

    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Token manquant' });
    expect(next).not.toHaveBeenCalled();
  });

  it('retourne 401 si le format Bearer est invalide', () => {
    const { req, res, next } = mockReqResNext('Basic abc');

    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Token manquant' });
    expect(next).not.toHaveBeenCalled();
  });

  it('retourne 401 si le token est invalide', () => {
    mockVerifyToken.mockImplementation(() => {
      throw new Error('invalid');
    });

    const { req, res, next } = mockReqResNext('Bearer bad-token');

    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Token invalide' });
    expect(next).not.toHaveBeenCalled();
  });

  it('attache req.user et appelle next si le token est valide', () => {
    mockVerifyToken.mockReturnValue({ id: 7, role: 'USER' });

    const { req, res, next } = mockReqResNext('Bearer good-token');

    authMiddleware(req, res, next);

    expect(req.user).toEqual({ id: 7, role: 'USER' });
    expect(next).toHaveBeenCalledTimes(1);
    expect(res.status).not.toHaveBeenCalled();
  });
});

describe('adminMiddleware()', () => {
  it('retourne 403 si utilisateur non admin', () => {
    const { req, res, next } = mockReqResNext(undefined, { id: 1, role: 'USER' });

    adminMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ message: 'Accès refusé' });
    expect(next).not.toHaveBeenCalled();
  });

  it('appelle next si utilisateur admin', () => {
    const { req, res, next } = mockReqResNext(undefined, { id: 1, role: 'ADMIN' });

    adminMiddleware(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(res.status).not.toHaveBeenCalled();
  });
});
