// index.ts : point d'entrée du serveur
// dotenv DOIT être chargé AVANT tout import pour que DATABASE_URL soit disponible
import dotenv from 'dotenv';
dotenv.config();

import app from './app';

const missingEnv = ['DATABASE_URL', 'JWT_SECRET'].filter((key) => !process.env[key]);
if (missingEnv.length > 0) {
  console.error(`Variables d'environnement manquantes: ${missingEnv.join(', ')}`);
  process.exit(1);
}

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Serveur lancé sur le port ${PORT}`);
});