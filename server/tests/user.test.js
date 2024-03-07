const request = require("supertest");
const fs = require("fs");
const path = require("path");
const app = require("../app");
const connection = require("../bdd/utils/connection");

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

  it("should not register a user with an existing username", async () => {
    const res = await request(app)
      .post("/user/register")
      .send({
        username: "testUser",
        password: "password123",
      })
      .expect(400);

    expect(res.body).toHaveProperty("message", "Username already taken");
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

  it("should not login the user with incorrect credentials", async () => {
    const res = await request(app)
      .post("/user/login")
      .send({
        username: "testUser",
        password: "wrongPassword",
      })
      .expect(401);

    expect(res.body).toHaveProperty(
      "message",
      "Identifiant ou mot de passe incorrect"
    );
  });

  it("should not login the user with an incorrect username", async () => {
    const res = await request(app)
      .post("/user/login")
      .send({
        username: "wrongUser",
        password: "password123",
      })
      .expect(401);

    expect(res.body).toHaveProperty(
      "message",
      "Identifiant ou mot de passe incorrect"
    );
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

  it("should create a second adherent successfully", async () => {
    const adherentData = {
      nom_ad: "test_ad_nom2",
      prenom_ad: "test_ad_prenom2",
      mail_ad: "test_ad2@mail.mail",
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

  it("should not create an adherent with an invalid token", async () => {
    const adherentData = {
      nom_ad: "test_ad_nom",
      prenom_ad: "test_ad_prenom",
      mail_ad: "test_ad@mail.mail",
    };

    const response = await request(app)
      .post("/user/create-adherent")
      .set("Authorization", `Bearer invalidToken`)
      .send(adherentData);

    expect(response.statusCode).toBe(401);
  });

  it("should not create an adherent with a missing token", async () => {
    const adherentData = {
      nom_ad: "test_ad_nom",
      prenom_ad: "test_ad_prenom",
      mail_ad: "test_ad@mail.mail",
    };

    const response = await request(app)
      .post("/user/create-adherent")
      .send(adherentData);

    expect(response.statusCode).toBe(401);
  });

  it("should not create an adherent with missing data", async () => {
    const adherentData = {
      nom_ad: "test_ad_nom",
      prenom_ad: "test_ad_prenom",
    };

    const response = await request(app)
      .post("/user/create-adherent")
      .set("Authorization", `Bearer ${userToken}`)
      .send(adherentData);

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty("message", "Missing required fields");
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

  it("should not login the adherent with an invalid token", async () => {
    const selectionData = {
      adherentId: 1,
    };

    const response = await request(app)
      .post("/user/login-adherent")
      .set("Authorization", `Bearer invalidToken`)
      .send(selectionData);

    expect(response.statusCode).toBe(401);
  });

  it("should not login the adherent with a missing token", async () => {
    const selectionData = {
      adherentId: 1,
    };

    const response = await request(app)
      .post("/user/login-adherent")
      .send(selectionData);

    expect(response.statusCode).toBe(401);
  });

  it("should not login the adherent with missing data", async () => {
    const response = await request(app)
      .post("/user/login-adherent")
      .set("Authorization", `Bearer ${userToken}`);

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty("message", "Missing required fields");
  });

  it("should not login the adherent with an invalid adherentId", async () => {
    const selectionData = {
      adherentId: 4,
    };

    const response = await request(app)
      .post("/user/login-adherent")
      .set("Authorization", `Bearer ${userToken}`)
      .send(selectionData);

    expect(response.statusCode).toBe(401);
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

  it("should not get the information of an adherent with an invalid token", async () => {
    const userId = 1;
    const adherentId = 1;

    const response = await request(app)
      .get(`/user/${userId}/adherent/${adherentId}`)
      .set("Authorization", `Bearer invalidToken`)
      .expect(401);
  });

  it("should not get the information of an adherent with a missing token", async () => {
    const userId = 1;
    const adherentId = 1;

    const response = await request(app)
      .get(`/user/${userId}/adherent/${adherentId}`)
      .expect(401);

    expect(response.statusCode).toBe(401);
  });

  it("should not get the information of an adherent with an invalid adherentId", async () => {
    const userId = 1;
    const adherentId = 4;

    const response = await request(app)
      .get(`/user/${userId}/adherent/${adherentId}`)
      .set("Authorization", `Bearer ${adherentToken}`)
      .expect(401);

    expect(response.body).toHaveProperty("message", "Unauthorized");
  });

  it("should not get the information of an adherent with an invalid userId", async () => {
    const userId = 2;
    const adherentId = 1;

    const response = await request(app)
      .get(`/user/${userId}/adherent/${adherentId}`)
      .set("Authorization", `Bearer ${adherentToken}`)
      .expect(401);

    expect(response.body).toHaveProperty("message", "Unauthorized");
  });

  it("should not get the information of an adherent with an invalid userId and adherentId", async () => {
    const userId = 2;
    const adherentId = 4;

    const response = await request(app)
      .get(`/user/${userId}/adherent/${adherentId}`)
      .set("Authorization", `Bearer ${adherentToken}`)
      .expect(401);

    expect(response.body).toHaveProperty("message", "Unauthorized");
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

  it("should not update the information of an adherent with an invalid token", async () => {
    const userId = 1;
    const adherentId = 1;
    const updatedData = {
      nom_ad: "updated_nom",
      prenom_ad: "updated_prenom",
      mail_ad: "test_ad@mail.mail",
    };

    const response = await request(app)
      .put(`/user/${userId}/adherent/${adherentId}`)
      .set("Authorization", `Bearer invalidToken`)
      .send(updatedData)
      .expect(401);
  });

  it("should not update the information of an adherent with a missing token", async () => {
    const userId = 1;
    const adherentId = 1;
    const updatedData = {
      nom_ad: "updated_nom",
      prenom_ad: "updated_prenom",
      mail_ad: "test_ad@mail.mail",
    };

    const response = await request(app)
      .put(`/user/${userId}/adherent/${adherentId}`)
      .send(updatedData)
      .expect(401);
  });

  it("should not update the information of an adherent with an invalid adherentId", async () => {
    const userId = 1;
    const adherentId = 4;
    const updatedData = {
      nom_ad: "updated_nom",
      prenom_ad: "updated_prenom",
      mail_ad: "test_ad@mail.mail",
    };

    const response = await request(app)
      .put(`/user/${userId}/adherent/${adherentId}`)
      .set("Authorization", `Bearer ${adherentToken}`)
      .send(updatedData)
      .expect(401);

    expect(response.body).toHaveProperty("message", "Unauthorized");
  });

  it("should not update the information of an adherent with an invalid userId", async () => {
    const userId = 2;
    const adherentId = 1;
    const updatedData = {
      nom_ad: "updated_nom",
      prenom_ad: "updated_prenom",
      mail_ad: "test_ad@mail.mail",
    };

    const response = await request(app)
      .put(`/user/${userId}/adherent/${adherentId}`)
      .set("Authorization", `Bearer ${adherentToken}`)
      .send(updatedData)
      .expect(401);

    expect(response.body).toHaveProperty("message", "Unauthorized");
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

    const getResponse = await request(app)
      .get(`/user/${userId}/adherent/${adherentId}`)
      .set("Authorization", `Bearer ${adherentToken}`)
      .expect(500);

    expect(getResponse.body).toHaveProperty("error");
  });

  it("should not delete an adherent with an invalid token", async () => {
    const userId = 1;
    const adherentId = 2;

    const response = await request(app)
      .delete(`/user/${userId}/adherent/${adherentId}`)
      .set("Authorization", `Bearer invalidToken`)
      .expect(401);
  });

  it("should not delete an adherent with a missing token", async () => {
    const userId = 1;
    const adherentId = 2;

    const response = await request(app)
      .delete(`/user/${userId}/adherent/${adherentId}`)
      .expect(401);
  });

  it("should not delete an adherent with an invalid adherentId", async () => {
    const userId = 1;
    const adherentId = 4;

    const response = await request(app)
      .delete(`/user/${userId}/adherent/${adherentId}`)
      .set("Authorization", `Bearer ${adherentToken}`)
      .expect(401);

    expect(response.body).toHaveProperty("message", "Unauthorized");
  });

  it("should not delete an adherent with an invalid userId", async () => {
    const userId = 2;
    const adherentId = 2;

    const response = await request(app)
      .delete(`/user/${userId}/adherent/${adherentId}`)
      .set("Authorization", `Bearer ${adherentToken}`)
      .expect(401);

    expect(response.body).toHaveProperty("message", "Unauthorized");
  });

  it("should not delete an adherent with an invalid userId and adherentId", async () => {
    const userId = 2;
    const adherentId = 4;

    const response = await request(app)
      .delete(`/user/${userId}/adherent/${adherentId}`)
      .set("Authorization", `Bearer ${adherentToken}`)
      .expect(401);

    expect(response.body).toHaveProperty("message", "Unauthorized");
  });
});
