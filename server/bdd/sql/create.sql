CREATE TABLE Utilisateurs
(
    id_user INTEGER PRIMARY KEY AUTO_INCREMENT,
    mail_ad VARCHAR(255) NOT NULL UNIQUE,
    mdp VARCHAR(255) NOT NULL
);

/*@block*/ 
CREATE TABLE Adherents
(
    id_adherent INTEGER AUTO_INCREMENT PRIMARY KEY ,
    nom_ad VARCHAR(255) NOT NULL,
    prenom_ad VARCHAR(255) NOT NULL,
    id_user INTEGER,
    FOREIGN KEY (id_user) REFERENCES Utilisateurs(id_user) ON DELETE CASCADE
);

/* @block  */
CREATE TABLE Structur /* car Structure est un truc déja implémenté*/
(
    id_structur INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    nom_structure VARCHAR(255) NOT NULL,
    date_creation DATE NOT NULL,
    id_structur_mere INTEGER UNSIGNED,
    FOREIGN KEY (id_structur_mere) REFERENCES Structur(id_structur) ON DELETE CASCADE, 
    id_owner INTEGER NOT NULL UNIQUE,
    FOREIGN KEY (id_owner) REFERENCES Utilisateurs(id_user) ON DELETE CASCADE,
    id_admin INTEGER,
    FOREIGN KEY (id_admin) REFERENCES Adherents(id_adherent) ON DELETE CASCADE
);

/* --@block  */
CREATE TABLE Evenements
(
    id_evenement INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    nom_evenement VARCHAR(255) NOT NULL,
    lieu VARCHAR(255) NOT NULL,
    duree_evenement FLOAT NOT NULL,
    descr VARCHAR(255) NOT NULL,
    image_data LONGBLOB,
    date_debut DATE NOT NULL
);

/* --@block  */
CREATE TABLE Organisateurs
(
    id_structure INTEGER UNSIGNED,
    FOREIGN KEY (id_structure) REFERENCES Structur(id_structur) ON DELETE CASCADE,
    id_evenement INTEGER UNSIGNED,
    FOREIGN KEY (id_evenement) REFERENCES Evenements(id_evenement) ON DELETE CASCADE
);

/* --@block  */
CREATE TABLE Participants
(
    id_structure INTEGER UNSIGNED,
    FOREIGN KEY (id_structure) REFERENCES Structur(id_structur) ON DELETE CASCADE,
    id_evenement INTEGER UNSIGNED,
    FOREIGN KEY (id_evenement) REFERENCES Evenements(id_evenement) ON DELETE CASCADE
);

/* --@block  */
CREATE TABLE Trajets
(
    id_badge INT PRIMARY KEY AUTO_INCREMENT,
    distance FLOAT NOT NULL,
    date_trajet DATE NOT NULL,
    vehicule VARCHAR(255) NOT NULL,
    impact FLOAT NOT NULL,
    nb_passagers INTEGER NOT NUll,
    id_evenement INTEGER UNSIGNED,
    FOREIGN KEY (id_evenement) REFERENCES Evenements(id_evenement) ON DELETE CASCADE,
    id_adherent INTEGER,
    FOREIGN KEY (id_adherent) REFERENCES Adherents(id_adherent) ON DELETE CASCADE
);

/* --@block  */
CREATE TABLE Badges
(
    id_badge INT PRIMARY KEY AUTO_INCREMENT,
    nom_badge VARCHAR(255) NOT NULL,
    /*icone => voir comment ca marche pour les images*/
    description_badge VARCHAR(255),
    date_badge_obtenu DATE NOT NULL,
    statut BOOLEAN NOT NULL,
    id_adherent INTEGER,
    FOREIGN KEY (id_adherent) REFERENCES Adherents(id_adherent) ON DELETE CASCADE,
    id_structure INTEGER UNSIGNED,
    FOREIGN KEY (id_structure) REFERENCES Structur(id_structur) ON DELETE CASCADE
);

/* --@block  */
CREATE TABLE Defis
(
    id_defi INT PRIMARY KEY AUTO_INCREMENT,
    description_defi VARCHAR(255) NOT NULL,
    id_badge INTEGER,
    FOREIGN KEY (id_badge) REFERENCES Badges(id_badge) ON DELETE CASCADE,
    id_evenement INTEGER UNSIGNED, 
    FOREIGN KEY (id_evenement) REFERENCES Evenements(id_evenement) ON DELETE CASCADE
);

/* --@block  */
CREATE TABLE Admin
(
    id_admin INT PRIMARY KEY AUTO_INCREMENT,
    debut_mandat DATE NOT NULL,
    id_structure INTEGER UNSIGNED,
    FOREIGN KEY (id_structure) REFERENCES Structur(id_structur) ON DELETE CASCADE,
    id_adherent INTEGER,
    FOREIGN KEY (id_adherent) REFERENCES Adherents(id_adherent) ON DELETE CASCADE
);