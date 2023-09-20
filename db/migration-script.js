//TODO: https://www.antoniovdlc.me/a-look-at-postgresql-migrations-in-node/
import {migrate} from "postgres-migrations";

async function migrateConfig() {
  const dbConfig = {
    database: process.env.POSTGRES_DB,
    user: process.env.POSTGRES_USR,
    password: process.env.POSTGRES_PWD,
    host: process.env.POSTGRES_HOST,
    port: POSTGRES_PORT,

    // Default: false for backwards-compatibility
    // This might change!
    ensureDatabaseExists: true,

    // Default: "postgres"
    // Used when checking/creating "database-name"
    defaultDatabase: "postgres"
  }

  await migrate(dbConfig, ".")
}