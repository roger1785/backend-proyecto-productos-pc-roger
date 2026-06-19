import { expect } from "chai";
import { test } from "mocha";
import request from "supertest";
import app from "../app.js";

describe("GET /", () => {
  test("espero recibir un mensaje de bienvenida", async () => {
    const response = await request(app).get("/");

    expect(response.status).to.equal(200);
    expect(response.body).to.have.property(
      "message",
      "Bienvenidos a la API de productos de PC",
    );
  });
});
