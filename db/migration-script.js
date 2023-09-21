const {migrate} = require("postgres-migrations");
require('dotenv').config(); 

async function migration(){

const dbConfig = {
    database: process.env.POSTGRES_DB,
    user: process.env.POSTGRES_USR,
    password: process.env.POSTGRES_PWD,
    host: process.env.POSTGRES_HOST,
    port: parseInt(process.env.POSTGRES_PORT),

    // Default: false for backwards-compatibility
    // This might change!
    ensureDatabaseExists: true,

    // Default: "postgres"
    // Used when checking/creating "database-name"
    defaultDatabase: "postgres"
};

try {
    await migrate(dbConfig, "./db/migrations");
    console.log("Migrations successfully applied");
} catch (error) {
    console.error("Error applying migrations:", error);
}
}

migration(); 