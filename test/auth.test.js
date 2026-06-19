import { expect } from "chai";
import { test } from "mocha";
import request from "supertest";
import app from "../app.js";

import User from "../src/models/User.js";

describe("Auth User", function () {
  this.timeout(5000);

  test("deberia crear un usuario", async () => {
    await User.deleteMany({ email: "user@test.com" });

    const user = {
      name: "User",
      email: "user@test.com",
      password: "abc.123-",
    };

    const response = await request(app).post("/api/auth/register").send(user);

    expect(response.status).to.equal(201);
    expect(response.body).to.have.property(
      "message",
      "Usuario registrado correctamente",
    );
  });

  test("deberia retornar 400 si el usuario ya existe", async () => {
    const user = {
      name: "User",
      email: "user@test.com",
      password: "abc.123-",
    };

    const response = await request(app).post("/api/auth/register").send(user);

    expect(response.status).to.equal(400);
    expect(response.body).to.have.property(
      "message",
      "El correo ya esta registrado",
    );
  });

  test("deberia retornar un token y si el email y password son correctos", async () => {
    const user = {
      email: "user@test.com",
      password: "abc.123-",
    };

    const response = await request(app).post("/api/auth/login").send(user);

    expect(response.status).to.equal(200);
    expect(response.body).to.have.property("token");
  });
});
