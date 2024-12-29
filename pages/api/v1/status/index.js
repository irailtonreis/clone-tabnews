import database from "infra/database.js";
async function status(request, response) {
  const updatedAt = new Date().toISOString();
  const databaseVersionResult = await database.query("SHOW server_version;");
  const databaseVersionValue = databaseVersionResult.rows[0].server_version;
  const databaseMaxConnnectionsResult = await database.query(
    "SHOW max_connections;",
  );
  const databaseMaxConnnectionsValue =
    databaseMaxConnnectionsResult.rows[0].max_connections;

  const databaseOpenedConnectionsResult = await database.query(
    "SELECT count(*)::int FROM pg_stat_activity where datname = 'local_db';",
  );

  const databaseOpenedConnectionsValue =
    databaseOpenedConnectionsResult.rows[0].count;

  response.status(200).json({
    updated_at: updatedAt,
    dependencies: {
      database: {
        version: databaseVersionValue,
        max_connections: parseInt(databaseMaxConnnectionsValue),
        opened_connections: databaseOpenedConnectionsValue,
      },
    },
  });
}

export default status;
