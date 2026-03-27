import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import prisma from '../utils/prisma';
import { AuthRequest } from '../middlewares/auth.middleware';

export const getMonProfil = async (req: AuthRequest, res: Response) => {
  try {
    const user = await prisma.utilisateur.findUnique({
      where: { id: req.user!.id },
      select: { id: true, email: true, nom: true, prenom: true, role: true, date_creation: true }
    });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

export const modifierMonProfil = async (req: AuthRequest, res: Response) => {
  try {
    const { email, mot_de_passe, nom, prenom } = req.body;
    const data: any = {};

    if (email) data.email = email;
    if (nom) data.nom = nom;
    if (prenom) data.prenom = prenom;
    if (mot_de_passe) data.mot_de_passe = await bcrypt.hash(mot_de_passe, 10);

    const user = await prisma.utilisateur.update({
      where: { id: req.user!.id },
      data,
      select: { id: true, email: true, nom: true, prenom: true, role: true }
    });

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.utilisateur.findMany({
      select: { id: true, email: true, nom: true, prenom: true, role: true, isActive: true, date_creation: true }
    });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

export const toggleUserActif = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const user = await prisma.utilisateur.findUnique({ where: { id } });

    if (!user) {
      res.status(404).json({ message: 'Utilisateur non trouvé' });
      return;
    }

    const updated = await prisma.utilisateur.update({
      where: { id },
      data: { isActive: !user.isActive }
    });

    res.status(200).json({ message: `Utilisateur ${updated.isActive ? 'activé' : 'désactivé'}` });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    await prisma.utilisateur.delete({ where: { id } });
    res.status(200).json({ message: 'Utilisateur supprimé' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};