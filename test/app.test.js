const request = require("supertest");

const app = require("../src/app");

describe("app", () => {
  it("responds with a not found message", (done) => {
    request(app)
      .get("/what-is-this-even")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(404, done);
  });
});

describe("GET /", () => {
  it("responds with a json message", (done) => {
    request(app)
      .get("/")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(
        200,
        {
          message: "🦄🌈✨👋🌎🌍🌏✨🌈🦄",
        },
        done
      );
  });
});

describe("GET /products", () => {
  it("responds with a list of products", (done) => {
    request(app)
      .get("/products")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(
        200,
        {
          message: {
            message: "list of products",
            data: [
              {
                created: "2024-02-06 10:10:59.537Z",
                id: "6b4yvewu7uocxp8",
                name: "snus",
                price: 90,
                updated: "2024-02-06 10:10:59.537Z",
              },
              {
                created: "2024-02-06 10:50:11.479Z",
                id: "rdce1475d7b39aa",
                name: "vodka",
                price: 79,
                updated: "2024-02-06 10:50:11.479Z",
              },
              {
                created: "2024-02-06 10:54:22.072Z",
                id: "r79ae85826950b6",
                name: "banana",
                price: 50,
                updated: "2024-02-06 10:54:22.072Z",
              },
              {
                created: "2024-02-06 10:54:54.063Z",
                id: "r09e8d506f172b1",
                name: "butter",
                price: 80,
                updated: "2024-02-06 10:54:54.063Z",
              },
              {
                created: "2024-02-07 08:32:08.467Z",
                id: "rc54a94be974cc4",
                name: "butter",
                price: 80,
                updated: "2024-02-07 08:32:08.467Z",
              },
            ],
          },
        },
        done
      );
  });
});
