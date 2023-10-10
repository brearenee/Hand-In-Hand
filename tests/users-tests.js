const assert = require("assert");
const axios = require("axios");
const apiUrl = "http://localhost:3000/users"; 
require("dotenv").config();
const {getDefaultLocation} = require('../src/controllers/post-controller.js')

const pgp = require("pg-promise")();
const {dbConfig}= require("../src/utils/db");
const db = pgp(dbConfig);

const userData = {
    id:"00000000-0000-0000-0000-000000000000",
    username:"testuser0",
    last_location:'',
    created_at:"2023-10-10T02:20:06.021Z",
    updated_at:"2023-10-10T02:20:06.021Z"
};

describe("Tests user routes", function() {
    before(async function() {
        //get location id (unqiue to each db)
        const locationId = await getDefaultLocation(39.798770010686965, -105.07207748323874)
        console.log("locationid", locationId)
        userData.last_location = locationId
    })

    after(async function(){
        //remove created user from db
        await db.none("DELETE FROM users WHERE id = $1", [userData.id]);
    });

    // Test to create a new user
    it("Post a new user", async function(){

        axios.post(apiUrl, userData).then(response => {
            assert.equal(response.data.id, userData.id, "does not equal testUser created.");
        });

    });

});