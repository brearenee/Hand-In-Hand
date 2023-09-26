const assert = require("assert");
const migration  = require("../db/migration-script.js");
const pgp = require("pg-promise")();
require("dotenv").config();
const dbConfig = {
    database: process.env.POSTGRES_DB,
    user: process.env.POSTGRES_USR,
    password: process.env.POSTGRES_PWD,
    host: process.env.POSTGRES_HOST,
    port: parseInt(process.env.POSTGRES_PORT),
    ensureDatabaseExists: true,
    defaultDatabase: "postgres"
};
const db = pgp(dbConfig);


describe("Migration Setup Tests", function() {

    before( async function() {

        try{
            await db.connect();}
        catch(error){ 
            console.log("db connection failed", error);
        }  

    });

    after(async function() {
        await pgp.end();


    });

    it("migration 01 works on current database", async function() {
        let id;

        try{
            migration.migration(); 
            id = await db.one("SELECT username FROM users where username = $1;", "testUser1");
        }catch(error)
        {console.error("migration 01 error",error);}

        assert.equal(id.username, "testUser1", `${id.username} does not equal testUser1`);

    });

    it("rollsback/forward", async function()  {

        //rolls back the last migration and applies new migration.  
        assert.doesNotThrow(function() {
            async function backForward() {
                id= await db.one("SELECT id FROM migrations ORDER BY id DESC LIMIT 1;");
                await db.none ("delete from migrations where id = $1", id.id);
                await migration.migration();
            }
            backForward();
        }, Error, "error in either rollback or rollforward. ");


    });

});