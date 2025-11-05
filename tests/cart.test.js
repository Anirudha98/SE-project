const request = require("supertest");
const app = require("../src/backend/app");

describe("Cart API", () => {
  it("should add item to cart and return cart array", async () => {
    const res = await request(app)
      .post("/api/cart/add")
      .send({ id: 10, name: "Bracelet", price: 500, quantity: 2 });
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.cart)).toBe(true);
  });

  it("should checkout successfully", async () => {
    await request(app)
      .post("/api/cart/add")
      .send({ id: 11, name: "Painting", price: 1500, quantity: 1 });
    const res = await request(app).post("/api/cart/checkout");
    expect(res.statusCode).toBe(200);
    expect(res.body.order).toBeDefined();
  });
});
