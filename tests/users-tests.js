const assert = require("assert");
const axios = require('axios');
const apiUrl = 'http://localhost:3000/users'; // Replace with your actual API endpoint URL
require("dotenv").config();

const pgp = require('pg-promise')();
const {dbConfig}= require('../src/utils/db')
const {getDefaultLocation}= require('../src/controllers/post-controller')
const db = pgp(dbConfig);


const userData = {
    username:"testuser0",
    last_location: "",
    created_at:"2023-10-10T02:20:06.021Z",
    updated_at:"2023-10-10T02:20:06.021Z"
};
let fakeUserId;


describe("Tests user routes", function() {

    before( async function() {
        try{
            userData.last_location = await getDefaultLocation(39.798770010686965,  -105.07207748323874)
        }catch(error){ console.log("location id error", error)}
    });


    //remove created user after every test
    afterEach(async function() {
        await db.none('DELETE FROM users WHERE id = $1', [fakeUserId]);
    });

    // Test to create a new user
    it("Post a new user", async function(){

        //post new user
        try {

            let response = await axios.post(apiUrl, userData); 
            fakeUserId = response.data[0].id;
            assert.equal(response.data[0].username, userData.username, `does not equal testUser created.`);
        } catch (error){
            console.log(error);
            throw error;
        }
});

it("Delete a user", async function() {
    let empty;
    //make a new user to delete
    let response = await db.one('INSERT INTO users (username, last_location, created_at, updated_at) VALUES ($1, $2, $3, $4) RETURNING *',
        [userData.username, userData.last_location, userData.created_at, userData.updated_at])
    
        fakeUserId = response.id

    //Delete user
    try {
       await axios.delete(`${apiUrl}/${fakeUserId}`);

    } catch (error) {
       throw error; // Throw any errors to fail the test
    }

    // Check if the user is deleted from the database
    try{
        empty = true;
        await db.none('SELECT * FROM users WHERE id = $1 AND username = $2', [fakeUserId, userData.username]);

    } catch{
        empty = false;
        console.log("User not deleted")
    
    }

    assert.equal(empty, true, 'User still exists in the database');
    await db.none('DELETE FROM users WHERE id = $1', [response.id]);
});

it("Get all users", async function() {
    try {
        const response = await axios.get(`${apiUrl}`);
        assert.equal(response.status, 200, 'Users were not retrieved');
    } catch (error) {
        throw error; // Throw any errors to fail the test
    }
});

it("Get user by id", async function() {

    let response = await db.one('INSERT INTO users ( username, last_location, created_at, updated_at) VALUES ($1, $2, $3, $4 ) RETURNING *',
    [userData.username, userData.last_location, userData.created_at, userData.updated_at])
    fakeUserId = response.id

    try {
       const response = await axios.get(`${apiUrl}/${fakeUserId}`);
       assert.equal(response.data[0].id, fakeUserId, 'User was not retrieved');

    } catch (error) {
       throw error; // Throw any errors to fail the test
    }

   });

it("Get users by location", async function() {
    let response = await db.one('INSERT INTO users (username, last_location, created_at, updated_at) VALUES ($1, $2, $3, $4) RETURNING *',
    [userData.username, userData.last_location, userData.created_at, userData.updated_at])

    try {
       const response = await axios.get(`${apiUrl}/location/${userData.last_location}`);
       assert.equal(response.data[0].last_location, userData.last_location, 'User was not retrieved');
    } catch (error) {
        console.log(response)
       throw error; // Throw any errors to fail the test
    }
    await db.none('DELETE FROM users WHERE id = $1', [response.id]);
   });

   it("Put request", async function(){

    let response = await db.one('INSERT INTO users (username, last_location, created_at, updated_at) VALUES ($1, $2, $3, $4) RETURNING *',
    [userData.username, userData.last_location, userData.created_at, userData.updated_at])
    
    fakeUserId = response.id
    userData.username = "newTestName";


    try{
        await axios.put(`${apiUrl}/${fakeUserId}?username=${userData.username}`, userData).then(response => {
            assert.equal(response.data[0].username, userData.username, `did not update username.`);
        });
    } catch (error ){
        console.log("failed to update user");
        throw error;
    }
})


});