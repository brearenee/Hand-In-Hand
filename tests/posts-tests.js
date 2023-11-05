
const assert = require("assert");
const {dateToTimestampWithTz} = require("../src/utils/date-formatting");
const axios = require("axios");
const apiUrl = "https://localhost:3000/posts";
const fakeUser = ["MochaTestUser", 39.798770010686965, -105.07207748323874 ];
require("dotenv").config();
const {db}= require("../src/utils/db");
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

let userId;
let postId;
const postData = {
    user_id: "",
    title: "New Post",
    body: "This is the content of the new post.",
    type: "request"
};


describe("Post Routes Tests ", function() {

    before( async function() {
        //create a new user to test, returning the id.
        //if the user already exists, the query returns the userid of that user. 
        let response = await db.one(`
            INSERT INTO users (username, created_at, last_location) 
            VALUES
            ($1, CURRENT_TIMESTAMP, (SELECT id FROM locations WHERE lat = $2 AND long = $3))
            ON CONFLICT (username) DO UPDATE
            SET username = EXCLUDED.username
            RETURNING id`, fakeUser);
        userId = response.id;
        postData.user_id = userId;
    });

    after(async function() {
        //delete the things we created in this test, to make sure that the database is returned to the state it was in before. 
        await db.none("DELETE FROM posts WHERE user_id = $1", [userId]);
        await db.none("DELETE FROM users WHERE id = $1;", [userId]);
    });

    it("Post- Creates A Post", async function() {
        let response = await axios.post(apiUrl, postData);
        postId = response.data.id;
        assert.equal(response.status, 201, `returned ${response.status}, not 200`);
        assert.equal(response.data.title, postData.title, "Post was not created");
    });

    it("Post - Returns error if required fields arent given", async function() {
        postData.title = null;
        
        try{
            response = await axios.post(apiUrl, postData);
            assert.fail(`Expected 400, recieved ${response.status}`);
        }catch(error) {
            assert.equal(error.response.status, 400, `returned ${error.response.status}, not 400" ${error}`);
        }
    });

    it("Deletes A Post", async function()  {
        let deleted; 
        let deleteResponse;
        //create a post to delete. 
        //new created post returns an id we can later use to delete the post via post route. 
        postData.title = "test to delete";
        const sqlParams = Object.values(postData);
        let delPostId = await db.one(`
            INSERT INTO posts
                (user_id, location_id, title, body, type) 
            VALUES
                ($1,
                (SELECT id FROM locations WHERE lat = 39.798770010686965 AND long = -105.07207748323874),
                $2, $3, $4)
                RETURNING id;`, sqlParams );
        try{ 
            deleted = true; 
            deleteResponse =  await axios.delete(`${apiUrl}/${delPostId.id}`);
            await db.none("SELECT * FROM posts WHERE title = $1", postData.title);
        } catch (error){
            deleted = false;
            console.error("post was not deleted");
        }
        assert.equal(deleted, true, "Post was not deleted");
        assert.equal(deleteResponse.status, 204, `returned ${deleteResponse.status}, not 200`);
    });

    it("Get - Queries Posts By Time", async function() {
        let date = "2022-06-09";
        let new_date = dateToTimestampWithTz(date, -420);

        postData.title = "Test to delete2";
        postData.created_at = new_date;
        const sqlParams = Object.values(postData);
        await db.one(`
            INSERT INTO posts
                (user_id, location_id, title, body, type, created_at) 
            VALUES
                ($1,
                (SELECT id FROM locations WHERE lat = 39.798770010686965 AND long = -105.07207748323874),
                $2, $3, $4, $5)
                RETURNING id;`, sqlParams );


        const queryParams = {};
        queryParams.fromDate = "2022-05-09";
        queryParams.toDate = "2022-07-09";

        const response = await axios.get(apiUrl, {params: queryParams});
        assert.equal(Object.keys(response.data).length, 1, "error: entries =! 1. ");
        assert.equal(response.data[0].created_at, new_date,"created_at date not correct" );
    });

    it("Get - Returns 400 when missing required fields", async function() {
        const queryParams = {};
        let response;
        queryParams.fromDate = "2022-05-09";
        try{
            response = await axios.patch(`${apiUrl}/${postId.id}`, {params: queryParams});
            assert.fail(`Expected 500, recieved ${response.status}`);
        }catch(error){
            assert.equal(error.response.status, 500, `expected 500, recieved ${error.response.status}`);

        }

    });

    it("Patch - Edits a post", async function() {
        let response;
        try {
            response = await axios.patch(`${apiUrl}/${postId}`, {
                title: "Edited Title"
            });         
        } catch (error) {
            console.error("patch request for post route failed. ", error);
        } 
        assert.equal(response.data.title, "Edited Title");
    });

    it("Patch - Returns 404 with non existant id", async function() {
        postId = "00000000-1111-2222-3333-444444444444";
        let response;
        try {
            response = await axios.patch(`${apiUrl}/${postId}`, {
                title: "Updated Title",
                body: "Updated Body",
                type: "updated"
            });
            assert.fail(`Expected 404 Internal Server Error, recieved ${response.status}`);
        } catch (error) {
            assert.equal(error.response.status, 404, `expected 404, got ${error.response.status}`);
        }
    });

    it("Get - Queries Posts By Type", async function () {

        const queryType = "Free Marketplace Item";
    
        // Make an HTTP GET request to the getPostsByType endpoint with the specified type
        const response = await axios.get(`${apiUrl}/type/${queryType}`);
    
        // Assert that the response status is 200 (OK)
        assert.equal(response.status, 200, `Expected status code 200, but got ${response.status}`);
    
        // Assert that the response contains an array of posts
        assert(Array.isArray(response.data), "Response should be an array");
    
        // Assert that all posts in the response have the correct type
        response.data.forEach(post => {
            assert.equal(post.type, queryType, `Post type should be ${queryType}`);
        });
    });


});