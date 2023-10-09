
const assert = require("assert");
const axios = require('axios');
const apiUrl = 'http://localhost:3000/posts';
const fakeUser = ['MochaTestUser', 39.798770010686965, -105.07207748323874 ]
require("dotenv").config();

const pgp = require('pg-promise')();
const {dbConfig}= require('../src/utils/db')
const db = pgp(dbConfig);
let userId;

//const pool = require('../utils/db')
//const db = pgp({ pool });


describe("Post Routes Tests ", function() {

    before( async function() {
        //create a new user to test
        //this query inserts the user and returns the new auto generated id.  
        //if the user already exists, the query returns the userid of that user. 
        let response = await db.one(`
            INSERT INTO users (username, created_at, last_location) 
            VALUES
            ($1, CURRENT_TIMESTAMP, (SELECT id FROM locations WHERE lat = $2 AND long = $3))
            ON CONFLICT (username) DO UPDATE
            SET username = EXCLUDED.username
            RETURNING id`, fakeUser);

        userId = response.id
    });

    after(async function() {
        //delete the post we created, if it exists. 
        await db.none('DELETE FROM posts WHERE user_id = $1', [userId])
        //delete the user we created so that the database is returned to the state it was before the tests. 
        await db.none('DELETE FROM users WHERE id = $1;', [userId])


    });

    it("createPosts works", async function() {
        let response;
        const postData = {
            user_id: '',
            title: 'New Post',
            body: 'This is the content of the new post.',
            type: 'request'
            };

        //I don't believe I can create the initial object with a variable (userId), so I'm updating the object after creation.      
        postData.user_id = userId

        response = await axios.post(apiUrl, postData)

            console.log("createPostsError")

        assert.equal(response.status, 201, `returned ${response.status}, not 200`)
        assert.equal(response.data.title, postData.title, `Post was not created`);

    });

    it("futureTest", async function()  {

    });

});