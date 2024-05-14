## Introduction

**EcoScout** est une application web développée dans le cadre d'un Projet au Fil de l'Année (PFA) à l'ENSEIRB-MATMECA de Talence, pour l'année scolaire 2023/2024. L'objectif de ce projet est d'encourager chaque membre et structure à réduire son impact sur le climat à travers le suivi et l'amélioration de leurs actions écologiques. Bien que conçue initialement pour les Scouts et Guides de France, EcoScout vise à être accessible à toute organisation désireuse de diminuer son empreinte écologique.

Le projet est open source et disponible sur GitHub à l'adresse suivante : [EcoScout GitHub](https://github.com/tloloum/EcoScout)
# EcoScout

Ce projet vise à développer une application informatique permettant d’inciter chaque adhérent et chaque structure à limiter son impact sur le climat, notamment en mesurant les progrès réalisés au travers de différentes actions.

## Server

## Manuel d'utilisation de l'application

### Étape 1: Configuration

Cette section décrit les étapes préliminaires nécessaires pour lancer l'application en local. Assurez-vous d'avoir téléchargé npm au préalable.

Vous pouvez cloner ce dépôt avec la commande suivante : 

```bash
git clone https://github.com/tloloum/EcoScout.git
```

**Configuration de la base de données :**
Pour faire fonctionner le serveur, vous devez configurer votre base de donnée *MySQL* en local et remplir le fichier **./server/config/db_config.js** : 
```js
module.exports = {
    HOST: 'localhost',
    USER: '', // votre user (n'oubliez pas de lui mettre les droits d'utilisation MySQL)
    PASSWWORD: '', // votre mdp (qui peut être nul)
    DB: '' // le nom de votre base de donnée
};

**Installation des dépendances :**
- Exécutez `npm install` dans les dossiers "front" et "server".

**Lancement du front et du back :**
- Exécutez `npm start` dans les dossiers "front" et "server".

Une fois le serveur lancé, saisissez dans la barre de recherche d'un nouvel onglet :
http://localhost:3000/impact/fillname

Cela permet de récupérer les données de l'ADEM qui permettent de calculer des impacts plus tard.

### Étape 2: Utilisation de l'application

**Création du compte :**
Une fois le front et le back lancés, vous arrivez sur la page de connexion. Commencez par créer un compte et renseigner le type de compte (compte parent, personnel...). Une fois le compte créé, renseignez les nom et prénom de l'adhérent. Vous avez désormais accès à un adhérent.

**Création d'une structure :**
Pour créer une structure, cliquez sur "Utilisateur" en bas à gauche de la barre latérale, puis sur le symbole plus (+) à côté de "Structures". Renseignez ensuite les informations sur la structure avant d'appuyer sur "créer". Une fois cela fait, vous pouvez sélectionner dans "Utilisateur" à quel compte vous voulez vous connecter : une structure parmi vos structures, ou un adhérent parmi vos adhérents.

**Rejoindre une structure :**
Pour rejoindre une structure en tant qu'adhérent, sélectionnez votre compte adhérent, puis cliquez sur "rejoindre une structure" en haut à gauche de votre barre latérale. Renseignez le nom de la structure que vous souhaitez rejoindre, puis appuyez sur "entrée". Si la structure que vous recherchez existe, un bouton apparaît. Cliquez dessus, puis appuyez sur "rejoindre". Cela crée une demande pour rejoindre la structure.

**Accepter un adhérent dans une structure :**
Depuis votre compte structure, cliquez sur le bouton en bas à droite "Gérer les membres", puis sur "Demandes en attente". Vous accédez à vos demandes en attente et pouvez les accepter ou les refuser.

**Créer un événement :**
Pour créer un événement, connectez-vous en tant que structure, puis dans l'onglet "événement", cliquez sur "Ajouter un événement" et renseignez le formulaire.

**Ajouter son impact à l'événement :**
Pour ajouter un impact aux événements, connectez-vous en tant qu'adhérent appartenant à la structure organisant l'événement. Cliquez sur "Ajouter un impact", renseignez votre impact parmi ceux disponibles dans la base de données de l'ADEM, puis remplissez le formulaire associé. Une fois cela fait, les impacts sont calculés et ajoutés à l'événement.

**Définir une structure en tant que structure parent :**
Connectez-vous en tant que structure, cliquez en bas à droite sur le bouton "Gérer les membres", puis sur "Gérer la hiérarchie". Renseignez la structure parente de la même manière que pour rejoindre une structure. Il ne s'agit pas d'une demande, vous définissez directement la structure comme parente.

**Suppression d'une structure / d'un adhérent :**
Dans la barre latérale, sous "Utilisateur", cliquez sur le moins (-) à côté de "structure" ou "adhérent", puis sur le moins à côté du compte que vous voulez supprimer.

**Modification des informations d'un adhérent :**
En haut de la page, cliquez sur "Modifier", à côté de votre nom et prénom. Renseignez les nouvelles informations, puis cliquez sur "Soumettre".



# License 
GPL-3.0 license