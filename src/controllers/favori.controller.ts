import { Request, Response } from 'express';
import prisma from '../utils/prisma';
import { AuthRequest } from '../middlewares/auth.middleware';

//Ajoute ou Enlève un favoris
export const toggleFavori = async (req: AuthRequest, res: Response) => {
  try {
    const { exerciceId } = req.body;
    const utilisateurId = req.user!.id;

    const existingFavori = await prisma.favori.findFirst({
      where: { utilisateurId, exerciceId }
    });

    if (existingFavori) {
      await prisma.favori.delete({ where: { id: existingFavori.id } });
      res.status(200).json({ message: 'Favori retiré' });
    } else {
      await prisma.favori.create({ data: { utilisateurId, exerciceId } });
      res.status(201).json({ message: 'Favori ajouté' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

//Récupères les favoris
export const getMesFavoris = async (req: AuthRequest, res: Response) => {
  try {
    const favoris = await prisma.favori.findMany({
      where: { utilisateurId: req.user!.id },
      include: { exercice: true }
    });
    res.status(200).json(favoris);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};