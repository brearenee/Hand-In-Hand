const assert = require("assert");
const sinon = require("sinon");
const axios = require("axios");
const apiUrl = "https://localhost:3000/users"; // Replace with your actual API endpoint URL
require("dotenv").config();
const {db, pool}= require("../src/utils/db");
const {getDefaultLocation}= require("../src/controllers/post-controller");
const {
    getAll, getUsersByLocation, getUsersByEmail, getUserByID, createUser,
    deleteUserByID, updateUser
} = require("../src/controllers/user-controller"); 

const users = require("../src/controllers/user-controller");
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";


const userData = {
    username:"testuser00",
    last_location: "",
    email: "Test@testmail.com",
    created_at:"2023-10-10T02:20:06.021Z",
    updated_at:"2023-10-10T02:20:06.021Z"
};
let fakeUserId;


describe("Tests user routes Integration", function() {

    before( async function() {
        try{
            userData.last_location = await getDefaultLocation(39.798770010686965,  -105.07207748323874);
        }catch(error){ console.log("location id error", error);}
    });

    //remove created user after every test
    afterEach(async function() {
        await db.none("DELETE FROM users WHERE id = $1", [fakeUserId]);
    });


    // Test to create a new user
    it("Post a new user", async function(){

        //post new user
        try {

            let response = await axios.post(apiUrl, userData); 
            fakeUserId = response.data[0].id;
            assert.equal(response.data[0].username, userData.username, "does not equal testUser created.");
        } catch (error){
            console.log(error);
            throw error;
        }
    });

    it("Delete a user", async function() {
        let empty;
        //make a new user to delete
        let response = await db.one("INSERT INTO users (username, last_location, email, created_at, updated_at) VALUES ($1, $2, $3, $4, $5) RETURNING *",
            [userData.username, userData.last_location, userData.email, userData.created_at, userData.updated_at]);
    
        fakeUserId = response.id;

        //Delete user
        try {
            await axios.delete(`${apiUrl}/${fakeUserId}`);

        } catch (error) {
            throw error; // Throw any errors to fail the test
        }

        // Check if the user is deleted from the database
        try{
            empty = true;
            await db.none("SELECT * FROM users WHERE id = $1 AND username = $2", [fakeUserId, userData.username]);

        } catch{
            empty = false;
            console.log("User not deleted");
    
        }

        assert.equal(empty, true, "User still exists in the database");
        await db.none("DELETE FROM users WHERE id = $1", [response.id]);
    });

    it("Get all users", async function() {
        try {
            const response = await axios.get(`${apiUrl}`);
            assert.equal(response.status, 200, "Users were not retrieved");
        } catch (error) {
            throw error; // Throw any errors to fail the test
        }
    });

    it("Get user by id", async function() {

        let response = await db.one("INSERT INTO users ( username, last_location, email, created_at, updated_at) VALUES ($1, $2, $3, $4, $5 ) RETURNING *",
            [userData.username, userData.last_location, userData.email, userData.created_at, userData.updated_at]);
        fakeUserId = response.id;

        try {
            const response = await axios.get(`${apiUrl}/${fakeUserId}`);
            assert.equal(response.data[0].id, fakeUserId, "User was not retrieved");

        } catch (error) {
            throw error; // Throw any errors to fail the test
        }

    });

    it("Get users by location", async function() {
        let response = await db.one("INSERT INTO users (username, last_location, email, created_at, updated_at) VALUES ($1, $2, $3, $4, $5) RETURNING *",
            [userData.username, userData.last_location, userData.email, userData.created_at, userData.updated_at]);

        try {
            const response = await axios.get(`${apiUrl}/location/${userData.last_location}`);
            assert.equal(response.data[0].last_location, userData.last_location, "User was not retrieved");
        } catch (error) {
            console.log(response);
            throw error; // Throw any errors to fail the test
        }
        await db.none("DELETE FROM users WHERE id = $1", [response.id]);
    });

    it("Get users by email", async function() {
        let response = await db.one("INSERT INTO users (username, last_location, email, created_at, updated_at) VALUES ($1, $2, $3, $4, $5) RETURNING *",
            [userData.username, userData.last_location, userData.email, userData.created_at, userData.updated_at]);

        try {
            const response = await axios.get(`${apiUrl}/email/${userData.email}`);
            assert.equal(response.data[0].email, userData.email, "User was not retrieved");
        } catch (error) {
            console.log(response);
            throw error; // Throw any errors to fail the test
        }
        await db.none("DELETE FROM users WHERE id = $1", [response.id]);
    });

    it("Put request", async function(){

        let response = await db.one("INSERT INTO users (username, last_location, email, created_at, updated_at) VALUES ($1, $2, $3, $4, $5) RETURNING *",
            [userData.username, userData.last_location, userData.email, userData.created_at, userData.updated_at]);
    
        fakeUserId = response.id;
        userData.username = "newTestName";


        //test updating username
        try{
            await axios.put(`${apiUrl}/${fakeUserId}?username=${userData.username}`, userData).then(response => {
                assert.equal(response.data[0].username, userData.username, "did not update username.");
            });
        } catch (error ){
            console.log("failed to update user with new username");
            throw error;
        }

        //test updating email
        try{
            await axios.put(`${apiUrl}/${fakeUserId}?email=${userData.email}`, userData).then(response => {
                assert.equal(response.data[0].email, userData.email, "did not update username.");
            });
        } catch (error ){
            console.log("failed to update user with email");
            throw error;
        }

        //test for updating both email and username at once
        try{
            await axios.put(`${apiUrl}/${fakeUserId}?username=${userData.username}&email=${userData.email}`, userData).then(response => {
                assert.equal(response.data[0].username, userData.username, "did not update username.");
                assert.equal(response.data[0].email, userData.email, "did not update email");
            });
        } catch (error ){
            console.log("failed to update username and email");
            throw error;
        }
    });


});

