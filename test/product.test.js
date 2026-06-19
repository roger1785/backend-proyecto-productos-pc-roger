import { expect } from "chai";
import { test } from "mocha";
import request from "supertest";
import app from "../app.js";

describe("CRUD Products", function () {
  this.Timeout(5000);
before()

  test("debería traer un array de productos", async () => {
    const response = await request(app).get("/api/products");
    expect(response.status).to.equal(200);
    expect(response.body).to.be("array");
  });
});
