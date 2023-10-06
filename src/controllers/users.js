//TODO:  logic for the routes // queries. 
/*const express = require('express');
const app = express();
const port = 3000; 


app.use(express.json());*/
require("dotenv").config();

const Pool = require("pg").Pool;
const path = require('path');

const pool = new Pool({
    user: process.env.POSTGRES_USR,
    host: process.env.POSTGRES_HOST,
    password: process.env.POSTGRES_PWD,
    database: process.env.POSTGRES_DB
});


app.get('/users', (req, res) => {
    it = pool.query('SELECT * FROM posts', (error, result) => {
        if (error) {
        console.log("throwing error") 
        throw error;}
        console.log(result)
        response.send(result.rows);
    })
    res.send(it);
});


app.getUser("/users/:userId", (request, response) => {
    const userId = request.params.userId;

    pool.query("SELECT * FROM users WHERE id = $1", [userId], (error, result) => {
        if (error) {
            console.log("throwing error; unable to get user from postgres");
            throw error;
        }
        response.status(200).json(result.rows[0]);
    });
});


app.post('/users', (req, res) => {
    res.send('Create a new user');
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