describe("User Unit Tests", function() {
    let req;
    let res;
    let sandbox;

    before(function() {      
    });
  
    beforeEach(function() {
        sandbox = sinon.createSandbox();
        req = {
            params: {
                userId: 1, // Specify the post ID to edit
                lastLocation:1
            },
            query: {
                username: "TestUser",
                last_location: 1, 
                email: "a@b.com"

            },
            body: {
                username: "Updated Title",
                email: "Updated Body",
                location_id: 2,
                type: "updated",
            }
        };
        res = {
            status: sandbox.stub().returnsThis(),
            json: sandbox.spy()
        };
    });
  
    afterEach(function() {
        sandbox.restore();
    });
  
    it("get all users", async function(){     
        // Stub the pool.query method within the sandbox to simulate a successful database update
        const poolQueryStub = sandbox.stub(pool, "query");
        poolQueryStub.resolves({ rows: [{ id: 1, username: "TestUser", email: "a@b.com" }] });
      
        // Call the editPost function with the provided request and response objects
        await getAll(req, res);
      
        // Assert the response status and JSON payload
        sinon.assert.calledOnceWithExactly(res.status, 200);
    });

    it("gets all users returns 500", async function(){
        const poolQueryStub = sandbox.stub(pool, "query");
        const error = new Error("Database query failed");
        poolQueryStub.rejects(error);
        await getAll(req, res);
        sinon.assert.calledOnceWithExactly(res.status, 500);
    });

    it("gets users by location", async function(){
        const poolQueryStub = sandbox.stub(pool, "query");
        poolQueryStub.resolves({ rows: [{ id: 1, username: "TestUser", email: "a@b.com" }] });
        await getUsersByLocation(req, res);
        sinon.assert.calledOnceWithExactly(res.status, 200);
    });
    it("gets users by location returns 500", async function(){
        const poolQueryStub = sandbox.stub(pool, "query");
        const error = new Error("Database query failed");
        poolQueryStub.rejects(error);
        await getUsersByLocation(req, res);
        sinon.assert.calledOnceWithExactly(res.status, 500);
    });

    it("gets users by email", async function(){
        const poolQueryStub = sandbox.stub(pool, "query");
        poolQueryStub.resolves({ rows: [{ id: 1, username: "TestUser", email: "a@b.com" }] });
        await getUsersByEmail(req, res);
        sinon.assert.calledOnceWithExactly(res.status, 200);
    });

    it("gets users by ID", async function(){
        const poolQueryStub = sandbox.stub(pool, "query");
        poolQueryStub.resolves({ rows: [{ id: 1, username: "TestUser", email: "a@b.com" }] });
        await getUserByID(req, res);
        sinon.assert.calledOnceWithExactly(res.status, 200);
    });
    it("creates user", async function(){
    
        const poolQueryStub = sandbox.stub(pool, "query");
        poolQueryStub.resolves({ rows: [{ id: 1, username: "TestUser", email: "a@b.com" }] });
        await createUser(req, res);
        sinon.assert.calledOnceWithExactly(res.status, 200);
    });

    it("deletes user", async function(){

        const poolQueryStub = sandbox.stub(pool, "query");
        poolQueryStub.resolves({ rows: [{ id: 1, username: "TestUser", email: "a@b.com" }] });
        await deleteUserByID(req, res);
        sinon.assert.calledOnceWithExactly(res.status, 200);
    });

    it("updates user- not found", async function(){
        const poolQueryStub = sandbox.stub(pool, "query");
        poolQueryStub.resolves({ rows: [] });
        await updateUser(req, res);
        sinon.assert.calledOnceWithExactly(res.status, 404);
    });

    it("updates all fields in user", async function(){
        const poolQueryStub = sandbox.stub(pool, "query");
        poolQueryStub.resolves({ rows: [{ id: 1, username: "TestUser", email: "a@b.com", last_location: 1 }] });
        await updateUser(req, res);
        sinon.assert.calledOnceWithExactly(res.status, 200);
    });
});
