const request = require("supertest");
const app = require("../src/backend/app");

describe("Catalog API", () => {
  it("should return all products", async () => {
    const res = await request(app).get("/api/catalog");
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it("should filter products by search query", async () => {
    const res = await request(app).get("/api/catalog?search=bag");
    expect(res.statusCode).toBe(200);
    expect(res.body[0].name.toLowerCase()).toContain("bag");
  });
});