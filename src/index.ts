import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import categorieRoutes from './routes/categorie.routes';
import exerciceRoutes from './routes/exercice.routes';
import contenuRoutes from './routes/contenu.routes';
import commentaireRoutes from './routes/commentaire.routes';
import likeRoutes from './routes/like.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/categories', categorieRoutes);
app.use('/api/exercices', exerciceRoutes);
app.use('/api/contenus', contenuRoutes);
app.use('/api/commentaires', commentaireRoutes);
app.use('/api/likes', likeRoutes);


app.listen(PORT, () => {
  console.log(`Serveur lancé sur le port ${PORT}`);
});