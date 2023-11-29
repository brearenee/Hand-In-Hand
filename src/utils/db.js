const { Pool } = require("pg");
const pgp = require("pg-promise")();

let poolConfig;
let dbConfig;

if (process.env.NODE_ENV === "production") {
    // Production environment (Heroku)
    const prodConfig = {
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
    };

    poolConfig = prodConfig;
    dbConfig = prodConfig;

} else {
    // Local development environment
    poolConfig = {
        database: process.env.POSTGRES_DB,
        user: process.env.POSTGRES_USR,
        password: process.env.POSTGRES_PWD,
        host: process.env.POSTGRES_HOST,
        port: parseInt(process.env.POSTGRES_PORT),
        ssl: false 
    };
    dbConfig = {
        database: process.env.POSTGRES_DB,
        user: process.env.POSTGRES_USR,
        password: process.env.POSTGRES_PWD,
        host: process.env.POSTGRES_HOST,
        port: parseInt(process.env.POSTGRES_PORT)
    };
}

const pool = new Pool(poolConfig);
const db = pgp(dbConfig);

module.exports = { pool, db };
