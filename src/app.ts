// app.ts : on exporte l'app Express sans l'écoute du port
// Cela permet aux tests d'importer l'app sans démarrer le serveur
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import categorieRoutes from './routes/categorie.routes';
import exerciceRoutes from './routes/exercice.routes';
import contenuRoutes from './routes/contenu.routes';
import commentaireRoutes from './routes/commentaire.routes';
import likeRoutes from './routes/like.routes';
import favoriRoutes from './routes/favori.routes';
import historiqueRoutes from './routes/historique.routes';

const app = express();

app.use(cors() as any);
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/categories', categorieRoutes);
app.use('/api/exercices', exerciceRoutes);
app.use('/api/contenus', contenuRoutes);
app.use('/api/commentaires', commentaireRoutes);
app.use('/api/likes', likeRoutes);
app.use('/api/favoris', favoriRoutes);
app.use('/api/historique', historiqueRoutes);

export default app;
