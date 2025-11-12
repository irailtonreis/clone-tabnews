import migrationRunner from "node-pg-migrate";
import { resolve } from "node:path";
import database from "infra/database";

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
  await dbClient?.end();
  return pendingMigrations;
}

async function listPendingMigrations() {
  const pendingMigrations = await runMigrations(true);
  return pendingMigrations;
}

async function pendingMigrations() {
  const migratedMigrations = await runMigrations(false);

  return migratedMigrations;
}

const migrator = {
  listPendingMigrations,
  pendingMigrations,
};

export default migrator;
