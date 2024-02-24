CREATE TABLE Utilisateurs
(
    id_user SERIAL PRIMARY KEY,
    mdp VARCHAR(50) NOT NULL
    --lien
);

CREATE TABLE Adherents
(
    id_adherent SERIAL PRIMARY KEY,
    nom_ad VARCHAR NOT NULL,
    prenom_ad VARCHAR NOT NULL,
    mail_ad VARCHAR NOT NULL,
    id_user VARCHAR REFERENCES Utilisateurs(id_user) 
);

--Plus de table surstructure car modif de la cardinalité => on ne peut pas être dans plusieurs structures plus grande différentes => c'est un arbre"

CREATE TABLE Structure
(
    id_structure SERIAL PRIMARY KEY,
    nom_structure VARCHAR NOT NULL,
    date_creation DATE NOT NULL,
    id_structure_mere INTEGER REFERENCES Structure(id_structure) -- ON CASCADE ???
);

CREATE TABLE Evenements
(
    id_evenement SERIAL PRIMARY KEY,
    nom_evenement VARCHAR NOT NULL,
    lieu VARCHAR NOT NULL,
    duree_evenement FLOAT NOT NULL,
    descr VARCHAR NOT NULL,
    image_data LONGBLOB,
    date_debut DATE NOT NULL
);

CREATE TABLE Organisateurs
(
    FOREIGN KEY id_structure REFERENCES Structure(id_structure) ON DELETE CASCADE,
    FOREIGN KEY id_evenement REFERENCES Evenements(id_evenement) ON DELETE CASCADE
);

CREATE TABLE Participants
(
    FOREIGN KEY id_structure REFERENCES Structure(id_structure) ON DELETE CASCADE,
    FOREIGN KEY id_evenement REFERENCES Evenements(id_evenement) ON DELETE CASCADE
);

CREATE TABLE Trajets
(
    id_badge SERIAL PRIMARY KEY,
    distance FLOAT NOT NULL,
    date_trajet DATE NOT NULL,
    vehicule VARCHAR NOT NULL, --A voir comment on s'occupe du véhicule => VARCHAR??
    impact FLOAT NOT NULL,
    nb_passagers INTEGER NOT NUll,
    FOREIGN KEY id_evenement REFERENCES Evenements(id_evenement) ON DELETE CASCADE
    --vraiment lié à l'adhérent? pcq pas de liaison dans le conceptuel alors que dans le relationnel oui. Si oui rajouter:
    --FOREIGN KEY id_adherent REFERENCES Adherents(id_adherent) ON DELETE CASCADE
);

CREATE TABLE Badges
(
    id_badge SERIAL PRIMARY KEY,
    nom_badge VARCHAR NOT NULL,
    --icone => voir comment ca marche pour les images
    description_badge VARCHAR, --NOT NULL?
    date_badge_obtenu DATE NOT NULL,
    statut BOOLEAN NOT NULL --pas compris le statut c'est ça?
    FOREIGN KEY id_adherent REFERENCES Adherents(id_adherent) ON DELETE CASCADE,
    FOREIGN KEY id_structure REFERENCES Structure(id_structure) ON DELETE CASCADE
);

CREATE TABLE Defis
(
    id_defi SERIAL PRIMARY KEY,
    description_defi VARCHAR, --NOT NULL?
    FOREIGN KEY id_badge REFERENCES Badges(id_badge) DELETE ON CASCADE,
    FOREIGN KEY id_evenement REFERENCES Evenements(id_evenement) DELETE ON CASCADE
);

CREATE TABLE Admin
(
    id_admin SERIAL PRIMARY KEY,
    debut_mandat DATE NOT NULL,
    FOREIGN KEY id_structure REFERENCES Structures(id_structure) DELETE ON CASCADE,
    FOREIGN KEY id_adherent REFERENCES Adherents(id_adherent) DELETE ON CASCADE
);