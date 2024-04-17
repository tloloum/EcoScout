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
  const tempScriptPath = path.join(__dirname, "../bdd/sql/create.sql");

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

describe("Structures API", () => {
  // Test de l'enregistrement
  it("should create a new struct", async () => {
    await request(app).post("/user/register").send({
      mail: "testMail2@mail.mail",
      password: "password123",
    });
    const login_test_user = await request(app).post("/user/login").send({
      mail: "testMail2@mail.mail",
      password: "password123",
    });
    global.userToken = login_test_user.body.token;
    console.log(userToken);

    const res = await request(app)
      .post("/structures/create")
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        nom_structure: "StructTest1",
      });
    console.log("struct cree");
    expect(res.body).toHaveProperty(
      "message",
      "Structure created successfully"
    );
  });
  it("should login the struct successfully", async () => {
    const selectionData = {
      structureId: 1,
    };

    const response = await request(app)
      .post("/structures/loginstruct")
      .set("Authorization", `Bearer ${userToken}`)
      .send(selectionData);

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty("token");
    global.structureToken = response.body.token;
    console.log(structureToken);
  });

  it("should get a struct", async () => {
    const structureId = 1;
    const req = await request(app)
      .get(`/structures/${structureId}`)
      .set("Authorization", `Bearer ${structureToken}`)
      .expect(200);
  });

  it("should update a struct name", async () => {
    const structureId = 1;
    const updatename = "update";
    const userId = 1;

    const response = await request(app)
      .put(`/user/${userId}/structure/${structureId}`)
      .set("Authorization", `Bearer ${structureToken}`)
      .send(updatename)
      .expect(200);

    expect(response.body).toHaveProperty(
      "message",
      "Structure updated successfully"
    );
    const getResponse = await request(app)
      .get(`/user/${userId}/structure/${structureId}`)
      .expect(200);
    expect(getResponse.body).toHaveProperty("nom_st", "updated_nom");
  });

  it("should delete a struct", async () => {
    const structureId = 1;
    const response = await request(app)
      .delete(`/structure/${structureId}`)
      .set("Authorization", `Bearer ${structureToken}`)
      .expect(200);
    expect(response.body).toHaveProperty(
      "message",
      "Structure deleted successfully"
    );
  });
});
