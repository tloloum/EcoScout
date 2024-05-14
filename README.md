# EcoScout

Ce projet vise à développer une application informatique permettant d’inciter chaque adhérent et chaque structure à limiter son impact sur le climat, notamment en mesurant les progrès réalisés au travers de différentes actions.

---

## Manuel d'utilisation de l'application

### Étape 1: Configuration

Cette section décrit les étapes préliminaires nécessaires pour lancer l'application en local. Assurez-vous d'avoir téléchargé npm au préalable.

**Configuration de la base de données :**
- Créez un utilisateur test dans MySQL.
- Créez une base de données nommée "pfa" dans MySQL.
- Utilisez le fichier create.sql (`src/server/bdd/sql/create.sql`) pour configurer la base de données.
- N'utilisez pas de mot de passe pour cette base de données (les détails sont dans `src/server/config/db_config.js`).

**Installation des dépendances :**
- Exécutez `npm install` dans les dossiers "front" et "server".

**Lancement du front et du back :**
- Exécutez `npm start` dans les dossiers "front" et "server" (2 processus nécessaires).

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


# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
