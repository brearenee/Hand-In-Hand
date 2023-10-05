const { Pool } = require('pg');

const pool = new Pool({
    database: process.env.POSTGRES_DB,
    user: process.env.POSTGRES_USR,
    password: process.env.POSTGRES_PWD,
    host: process.env.POSTGRES_HOST,
    port: parseInt(process.env.POSTGRES_PORT),
    ensureDatabaseExists: true,
    defaultDatabase: "postgres"
});

module.exports = pool;
