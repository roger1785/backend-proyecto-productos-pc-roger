import { expect } from "chai";
import { test } from "mocha";
import request from "supertest";
import app from "../app.js";

import bcrypt from "bcryptjs";
import User from "../src/models/User.js";
import Movie from "../src/models/Product.js";

describe("CRUD Products", function () {
  this.timeout(5000);

  before(async () => {
    // Crear un usuario adminstrador
    User.deleteMany();

    const hash = await bcrypt.hash("abc.123-", 10);

    const user = {
      name: "Admin",
      email: "admin@test.com",
      password: hash,
      admin: true,
    };

    User.create(user);
  });

  test("deberia traer un array de productos", async () => {
    const response = await request(app).get("/api/products");

    expect(response.status).to.equal(200);
    expect(response.body).to.be.an("array");
  });

  test("el Admin deberia poder crear un producto", async () => {
    await Product.deleteMany();

    const responseLogin = await request(app).post("/api/auth/login").send({
      email: "admin@test.com",
      password: "abc.123-",
    });

    const token = responseLogin.body.token;

    const product = {
      name: "Un producto",
      price: 19.99,
      stock: 2018,
      image: "https://picsum.photos/200",
      featured: false,
    };

    const response = await request(app)
      .post("/api/products")
      .send(product)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).to.equal(201);
    expect(response.body).to.have.property("name");
    expect(response.body.name).to.equal("Un producto");
  });
});
