import { Request, Response } from 'express';
import prisma from '../utils/prisma';
import { AuthRequest } from '../middlewares/auth.middleware';

//Ajoute un historique
export const addHistorique = async (req: AuthRequest, res: Response) => {
  try {
    const { exerciceId } = req.body;
    const historique = await prisma.historiqueExercice.create({
      data: { utilisateurId: req.user!.id, exerciceId }
    });
    res.status(201).json(historique);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

//Récupère un historique spécifique
export const getMonHistorique = async (req: AuthRequest, res: Response) => {
  try {
    const historiques = await prisma.historiqueExercice.findMany({
      where: { utilisateurId: req.user!.id },
      include: { exercice: true },
      orderBy: { date_realisation: 'desc' }
    });
    res.status(200).json(historiques);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};