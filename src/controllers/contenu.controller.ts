import { Request, Response } from 'express';
import prisma from '../utils/prisma';

//Récupère tout les contenus
export const getAllContenus = async (req: Request, res: Response) => {
  try {
    const contenus = await prisma.contenuInformation.findMany({
      where: { isActive: true },
      include: { categorie: true }
    });
    res.status(200).json(contenus);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

//Récupère un contenu spécifique
export const getContenuById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const contenu = await prisma.contenuInformation.findUnique({
      where: { id },
      include: { categorie: true }
    });
    if (!contenu) {
      res.status(404).json({ message: 'Contenu non trouvé' });
      return;
    }
    res.status(200).json(contenu);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

//Créer un contenu
export const createContenu = async (req: Request, res: Response) => {
  try {
    const { titre, contenu, categorieId } = req.body;
    const newContenu = await prisma.contenuInformation.create({
      data: { titre, contenu, categorieId }
    });
    res.status(201).json(newContenu);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

//Modifie un contenu
export const updateContenu = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { titre, contenu, categorieId } = req.body;
    const updated = await prisma.contenuInformation.update({
      where: { id },
      data: { titre, contenu, categorieId }
    });
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

//Désactive un contenu
export const toggleContenuActif = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const contenu = await prisma.contenuInformation.findUnique({ where: { id } });
    if (!contenu) {
      res.status(404).json({ message: 'Contenu non trouvé' });
      return;
    }
    const updated = await prisma.contenuInformation.update({
      where: { id },
      data: { isActive: !contenu.isActive }
    });
    res.status(200).json({ message: `Contenu ${updated.isActive ? 'activé' : 'désactivé'}` });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

//Supprime un contenu
export const deleteContenu = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    await prisma.contenuInformation.delete({ where: { id } });
    res.status(200).json({ message: 'Contenu supprimé' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};