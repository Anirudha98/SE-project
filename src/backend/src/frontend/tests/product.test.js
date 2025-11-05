const request = require("supertest");
const app = require("../src/backend/app");

describe("Product API", () => {
  it("should add a new product", async () => {
    const newProduct = {
      name: "Clay Lamp",
      price: 500,
      artisan: "Aarav",
      description: "Beautiful handmade clay lamp",
    };

    const res = await request(app).post("/api/products").send(newProduct);
    expect(res.statusCode).toBe(201);
    expect(res.body.product.name).toBe("Clay Lamp");
  });

  it("should fetch all products", async () => {
    const res = await request(app).get("/api/products");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
