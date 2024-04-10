## Introduction

**EcoScout** est une application web développée dans le cadre d'un Projet au Fil de l'Année (PFA) à l'ENSEIRB-MATMECA de Talence, pour l'année scolaire 2023/2024. L'objectif de ce projet est d'encourager chaque membre et structure à réduire son impact sur le climat à travers le suivi et l'amélioration de leurs actions écologiques. Bien que conçue initialement pour les Scouts et Guides de France, EcoScout vise à être accessible à toute organisation désireuse de diminuer son empreinte écologique.

Le projet est open source et disponible sur GitHub à l'adresse suivante : [EcoScout GitHub](https://github.com/tloloum/EcoScout)
# EcoScout

Ce projet vise à développer une application informatique permettant d’inciter chaque adhérent et chaque structure à limiter son impact sur le climat, notamment en mesurant les progrès réalisés au travers de différentes actions.

# Requirement and installation 

Vous pouvez clonez ce dépôts avec la commande suivante : 

```bash
git clone https://github.com/tloloum/EcoScout.git
```

## Server

Pour faire fonctionner le serveur, vous devez configurer votre base de donnée *MySQL* en local et remplir le fichier **./server/config/db_config.js** : 
```js
module.exports = {
    HOST: 'localhost',
    USER: '', // votre user (n'oubliez pas de lui mettre les droits d'utilisation MySQL)
    PASSWWORD: '', // votre mdp (qui peut être nul)
    DB: '' // le nom de votre base de donnée
};
```
Puis depuis le dépôts : 
```bash
cd ./server
npm install 
npm start
```
Le serveur devrait être accessible à l'adresse : http://locahost:3000

## Front

*Après avoir lancé le serveur*, depuis le dépôts 
```bash
cd ./front
npm install 
npm start # suivre les intructions sur le terminal si nécessaire
```
L'interface web devrait être accessible à l'adresse : http://localhost:3001

# License 
GPL-3.0 license