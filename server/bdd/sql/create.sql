CREATE TABLE Utilisateurs
(
    id_user SERIAL PRIMARY KEY,
    mdp VARCHAR(50) NOT NULL
);

CREATE TABLE Adherents
(
    id_adherent SERIAL PRIMARY KEY,
    nom_ad VARCHAR(255) NOT NULL,
    prenom_ad VARCHAR(255) NOT NULL,
    mail_ad VARCHAR(255) NOT NULL,
    id_user INTEGER,
    FOREIGN KEY (id_user) REFERENCES Utilisateurs(id_user) ON DELETE CASCADE
);


CREATE TABLE Structure
(
    id_structure SERIAL PRIMARY KEY,
    nom_structure VARCHAR(255) NOT NULL,
    date_creation DATE NOT NULL,
    id_structure_mere INTEGER REFERENCES Structure(id_structure) ON DELETE CASCADE,
);

CREATE TABLE Evenements
(
    id_evenement SERIAL PRIMARY KEY,
    nom_evenement VARCHAR(255) NOT NULL,
    lieu VARCHAR(255) NOT NULL,
    duree_evenement FLOAT NOT NULL,
    descr VARCHAR(255) NOT NULL,
    image_data LONGBLOB,
    date_debut DATE NOT NULL
);

CREATE TABLE Organisateurs
(
    id_structure INTEGER,
    FOREIGN KEY (id_structure) REFERENCES Structure(id_structure) ON DELETE CASCADE,
    id_evenement INTEGER,
    FOREIGN KEY (id_evenement) REFERENCES Evenements(id_evenement) ON DELETE CASCADE
);

CREATE TABLE Participants
(
    id_structure INTEGER,
    FOREIGN KEY (id_structure) REFERENCES Structure(id_structure) ON DELETE CASCADE,
    id_evenement INTEGER,
    FOREIGN KEY (id_evenement) REFERENCES Evenements(id_evenement) ON DELETE CASCADE
);

CREATE TABLE Trajets
(
    id_badge SERIAL PRIMARY KEY,
    distance FLOAT NOT NULL,
    date_trajet DATE NOT NULL,
    vehicule VARCHAR(255) NOT NULL,
    impact FLOAT NOT NULL,
    nb_passagers INTEGER NOT NUll,
    id_evenement INTEGER,
    FOREIGN KEY (id_evenement) REFERENCES Evenements(id_evenement) ON DELETE CASCADE,
    id_adherent INTEGER,
    FOREIGN KEY (id_adherent) REFERENCES Adherents(id_adherent) ON DELETE CASCADE
);

CREATE TABLE Badges
(
    id_badge SERIAL PRIMARY KEY,
    nom_badge VARCHAR(255) NOT NULL,
    /*icone => voir comment ca marche pour les images*/
    description_badge VARCHAR(255),
    date_badge_obtenu DATE NOT NULL,
    statut BOOLEAN NOT NULL,
    id_adherent INTEGER,
    FOREIGN KEY (id_adherent) REFERENCES Adherents(id_adherent) ON DELETE CASCADE,
    id_structure INTEGER,
    FOREIGN KEY (id_structure) REFERENCES Structure(id_structure) ON DELETE CASCADE
);

CREATE TABLE Defis
(
    id_defi SERIAL PRIMARY KEY,
    description_defi VARCHAR(255) NOT NULL,
    id_badge INTEGER,
    FOREIGN KEY (id_badge) REFERENCES Badges(id_badge) ON DELETE CASCADE,
    id_evenement INTEGER, 
    FOREIGN KEY (id_evenement) REFERENCES Evenements(id_evenement) ON DELETE CASCADE
);

CREATE TABLE Admin
(
    id_admin SERIAL PRIMARY KEY,
    debut_mandat DATE NOT NULL,
    id_structure INTEGER,
    FOREIGN KEY id_structure REFERENCES Structures(id_structure) ON DELETE CASCADE,
    id_adherent INTEGER,
    FOREIGN KEY id_adherent REFERENCES Adherents(id_adherent) ON DELETE CASCADE
);