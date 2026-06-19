import { expect } from "chai";
import { test } from "mocha";
import request from "supertest";
import app from "../app.js";

import bcrypt from "bcryptjs";
import User from "../src/models/User.js";
import Movie from "../src/models/Movie.js";

describe("CRUD Movies", function () {
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

  //   beforeEach(async () => {
  //     // Eliminar las peliculas antes de cada test
  //     await Movie.deleteMany();
  //   });

  test("deberia traer un array de peliculas", async () => {
    const response = await request(app).get("/api/movies");

    expect(response.status).to.equal(200);
    expect(response.body).to.be.an("array");
  });

  test("el Admin deberia poder crear una pelicula", async () => {
    await Movie.deleteMany();

    const responseLogin = await request(app).post("/api/auth/login").send({
      email: "admin@test.com",
      password: "abc.123-",
    });

    const token = responseLogin.body.token;

    const movie = {
      title: "Una pelicula",
      genre: "Drama",
      year: 2018,
      image: "https://picsum.photos/200",
      featured: false,
    };

    const response = await request(app)
      .post("/api/movies")
      .send(movie)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).to.equal(201);
    expect(response.body).to.have.property("title");
    expect(response.body.title).to.equal("Una pelicula");
  });
});
