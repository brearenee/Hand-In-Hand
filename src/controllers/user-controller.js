const pool = require('../utils/db')
const express = require('express');
const app = express();
app.use(express.json());



const getAll = async (request, response) => {
    try {
        const result = await pool.query("SELECT * FROM users");
        response.status(200).json(result.rows);

    } catch (error) {
        console.log("Error fetching users:", error);
        response.status(500).send("Internal Server Error");
    }
};

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

module.exports = {
    getAll,
    getUserByID
};
