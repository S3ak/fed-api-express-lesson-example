describe("GET /products", () => {
  it("get a list of products", () => {
    cy.request("http://localhost:3010/products").then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.message).to.eq("list of products");

      expect(response.body.data.length).to.be.greaterThan(0);
    });
  });

  it("creates a new product", () => {
    cy.request("POST", "http://localhost:3010/products", {
      name: `test new product ${Math.floor(Math.random() * 1000)}`,
      price: 100,
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.message).contains("added");
    });
  });
});
