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

describe("Event API", () => {
  // Mise en place des tests
  it("should create a user, an adherent, a structure and log in", async () => {
    const res = await request(app).post("/user/register").send({
      mail: "testEvent@mail",
      password: "password123",
    });
    const res2 = await request(app).post("/user/login").send({
      mail: "testEvent@mail",
      password: "password123",
    });
    global.Usertoken = res2.body.token;
    const res3 = await request(app)
      .post("/user/create-adherent")
      .set("Authorization", `Bearer ${Usertoken}`)
      .send({
        nom_ad: "testEventPrenom",
        prenom_ad: "testEventNom",
      });
    const res4 = await request(app)
      .post("/user/login-adherent")
      .set("Authorization", `Bearer ${Usertoken}`)
      .send({
        adherentId: 1,
      });
    global.Adherenttoken = res4.body.token;
    const res5 = await request(app)
      .post("/structures/create")
      .set("Authorization", `Bearer ${Usertoken}`)
      .send({
        nom_structure: "StructTest1",
      });
    const res6 = await request(app)
      .post("/structures/loginstruct")
      .set("Authorization", `Bearer ${Usertoken}`)
      .send({
        structureId: 1,
      });
    global.Structtoken = res6.body.token;
    const res7 = await request(app)
        .post("/structures/1/join")
        .set("Authorization", `Bearer ${Adherenttoken}`);
  });

  // Test de la création d'un événement
  it("should create a new event", async () => {
    const res = await request(app)
      .post("/events/create")
      .set("Authorization", `Bearer ${Structtoken}`)
      .send({
        nom_evenement: "EventTest1",
        date_debut: "2021-12-12",
        lieu: "LieuTest1",
        descr: "DescriptionTest1",
        duree_evenement: "200",
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("message", "Event created successfully");
  });

  // Test de la récupération de tous les événements d'une structure
  it("should get all events from a structure", async () => {
    const res = await request(app)
      .get("/events/struct/allevents")
      .set("Authorization", `Bearer ${Structtoken}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Array);
    expect(res.body[0]).toHaveProperty("nom_evenement");
    expect(res.body[0]).toHaveProperty("date_debut");
    expect(res.body[0]).toHaveProperty("lieu");
    expect(res.body[0]).toHaveProperty("descr");
    expect(res.body[0]).toHaveProperty("duree_evenement");
    expect(res.body[0]).toHaveProperty("id_evenement");
    expect(res.body[0].nom_evenement).toEqual("EventTest1");
  });

  // Test de la récupération de tous les événements d'une structure par un adhérent
  it("should get all events from a structure by an adherent", async () => {
    const res = await request(app)
      .get("/events/ad/1")
      .set("Authorization", `Bearer ${Adherenttoken}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Array);
    expect(res.body[0]).toHaveProperty("nom_evenement");
    expect(res.body[0]).toHaveProperty("date_debut");
    expect(res.body[0]).toHaveProperty("lieu");
    expect(res.body[0]).toHaveProperty("descr");
    expect(res.body[0]).toHaveProperty("duree_evenement");
    expect(res.body[0]).toHaveProperty("id_evenement");
    expect(res.body[0].nom_evenement).toEqual("EventTest1");
  });

  // Test de l'inscription à un événement par une structure
  it("should join an event by a structure", async () => {
    const res = await request(app)
      .post("/events/join/1")
      .set("Authorization", `Bearer ${Structtoken}`);
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("message", "Structure added to event successfully");
  });

  // Test de l'inscription à un événement par un adhérent
  it("should not join an event by an adherent", async () => {
    const res = await request(app)
      .post("/events/join/1")
      .set("Authorization", `Bearer ${Adherenttoken}`);
    expect(res.statusCode).toEqual(401);
    expect(res.body).toHaveProperty("message", "Unauthorized");
  });

  // Test de la modification d'un événement
  it("should update an event", async () => {
    const res = await request(app)
      .put("/events/update/1")
      .set("Authorization", `Bearer ${Structtoken}`)
      .send({
        nom_evenement: "EventTest2",
        date_debut: "2021-12-13",
        lieu: "LieuTest2",
        descr: "DescriptionTest2",
        duree_evenement: "300",
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("message", "Event updated successfully");
  });

  // Test de la suppression d'un événement
  it("should delete an event", async () => {
    const res = await request(app)
      .delete("/events/delete/1")
      .set("Authorization", `Bearer ${Structtoken}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("message", "Event deleted successfully");
  });
});
