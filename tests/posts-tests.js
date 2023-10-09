
const assert = require("assert");
const axios = require('axios');
const apiUrl = 'http://localhost:3000/posts';
const fakeUser = ['MochaTestUser', 39.798770010686965, -105.07207748323874 ]
require("dotenv").config();

const pgp = require('pg-promise')();
const {dbConfig}= require('../src/utils/db')
const db = pgp(dbConfig);
let userId;
const postData = {
    user_id: '',
    title: 'New Post',
    body: 'This is the content of the new post.',
    type: 'request'
    };

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
        postData.user_id = userId
    });

    after(async function() {
        //delete the post we created, if it exists. 
        await db.none('DELETE FROM posts WHERE user_id = $1', [userId])
        //delete the user we created so that the database is returned to the state it was before the tests. 
        await db.none('DELETE FROM users WHERE id = $1;', [userId])


    });

    it("createPosts works", async function() {
        let response;
        response = await axios.post(apiUrl, postData)

        assert.equal(response.status, 201, `returned ${response.status}, not 200`)
        assert.equal(response.data.title, postData.title, `Post was not created`);
    });

    it("deletes a post", async function()  {
        let deleted; 
        //create a post to delete. 
        //new created post returns an id we can later use to delete the post via post route. 
        postData.title = 'test to delete'
        const sqlParams = Object.values(postData);
        let postId = await db.one(`
            INSERT INTO posts
                (user_id, location_id, title, body, type) 
            VALUES
                ($1,
                (SELECT id FROM locations WHERE lat = 39.798770010686965 AND long = -105.07207748323874),
                $2, $3, $4)
                RETURNING id;`, sqlParams );

        //call the DELETE posts route using the id of the post we just created. 
        let deleteResponse =  await axios.delete(`${apiUrl}/${postId.id}`)

        //check that the response is deleted. 
        try{ 
            deleted = true 
            console.log(postData.title)
            await db.none(`SELECT * FROM posts WHERE title = $1`, postData.title)
        } catch (error){
            deleted = false
            console.error("post was not deleted")
        }

        assert.equal(deleted, true, 'Post was not deleted')
        assert.equal(deleteResponse.status, 204, `returned ${deleteResponse.status}, not 200`)
    });

});