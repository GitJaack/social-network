# Projet : social-network

## Description

Ce projet consiste à développer un réseau social permettant aux utilisateurs de s'inscrire, publier des articles, commenter les publications d'autres utilisateurs et liker des articles. Il est divisé en deux parties : le backend en Apollo Server avec Prisma et le frontend en utilisant React.

---

## Technologies Utilisées

### Backend

-   **Apollo Server** pour la gestion des requêtes GraphQL
-   **Prisma** pour la gestion de la base de données
-   **GraphQL Codegen** pour la génération automatique des types et des hooks
-   **JWT** pour l'authentification
-   **TypeScript** en mode strict

### Frontend

-   **React** pour le développement de l'interface utilisateur
-   **Apollo Client** pour la gestion de l'état et la communication avec le serveur
-   **GraphQL Codegen** pour la génération des types et hooks

---

## Fonctionnalités

### Authentification

-   Inscription et connexion des utilisateurs
-   Gestion des sessions utilisateur avec JWT
-   Possibilite de deconnexion

### Gestion des Articles

-   Création, lecture, modifier et suppression d'articles
-   Affichage des articles avec l'auteur, le contenu, les commentaires et les likes

### Interaction avec les Articles

-   Possibilité pour les utilisateurs de commenter les articles
-   Système de like pour les articles

### Navigation et Filtrage

-   Vue d'ensemble des derniers articles sur la page principale

---

## Installation et Démarrage

### Prérequis

-   Node.js
-   SqlLite
-   Yarn ou npm

### URLs

-   Backend : http://localhost:4000
-   Frontend : http://localhost:3000

### Configuration de l'Environnement

Assurez-vous d'avoir PostgreSQL ou une autre base supportée par Prisma.

-   Configurez votre fichier .env : DATABASE_URL="postgresql://user:password@localhost:542/nom_de_la_base"
-   JWT_SECRET="votre_secret_jwt"

### Démarrage du Projet

#### Manuellement

Installez les dépendances dans les deux répertoires (`back` et `frontend`) :

```bash
cd ./backend
npm install
cd ../frontend
npm install
```

Démarrez les deux répertoires en mode développement :

```bash
cd ./backend
npm run start
cd ../frontend
npm run start
```

---

## Auteur

Jack YE
