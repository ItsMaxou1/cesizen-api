import { Request, Response } from 'express';
import prisma from '../utils/prisma';

//récupère tout les exercices
export const getAllExercices = async (req: Request, res: Response) => {
  try {
    const exercices = await prisma.exerciceRespiration.findMany({
      where: { isActive: true },
      include: { categorie: true }
    });
    res.status(200).json(exercices);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

//Récupère un exercice spécifique
export const getExerciceById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const exercice = await prisma.exerciceRespiration.findUnique({
      where: { id },
      include: { categorie: true }
    });
    if (!exercice) {
      res.status(404).json({ message: 'Exercice non trouvé' });
      return;
    }
    res.status(200).json(exercice);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

//Créer un exercice
export const createExercice = async (req: Request, res: Response) => {
  try {
    const { titre, description, duree_secondes, inspiration, apnee, expiration, categorieId, type = 'bulle' } = req.body;
    const exercice = await prisma.exerciceRespiration.create({
      data: { titre, description, duree_secondes, inspiration, apnee, expiration, categorieId, type }
    });
    res.status(201).json(exercice);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

//Modifie un exercice
export const updateExercice = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { titre, description, duree_secondes, inspiration, apnee, expiration, categorieId, type = 'bulle' } = req.body;
    const exercice = await prisma.exerciceRespiration.update({
      where: { id },
      data: { titre, description, duree_secondes, inspiration, apnee, expiration, categorieId, type }
    });
    res.status(200).json(exercice);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

//Désactive un exercice
export const toggleExerciceActif = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const exercice = await prisma.exerciceRespiration.findUnique({ where: { id } });
    if (!exercice) {
      res.status(404).json({ message: 'Exercice non trouvé' });
      return;
    }
    const updated = await prisma.exerciceRespiration.update({
      where: { id },
      data: { isActive: !exercice.isActive }
    });
    res.status(200).json({ message: `Exercice ${updated.isActive ? 'activé' : 'désactivé'}` });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

//Supprime un exercice
export const deleteExercice = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    await prisma.exerciceRespiration.delete({ where: { id } });
    res.status(200).json({ message: 'Exercice supprimé' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};