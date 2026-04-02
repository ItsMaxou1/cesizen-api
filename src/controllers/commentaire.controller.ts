import { Request, Response } from 'express';
import prisma from '../utils/prisma';
import { AuthRequest } from '../middlewares/auth.middleware';

//Récupère tout les commentaires
export const getAllCommentaires = async (req: Request, res: Response) => {
  try {
    const commentaires = await prisma.commentaire.findMany({
      include: { utilisateur: { select: { id: true, nom: true, prenom: true } } }
    })
    res.status(200).json(commentaires)
  } catch {
    res.status(500).json({ message: 'Erreur serveur' })
  }
}

//Récupère les commentaires par rapport à un exercice
export const getCommentairesByExercice = async (req: Request, res: Response) => {
  try {
    const exerciceId = Number(req.params.id);
    const commentaires = await prisma.commentaire.findMany({
      where: { exerciceId },
      include: { utilisateur: { select: { id: true, nom: true, prenom: true } } }
    });
    res.status(200).json(commentaires);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

//Récupère les commentaires par rapport à un contenu
export const getCommentairesByContenu = async (req: Request, res: Response) => {
  try {
    const contenuId = Number(req.params.id);
    const commentaires = await prisma.commentaire.findMany({
      where: { contenuId },
      include: { utilisateur: { select: { id: true, nom: true, prenom: true } } }
    });
    res.status(200).json(commentaires);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

//Créer un commentaire
export const createCommentaire = async (req: AuthRequest, res: Response) => {
  try {
    const { contenu, exerciceId, contenuId } = req.body;
    const commentaire = await prisma.commentaire.create({
      data: { contenu, exerciceId, contenuId, utilisateurId: req.user!.id }
    });
    res.status(201).json(commentaire);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

//Supprime un commentaire
export const deleteCommentaire = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    await prisma.commentaire.delete({ where: { id } });
    res.status(200).json({ message: 'Commentaire supprimé' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};