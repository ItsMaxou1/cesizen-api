import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import prisma from '../utils/prisma';
import { generateToken } from '../utils/jwt';

export const register = async (req: Request, res: Response) => {
  try {
    const { email, mot_de_passe, nom, prenom } = req.body;

    const userExistant = await prisma.utilisateur.findUnique({
      where: { email }
    });

    if (userExistant) {
      res.status(400).json({ message: 'Email déjà utilisé' });
      return;
    }

    const hash = await bcrypt.hash(mot_de_passe, 10);

    const user = await prisma.utilisateur.create({
      data: { email, mot_de_passe: hash, nom, prenom }
    });

    const token = generateToken(user.id, user.role);

    res.status(201).json({ token, user: { id: user.id, email: user.email, nom: user.nom, prenom: user.prenom, role: user.role } });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, mot_de_passe } = req.body;

    const user = await prisma.utilisateur.findUnique({
      where: { email }
    });

    if (!user || !user.isActive) {
      res.status(401).json({ message: 'Email ou mot de passe incorrect' });
      return;
    }

    const valid = await bcrypt.compare(mot_de_passe, user.mot_de_passe);

    if (!valid) {
      res.status(401).json({ message: 'Email ou mot de passe incorrect' });
      return;
    }

    const token = generateToken(user.id, user.role);

    res.status(200).json({ token, user: { id: user.id, email: user.email, nom: user.nom, prenom: user.prenom, role: user.role } });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};