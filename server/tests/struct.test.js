const request = require("supertest");
const fs = require("fs");
const path = require("path");
const app = require("../app");
const connection = require("../bdd/utils/connection");
const exp = require("constants");

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

    const res = await request(app)
      .post("/structures/create")
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        nom_structure: "StructTest1",
      });
    expect(res.body).toHaveProperty(
      "message",
      "Structure created successfully"
    );
  });
  it("should not create a new struct with existing name", async () => {
    const res = await request(app)
      .post("/structures/create")
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        nom_structure: "StructTest1",
      })
      .expect(400);
    expect(res.body).toHaveProperty(
      "message",
      "A structure with the same name already exists"
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
  });
  it("should not login with wrong login info", async () => {
    const selectionData = {
      structureId: 1,
    };

    const response = await request(app)
      .post("/structures/loginstruct")
      .set("Authorization", `Bearer adzjs`)
      .send(selectionData);

    expect(response.statusCode).toBe(401);
  });
  it("should get a struct", async () => {
    const structureId = 1;
    const req = await request(app)
      .get(`/structures/${structureId}`)
      .set("Authorization", `Bearer ${structureToken}`)
      .expect(200);
  });

  it("should get a struct from a user", async () => {
    const userId = 1;
    const req = await request(app)
      .get(`/structures/user/${userId}`)
      .set("Authorization", `Bearer ${userToken}`)
      .expect(200);
  });

  it("should get all info from a struct", async () => {
    const req = await request(app)
      .get(`/structures`)
      .set("Authorization", `Bearer ${structureToken}`)
      .expect(200);

    expect(req.body).toHaveProperty("id_structur");
    expect(req.body).toHaveProperty("nom_structure");
    expect(req.body).toHaveProperty("date_creation");
    expect(req.body).toHaveProperty("id_structur_mere");
    expect(req.body).toHaveProperty("id_owner");

    expect(req.body.id_structur).toBe(1);
    expect(req.body.nom_structure).toBe("StructTest1");
  });

  it("should update a struct name", async () => {
    const structureId = 1;
    const newname = "update";
    const userId = 1;

    const response = await request(app)
      .put(`/structures`)
      .set("Authorization", `Bearer ${global.structureToken}`)
      .send({ newname: newname })
      .expect(200);

    expect(response.body).toHaveProperty(
      "message",
      "Structure updated successfully"
    );
    const response_verif = await request(app)
      .get(`/structures`)
      .set("Authorization", `Bearer ${global.structureToken}`)
      .expect(200);
    expect(response_verif.body.nom_structure).toBe(newname);
  });

  it("An adherant should join a struct", async () => {
    const adherentData = {
      nom_ad: "test_ad_nom",
      prenom_ad: "test_ad_prenom",
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

    const response_login = await request(app)
      .post("/user/login-adherent")
      .set("Authorization", `Bearer ${userToken}`)
      .send({ adherentId: 1 });
    expect(response_login.statusCode).toBe(200);
    expect(response_login.body).toHaveProperty("token");
    const adherentToken = response_login.body.token;

    const structureId = 1;
    const response_join = await request(app)
      .post(`/structures/${structureId}/join`)
      .set("Authorization", `Bearer ${adherentToken}`)
      .expect(201);
    expect(response_join.body).toHaveProperty(
      "message",
      "Adherent added to structure successfully"
    );
  });

  it("should delete an adherent from a struct", async () => {
    const structureId = 1;
    const id_p_struct = 1;
    const response = await request(app)
      .delete(`/structures/delmembers/${id_p_struct}`)
      .set("Authorization", `Bearer ${structureToken}`)
      .expect(200);
    expect(response.body).toHaveProperty(
      "message",
      "Member deleted from struct successfully"
    );
  });

  it("should delete a struct", async () => {
    const structureId = 1;
    const response = await request(app)
      .delete(`/structures/${structureId}`)
      .set("Authorization", `Bearer ${structureToken}`)
      .expect(200);
    expect(response.body).toHaveProperty(
      "message",
      "Structure deleted successfully"
    );
  });
});
