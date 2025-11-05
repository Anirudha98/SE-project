const request = require("supertest");
const app = require("../src/backend/app");

describe("Auth API", () => {
  it("should register a new user", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({ name: "Akshay", email: "akshay@example.com", password: "123456" });
    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe("Registration successful");
  });

  it("should login with correct credentials", async () => {
    await request(app)
      .post("/api/auth/register")
      .send({ name: "Akshay", email: "test@example.com", password: "123456" });

    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "test@example.com", password: "123456" });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
  });
});

