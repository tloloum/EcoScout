const request = require("supertest");
const fs = require("fs");
const path = require("path");
const app = require("../app");
const connection = require("../connection");

/**
 * Réinitialise la base de données avant de lancer les tests.
 */
async function resetDatabase() {
  async function executeScript(filePath) {
    const scriptContent = fs.readFileSync(filePath, "utf8");
    const statements = scriptContent
      .split(";")
      .map((statement) => statement.trim())
      .filter((statement) => statement.length);

    for (const statement of statements) {
      await new Promise((resolve, reject) => {
        connection.query(statement, (err, results) => {
          if (err) reject(err);
          else resolve(results);
        });
      });
    }
  }

  const dropScriptPath = path.join(__dirname, "../bdd/sql/drop.sql");
  const tempScriptPath = path.join(__dirname, "../bdd/sql/temp.sql");

  await executeScript(dropScriptPath);

  await executeScript(tempScriptPath);
}

/**
 * Exécute la réinitialisation de la base de données avant tous les tests.
 */
beforeAll(async () => {
  await resetDatabase();
}, 30000);

/**
 * Ferme le pool de connexions après tous les tests.
 */
afterAll(() => {
  connection.end();
});

describe("Authentication API", () => {
  // Test de l'enregistrement
  it("should register a new user", async () => {
    const res = await request(app)
      .post("/user/register")
      .send({
        username: "testUser",
        password: "password123",
      })
      .expect(201);

    expect(res.body).toHaveProperty("message", "User inserted successfully");
  });

  // Test de login
  it("should login the user and return a token", async () => {
    const res = await request(app)
      .post("/user/login")
      .send({
        username: "testUser",
        password: "password123",
      })
      .expect(200);

    expect(res.body).toHaveProperty("token");
    global.userToken = res.body.token;
  });
});

describe("Adherent Management", () => {
  it("should create an adherent successfully", async () => {
    const adherentData = {
      nom_ad: "test_ad_nom",
      prenom_ad: "test_ad_prenom",
      mail_ad: "test_ad@mail.mail",
    };

    const response = await request(app)
      .post("/user/create-adherent")
      .set("Authorization", `Bearer ${userToken}`)
      .send(adherentData);

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty(
      "message",
      "Adherent inserted successfully"
    );
  });

  it("should login the adherent successfully", async () => {
    const selectionData = {
      adherentId: 1,
    };

    const response = await request(app)
      .post("/user/login-adherent")
      .set("Authorization", `Bearer ${userToken}`)
      .send(selectionData);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("token");
    global.adherentToken = response.body.token;
  });

  it("should get the information of an adherent", async () => {
    const userId = 1;
    const adherentId = 1;

    const response = await request(app)
      .get(`/user/${userId}/adherent/${adherentId}`)
      .set("Authorization", `Bearer ${adherentToken}`)
      .expect(200);

    expect(response.body).toHaveProperty("nom_ad", "test_ad_nom");
    expect(response.body).toHaveProperty("prenom_ad", "test_ad_prenom");
    expect(response.body).toHaveProperty("mail_ad", "test_ad@mail.mail");
  });

  it("should update the information of an adherent", async () => {
    const userId = 1;
    const adherentId = 1;
    const updatedData = {
      nom_ad: "updated_nom",
      prenom_ad: "updated_prenom",
      mail_ad: "update_mail@mail.mail",
    };

    const response = await request(app)
      .put(`/user/${userId}/adherent/${adherentId}`)
      .set("Authorization", `Bearer ${adherentToken}`)
      .send(updatedData)
      .expect(200);

    expect(response.body).toHaveProperty(
      "message",
      "Adherent updated successfully"
    );
    const getResponse = await request(app)
      .get(`/user/${userId}/adherent/${adherentId}`)
      .set("Authorization", `Bearer ${adherentToken}`)
      .expect(200);
    expect(getResponse.body).toHaveProperty("nom_ad", "updated_nom");
    expect(getResponse.body).toHaveProperty("prenom_ad", "updated_prenom");
    expect(getResponse.body).toHaveProperty("mail_ad", "update_mail@mail.mail");
  });

  it("should delete an adherent", async () => {
    const userId = 1;
    const adherentId = 1;

    const response = await request(app)
      .delete(`/user/${userId}/adherent/${adherentId}`)
      .set("Authorization", `Bearer ${adherentToken}`)
      .expect(200);

    expect(response.body).toHaveProperty(
      "message",
      "Adherent deleted successfully"
    );
  });
});
