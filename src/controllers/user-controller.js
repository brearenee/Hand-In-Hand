const {pool} = require("../utils/db");
const express = require("express");
const app = express();
app.use(express.json());

//Get current time in correct format
const currentDate = new Date();
const timestamp = currentDate.toISOString();


// Get request for all users
const getAll = async (request, response) => {
    try {
        const result = await pool.query("SELECT * FROM users");
        response.status(200).json(result.rows);

    } catch (error) {
        response.status(500).json(error,"Internal Server Error");
    }
};


//Get request by user location
//TODO: Include code to find users within a radius of the location
const getUsersByLocation = async (request, response) => {
    try {
        const location = request.params.lastLocation; //location param
        const result = await pool.query("SELECT * FROM users WHERE last_location = $1", [location]);
        response.status(200).json(result.rows);

    } catch (error) {
        response.status(500).json(error,"Internal Server Error");
    }
};

//get user by email
const getUsersByEmail = async (request, response) => {
    try {
        const email = request.params.email; //location param
        const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
        response.status(200).json(result.rows);

    } catch (error) {
        response.status(500).send("Internal Server Error");
    }
};

//get user by username
const getUsersByUserName = async (request, response) => {
    try {
        const username = request.params.username; // param
        const result = await pool.query("SELECT * FROM users WHERE username = $1", [username]);
        response.status(200).json(result.rows);

    } catch (error) {
        console.log("Error fetching that user:", error);
        response.status(500).send("Internal Server Error");
    }
};




//Get user by id
const getUserByID = async (request, response) => {
    try {
        const userId = request.params.userId;
        const result = await pool.query("SELECT * FROM users WHERE id = $1", [userId]);
        response.status(200).json(result.rows);

    } catch (error) {
        response.status(500).send("Internal Server Error");
    }
};

// Post request for new user
const createUser = async (request, response) => {
    try {
        //created_at and updated_at the same at user creaation. 
        const {username, last_location, email, firebase_id} = request.body;
        const result = await pool.query("INSERT INTO users (username,created_at, last_location, email, updated_at, firebase_id) VALUES ($1, $2, $3, $4, $5, $6 ) RETURNING *;", [username, timestamp,last_location, email, timestamp, firebase_id]);
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
        const userId = request.params.userId;
        const result = await pool.query("DELETE FROM users WHERE id = $1", [userId]);
        response.status(200).json(result.rows);

    } catch (error) {
        console.log("Error deleting user:", error);
        response.status(500).json("Internal Server Error");
    }
};

const updateUser = async (request, response) =>{
    try{
        const userId = request.params.userId;

        // get user information from database to be able o update
        const userResult = await pool.query("SELECT * FROM users WHERE id = $1", [userId]);

        // Check if user is in database
        if (userResult.rows.length === 0) {
            response.status(404).json("User not found");
            return;
        }

        // Use reponse from user and update username and/or last_location and updated_at
        const userBody = userResult.rows[0];
        const newUserName = request.query.username;
        const newLastLocation = request.query.last_location;
        const newEmail = request.query.email;

        //Update updated_at timestamp
        userBody.updated_at = timestamp;
        
        // Update username and last_location and email
        if (newUserName && newLastLocation && newEmail){
            userBody.username = newUserName;
            userBody.last_location = newLastLocation;
            userBody.email = newEmail;
        }

        //if only new username and location
        if (newUserName && newLastLocation){
            userBody.username = newUserName;
            userBody.last_location = newLastLocation;
        }

        //if new username and email
        if (newUserName && newEmail){
            userBody.username = newUserName;
            userBody.email = newEmail;
        }

        //if new location and email
        if (newLastLocation && newEmail){
            userBody.last_location = newLastLocation;
            userBody.email = newEmail;
        }

        // Update just username
        else if (newUserName){
            userBody.username = newUserName;
        }

        //Update just last_location
        else if (newLastLocation){
            userBody.last_location = newLastLocation;
        }
        
        // Http Put request to update user with new user information
        const result = await pool.query("UPDATE users SET username = $2, last_location = $3, created_at = $4, updated_at = $5 WHERE id = $1 RETURNING *",
            [userBody.id, userBody.username, userBody.last_location, userBody.created_at, userBody.updated_at]);
        response.status(200).json(result.rows);

    } catch (error) {
        // Log errors
        console.log("Error creating user:", error);
        console.log(request.body);
        response.status(500).json("Internal Server Error");
    }
};


//exports for modules
module.exports = {
    getAll,
    getUserByID,
    createUser,
    deleteUserByID,
    getUsersByLocation,
    updateUser,
    getUsersByEmail,
    getUsersByUserName
};