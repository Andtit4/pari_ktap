# Oddx - Plateforme de Paris Sportifs

Une plateforme moderne de paris sportifs construite avec Vue.js et Node.js.

## Fonctionnalités

- 🎯 Interface utilisateur moderne et intuitive
- 🔐 Authentification sécurisée
- 💰 Gestion des dépôts et retraits
- 🏆 Paris en direct sur les matchs
- 📊 Statistiques détaillées des paris
- 👤 Profil utilisateur personnalisé

## Prérequis

- Node.js (v14 ou supérieur)
- npm (v6 ou supérieur)
- MongoDB

## Installation

1. Cloner le dépôt :
```bash
git clone https://github.com/votre-username/oddx-vue.git
cd oddx-vue
```

2. Installer les dépendances :
```bash
npm install
```

3. Configurer les variables d'environnement :
```bash
cp .env.example .env
```
Modifiez les variables dans le fichier `.env` selon votre configuration.

4. Lancer l'application en mode développement :
```bash
npm run dev:full
```

## Structure du Projet

```
oddx-vue/
├── src/
│   ├── components/     # Composants Vue réutilisables
│   ├── views/          # Pages de l'application
│   ├── store/          # État global (Vuex)
│   ├── router/         # Configuration des routes
│   └── assets/         # Ressources statiques
├── server/             # Backend Node.js
│   ├── models/         # Modèles MongoDB
│   ├── routes/         # Routes API
│   └── middleware/     # Middleware Express
└── public/             # Fichiers statiques publics
```

## Scripts Disponibles

- `npm run serve` : Lance le serveur de développement
- `npm run build` : Compile l'application pour la production
- `npm run lint` : Vérifie le code avec ESLint
- `npm run dev:full` : Lance le frontend et le backend en mode développement

## Contribution

Les contributions sont les bienvenues ! N'hésitez pas à :

1. Fork le projet
2. Créer une branche pour votre fonctionnalité
3. Commiter vos changements
4. Pousser vers la branche
5. Ouvrir une Pull Request

## Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.
