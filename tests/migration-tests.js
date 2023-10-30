const assert = require("assert");
const {migration}  = require("../db/migration-script.js");
const {db}  = require("../src/utils/db.js");
require("dotenv").config();
const chai = require("chai");
const expect = chai.expect;


describe("Migration Setup Tests", function() {

    before( async function() {
        try{
            await db.connect();}
        catch(error){ 
            console.log("db connection failed", error);
        }  
        try{
            await migration(); }
        catch(error){ 
            console.log("migration script failed", error);
        }
    });

    after(async function() {
        //await pgp.end();
    });

    it("migration 001 works on current database", async function() {
        let id;
        try{
            id = await db.one("SELECT username FROM users where username = $1;", "testUser1");
        }catch(error)
        {console.error("migration 01 error: user doesnt exist",error);}
        assert.equal(id.username, "testUser1", `${id.username} does not equal testUser1`);

    });

    it("migration 002 works on current database", async function()  {
        let timestamp;
        try{
            timestamp = await db.one("SELECT request_from FROM posts where title = $1;", "TEST: Help Moving Desk");
        }catch(error)
        {console.error("migration 002 error: request_from doesnt exist",error);}
        expect(timestamp).to.not.be.null;
    });

});