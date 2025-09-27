import orchestrator from "tests/orchestrator";

beforeAll(async () => {
  await orchestrator.awaitForAllServices();
});
describe("GET api/v1/status", () => {
  describe("Anonymous user", () => {
    test("Retrrieving current system status", async () => {
      const response = await fetch("http://localhost:3000/api/v1/status");
      expect(response.status).toBe(200);
      const responseBody = await response.json();
      expect(responseBody.updated_at).toBeDefined();
      expect(responseBody.dependencies.database.version).toBeDefined();
      expect(responseBody.dependencies.database.max_connections).toBeDefined();
      expect(
        responseBody.dependencies.database.opened_connections,
      ).toBeDefined();
      const parsedUpdatedAt = new Date(responseBody.updated_at).toISOString();
      expect(responseBody.updated_at).toEqual(parsedUpdatedAt);
      expect(responseBody.dependencies.database.version).toEqual("16.6");
      expect(responseBody.dependencies.database.max_connections).toEqual(100);
      expect(responseBody.dependencies.database.opened_connections).toEqual(1);
    });
  });
});
