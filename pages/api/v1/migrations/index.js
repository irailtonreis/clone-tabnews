import migrationRunner from "node-pg-migrate";
import { createRouter } from "next-connect";
import { resolve } from "node:path";
import database from "infra/database";
import controller from "infra/controller";
const router = createRouter();
router.get(getHandler);
router.post(postHandler);
export default router.handler(controller.errorHandlers);

async function getHandler(request, response) {
  const pendingMigrations = await runMigrations(true);
  response.status(200).json(pendingMigrations);
}
async function postHandler(request, response) {
  const migratedMigrations = await runMigrations(false);

  if (migratedMigrations.length > 0) {
    response.status(201).json(migratedMigrations);
  }
  return response.status(200).json(migratedMigrations);
}

async function runMigrations(dryRun) {
  const dbClient = await database.getNewClient();
  const defaultMigrationOptions = {
    dbClient,
    dryRun,
    dir: resolve("infra", "migrations"),
    direction: "up",
    verbose: true,
    migrationsTable: "pgmigrations",
  };
  const pendingMigrations = await migrationRunner(defaultMigrationOptions);
  await dbClient.end();
  return pendingMigrations;
}
