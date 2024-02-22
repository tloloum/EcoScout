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
    id_user VARCHAR REFERENCES utilisateurs(id_user) 
);

CREATE TABLE Structure
(
    id_structure SERIAL PRIMARY KEY,
    nom_structure VARCHAR NOT NULL,
    date_creation DATE NOT NULL
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
    FOREIGN KEY id_structure REFERENCES structure(id_structure) ON DELETE CASCADE,
    FOREIGN KEY id_evenement REFERENCES evenement(id_evenement) ON DELETE CASCADE
);

CREATE TABLE Participants
(
    FOREIGN KEY id_structure REFERENCES structure(id_structure) ON DELETE CASCADE,
    FOREIGN KEY id_evenement REFERENCES evenement(id_evenement) ON DELETE CASCADE
);

CREATE TABLE Surstructure
(
    FOREIGN KEY id_structure REFERENCES structure(id_structure) ON DELETE CASCADE,
    FOREIGN KEY id_structure REFERENCES structure(id_structure) ON DELETE CASCADE
);