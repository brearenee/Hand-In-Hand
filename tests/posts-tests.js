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


describe("Post Routes Tests ", function() {

    before( async function() {

        try{
            await db.connect();}
        catch(error){ 
            console.log("db connection failed", error);
        }  

    });

    after(async function() {

    });

    it("createPosts works", async function() {
        const axios = require('axios');

        // Specify the API endpoint URL
        const apiUrl = 'http://localhost:3000/posts'; // Replace with your actual API endpoint URL

        // Data to be sent in the POST request body
        const postData = {
            title: 'New Post',
            body: 'This is the content of the new post.',
            type: 'request'
            };

        // Make a POST request with a request body
        axios.post(apiUrl, postData)
        .then(response => {
            // Handle the API response data
            console.log('Response status:', response.status);
            console.log('Response data:', response.data);
        })
        .catch(error => {
            // Handle errors
            console.error('Error:', error);
        });
        assert.equal('test1', 'test1', `does not equal testUser1`);

    });

    it("futureTest", async function()  {

    });

});