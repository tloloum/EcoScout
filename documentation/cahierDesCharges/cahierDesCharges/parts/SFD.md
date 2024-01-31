# Exigences

- Appli qui : 
	- **Avoir des utilisateurs** (comptes)
	- permet de **rentrer des dépenses carbones**, ==commun/individuel==
		- trajet (*priorité 1*)
	- **faire des groupes** de personnes/unité
		- via des invitations, un admin
		- relation entre utilisateurs 
		- relation entre groupe, ==différentes tailles==
	- **calcule l'impact** -> sous forme de défis
		- avec la BDD de l'ADEM
	- systeme de badge
		- *secondaire*
	- **organisation d'evenement**
		- we de groupe
		- ...
	- **Statistique d'un evenement/groupe/personnes**
- Avec un côté ludique 
- premièrement en web -> puis sur telephone

| **Fonctionnalité** | Description | Complexité | Priorité | Justification |
| ---- | ---- | ---- | ---- | ---- |
| **Creez un compte** | Définir un utilisateur (nom, prénom, ... ) | *Simple* | ==indispensable== | création de bdd |
| **Faire des groupes** | Rejoindre plusieurs utilisateurs, avec un/des administrateur(s) qui a le droit de modification (supression de données non valables) | *Simple* | ==indispensable== | Bdd |
| **Organisation d'evenements** | Définir un evenement sur un durée fixe et rajouter des utilisateurs/groupes dans cet evenement | *Moyen* | ==important== |  |
| **Lien d'invitation dans un groupe** | Permettre a un administrateur d'inviter des utilisateurs dans un groupe | *Moyen* | ==indispensable== |  |
| **Definir un evenement public/privé** | Permettre a des personnes de s'ajouter sans invitation a un evenement/groupe | *Moyen* | ==secondaire==, *a proposer* |  |
| **Calcul de l'impact** | Calculer l'impact ecologique d'un groupe/d'une personne/d'un evenements. Sur un temps choisi/ une action particulière (ex: le trajet) | *Difficile* | ==important== |  |
| **Ajout d'un impact ecologique** | Un utilisateur/un groupe peut rajouter des actions qui ont un impact écologique | *Moyen* | ==indispensable== |  |
| **Rechercher une action qui a un impact écologique** | Rechercher une action pour la rajouter dans les impact d'un utilisateur/groupe/evenements | *Simple/Moyen* | ==important== | utilisation de la bdd de l'ADEM |
| **Côté ludique (badge,...)** | Rajout d'un côté ludique à l'application, et ne pas donner un aspect de compétition | *Difficile* | ==secondaire== | ensemble de fonctionnalités secondaires, complexité difficile a calculer |
| **Statistiques globales(progression sur le temps, impacts des actions)** | Calcul des statistiques globales d'un groupes/evenements. (moyennes, comparaison sur le temps,...) | *Moyen* | ==important -== |  |
| **Suppression d'un groupe/evements** | Capacité de pouvoir supprimer un groupe/evenements par un administrateurs de celui-ci | *Facile* | ==important== |  |
| **Suppression automatique (evements/groupe trop ancien/passé)** | Suppression automatique des evenements ou des groupes dont l'activité est inexistante depuis trop longtemps | *Moyen* | ==secondaire== |  |
| **Ajout de droits sur un groupe** | L'administrateur initial d'un groupe ou d'un evenements peut rajouter des droits a certains utilisateurs sur ce groupe | *Facile* | == |  |

