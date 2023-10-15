const assert = require("assert");
const axios = require('axios');
const { error } = require("console");
const { response } = require("express");
const apiUrl = 'http://localhost:3000/users'; // Replace with your actual API endpoint URL
require("dotenv").config();

const pgp = require('pg-promise')();
const {dbConfig}= require('../src/utils/db')
const db = pgp(dbConfig);


const userData = {
    id:"00000000-0000-0000-0000-000000000000",
    username:"testuser0",
    last_location:"586d8255-e629-4eda-a78b-af2ac0c6a4d9",
    created_at:"2023-10-10T02:20:06.021Z",
    updated_at:"2023-10-10T02:20:06.021Z"
};

describe("Tests user routes", function() {

    //remove created user after every test
    afterEach(async function() {
        await db.none('DELETE FROM users WHERE id = $1', [userData.id]);
    });

    // Test to create a new user
    it("Post a new user", async function(){


        //post new user
        axios.post(apiUrl, userData).then(response => {
            assert.equal(response.data.id, userData.id, `does not equal testUser created.`);
        });

});

it("Delete a user", async function() {
    let empty;
    //make a new user to delete
    await db.one('INSERT INTO users (id, username, last_location, created_at, updated_at) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [userData.id, userData.username, userData.last_location, userData.created_at, userData.updated_at])

    //Delete user
    try {
       await axios.delete(`${apiUrl}/${userData.id}`);

    } catch (error) {
       throw error; // Throw any errors to fail the test
    }

    // Check if the user is deleted from the database
    try{
        empty = true;
        await db.none('SELECT * FROM users WHERE id = $1 AND username = $2', [userData.id, userData.username]);

    } catch{
        empty = false;
        console.log("User not deleted")
    
    }

    assert.equal(empty, true, 'User still exists in the database');
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
    await db.one('INSERT INTO users (id, username, last_location, created_at, updated_at) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    [userData.id, userData.username, userData.last_location, userData.created_at, userData.updated_at])

    try {
       const response = await axios.get(`${apiUrl}/${userData.id}`);
       assert.equal(response.data[0].id, userData.id, 'User was not retrieved');

    } catch (error) {
       throw error; // Throw any errors to fail the test
    }
   });

it("Get user by location", async function() {
    await db.one('INSERT INTO users (id, username, last_location, created_at, updated_at) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    [userData.id, userData.username, userData.last_location, userData.created_at, userData.updated_at])

    try {
       const response = await axios.get(`${apiUrl}/location/${userData.last_location}`);
       assert.equal(response.data[0].last_location, userData.last_location, 'User was not retrieved');
    } catch (error) {
        console.log(response)
       throw error; // Throw any errors to fail the test
    }
   });

});