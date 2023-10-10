const {pool} = require('../utils/db')
const express = require('express');
const app = express();
app.use(express.json());



// Get request for all users
const getAll = async (request, response) => {
    try {
        const result = await pool.query("SELECT * FROM users");
        response.status(200).json(result.rows);

    } catch (error) {
        console.log("Error fetching users:", error);
        response.status(500).send("Internal Server Error");
    }
};


//Get request by user location
//TODO: Include code to find users within a radius of the location
const getUsersByLocation = async (request, response) => {
    try {
        const location = request.params.lastLocation //location param
        const result = await pool.query("SELECT * FROM users WHERE last_location = $1", [location]);
        response.status(200).json(result.rows);

    } catch (error) {
        console.log("Error fetching users in that location:", error);
        response.status(500).send("Internal Server Error");
    }
};

//Get user by id
const getUserByID = async (request, response) => {
    try {
        const userId = request.params.userId
        const result = await pool.query("SELECT * FROM users WHERE id = $1", [userId]);
        response.status(200).json(result.rows);

    } catch (error) {
        console.log("Error fetching user:", error);
        response.status(500).send("Internal Server Error");
    }
};

// Post request for new user
const createUser = async (request, response) => {
    try {
        const {id, username, last_location, created_at, updated_at} = request.body;
        const result = await pool.query('INSERT INTO users (id, username, last_location, created_at, updated_at) VALUES ($1, $2, $3, $4, $5) RETURNING *', [id, username, last_location, created_at, updated_at]);
        response.status(200).json(result.rows);

    } catch (error) {
        console.log("Error creating user:", error);
        console.log(request.body);
        response.status(500).send("Internal Server Error");
    }
};

// Delete request for a specific user
const deleteUserByID = async (request, response) => {
    try {
        const userId = request.params.userId
        const result = await pool.query("DELETE FROM users WHERE id = $1", [userId]);
        response.status(200).json(result.rows);

    } catch (error) {
        console.log("Error deleting user:", error);
        response.status(500).send("Internal Server Error");
    }
};


//exports for modules
module.exports = {
    getAll,
    getUserByID,
    createUser,
    deleteUserByID,
    getUsersByLocation
};