import { Request, Response } from 'express';
import prisma from '../utils/prisma';
import { AuthRequest } from '../middlewares/auth.middleware';

//Ajoute ou Enlève un like
export const toggleLike = async (req: AuthRequest, res: Response) => {
  try {
    const { exerciceId, contenuId } = req.body;
    const utilisateurId = req.user!.id;

    const existingLike = await prisma.like.findFirst({
      where: { utilisateurId, exerciceId, contenuId }
    });

    if (existingLike) {
      await prisma.like.delete({ where: { id: existingLike.id } });
      res.status(200).json({ message: 'Like retiré' });
    } else {
      await prisma.like.create({ data: { utilisateurId, exerciceId, contenuId } });
      res.status(201).json({ message: 'Like ajouté' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

//Récupères le nombre de likes par rapport à un exercice
export const getLikesByExercice = async (req: Request, res: Response) => {
  try {
    const exerciceId = Number(req.params.id);
    const count = await prisma.like.count({ where: { exerciceId } });
    res.status(200).json({ count });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

//Récupère le nombre de likes par rapport à un contenu
export const getLikesByContenu = async (req: Request, res: Response) => {
  try {
    const contenuId = Number(req.params.id);
    const count = await prisma.like.count({ where: { contenuId } });
    res.status(200).json({ count });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};