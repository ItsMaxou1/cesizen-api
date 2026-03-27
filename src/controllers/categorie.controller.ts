import { Request, Response } from 'express';
import prisma from '../utils/prisma';

export const getAllCategories = async (req: Request, res: Response) => {
  try {
    const categories = await prisma.categorie.findMany();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

export const getCategorieById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const categorie = await prisma.categorie.findUnique({ where: { id } });
    if (!categorie) {
      res.status(404).json({ message: 'Catégorie non trouvée' });
      return;
    }
    res.status(200).json(categorie);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

export const createCategorie = async (req: Request, res: Response) => {
  try {
    const { nom, description } = req.body;
    const categorie = await prisma.categorie.create({ data: { nom, description } });
    res.status(201).json(categorie);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

export const updateCategorie = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { nom, description } = req.body;
    const categorie = await prisma.categorie.update({ where: { id }, data: { nom, description } });
    res.status(200).json(categorie);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

export const deleteCategorie = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);;
    await prisma.categorie.delete({ where: { id } });
    res.status(200).json({ message: 'Catégorie supprimée' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};