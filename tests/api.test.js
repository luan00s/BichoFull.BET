const request = require("supertest");
const app     = require("../app");
const db      = require("../database/connection");

// E-mail único por execução para evitar conflito entre runs
const emailTeste = `teste${Date.now()}@email.com`;
let tokenTeste   = "";

afterAll(() => {
  db.end();
});

// ================================================================
// Autenticação (RF01, RF02)
// ================================================================
describe("Autenticação", () => {

  test("RF01 — Cadastro retorna 201 e mensagem de sucesso", async () => {
    const res = await request(app).post("/register").send({
      nome:  "Usuário Teste",
      email: emailTeste,
      senha: "123456",
    });

    expect(res.statusCode).toBe(201);
    expect(res.body.mensagem).toBeDefined();
  });

  test("RF01 — E-mail duplicado retorna 409", async () => {
    const res = await request(app).post("/register").send({
      nome:  "Usuário Teste",
      email: emailTeste,
      senha: "123456",
    });

    expect(res.statusCode).toBe(409);
  });

  test("RF01 — E-mail inválido retorna 400", async () => {
    const res = await request(app).post("/register").send({
      nome:  "Teste",
      email: "nao-e-email",
      senha: "123456",
    });

    expect(res.statusCode).toBe(400);
  });

  test("RF02 — Login com credenciais válidas retorna token", async () => {
    const res = await request(app).post("/login").send({
      email: emailTeste,
      senha: "123456",
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
    tokenTeste = res.body.token;
  });

  test("RF02 — Login com senha errada retorna 401", async () => {
    const res = await request(app).post("/login").send({
      email: emailTeste,
      senha: "senhaerrada",
    });

    expect(res.statusCode).toBe(401);
  });

  test("RF02 — Rota protegida sem token retorna 401", async () => {
    const res = await request(app).get("/historico");
    expect(res.statusCode).toBe(401);
  });

});

// ================================================================
// Saldo (RF03, RN3)
// ================================================================
describe("Saldo", () => {

  test("RF03 — Novo usuário tem saldo de R$ 1.000,00", async () => {
    const res = await request(app)
      .get("/saldo")
      .set("Authorization", `Bearer ${tokenTeste}`);

    expect(res.statusCode).toBe(200);
    expect(Number(res.body.saldo)).toBe(1000);
  });

  test("RN3 — Saque maior que saldo retorna 400", async () => {
    const res = await request(app)
      .post("/saldo")
      .set("Authorization", `Bearer ${tokenTeste}`)
      .send({ tipo: "saque", valor: 99999 });

    expect(res.statusCode).toBe(400);
  });

});

// ================================================================
// Apostas (RF05, RF06)
// ================================================================
describe("Apostas", () => {

  test("RF05/RF06 — Aposta de grupo válida retorna 201", async () => {
    const res = await request(app)
      .post("/aposta")
      .set("Authorization", `Bearer ${tokenTeste}`)
      .send({ tipoAposta: "grupo", animal: 5, valor: 10 });

    expect(res.statusCode).toBe(201);
    expect(res.body.aposta_id).toBeDefined();
  });

  test("RF05 — Tipo de aposta inválido retorna 400", async () => {
    const res = await request(app)
      .post("/aposta")
      .set("Authorization", `Bearer ${tokenTeste}`)
      .send({ tipoAposta: "invalido", valor: 10 });

    expect(res.statusCode).toBe(400);
  });

  test("RF06 — Aposta com saldo insuficiente retorna 400", async () => {
    const res = await request(app)
      .post("/aposta")
      .set("Authorization", `Bearer ${tokenTeste}`)
      .send({ tipoAposta: "grupo", animal: 1, valor: 99999 });

    expect(res.statusCode).toBe(400);
  });

});

// ================================================================
// Histórico (RF08)
// ================================================================
describe("Histórico", () => {

  test("RF08 — Histórico retorna lista de apostas do usuário", async () => {
    const res = await request(app)
      .get("/historico")
      .set("Authorization", `Bearer ${tokenTeste}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

});

// ================================================================
// Sorteio — acesso admin (RF07)
// ================================================================
describe("Sorteio", () => {

  test("RF07 — Simular sorteio sem token retorna 401", async () => {
    const res = await request(app).post("/sorteio/simular");
    expect(res.statusCode).toBe(401);
  });

  test("RF07 — Simular sorteio com token de usuário comum retorna 403", async () => {
    const res = await request(app)
      .post("/sorteio/simular")
      .set("Authorization", `Bearer ${tokenTeste}`);

    expect(res.statusCode).toBe(403);
  });

});