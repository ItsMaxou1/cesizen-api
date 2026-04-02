// index.ts : point d'entrée du serveur
// On importe l'app depuis app.ts pour séparer la logique des routes du démarrage
import app from './app';

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Serveur lancé sur le port ${PORT}`);
});