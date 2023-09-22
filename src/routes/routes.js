/*
 * Resources: https://blog.logrocket.com/crud-rest-api-node-js-express-postgresql/
 * https://stackoverflow.com/questions/13397691/how-can-i-send-a-success-status-to-browser-from-nodejs-express
 * https://stackoverflow.com/questions/3582552/what-is-the-format-for-the-postgresql-connection-string-url
 * https://www.google.com/search?q=allow+legacy+dependacny+flag&oq=allow+legacy+dependacny+flag&aqs=chrome..69i57j33i10i160.7957j0j7&sourceid=chrome&ie=UTF-8
 *    https://reintech.io/blog/using-node-js-with-a-rest-api-the-best-libraries-for-developers 
 * 
 * 
 * Instructions:
 * install ThunderClient(TC) extension to VSCode to see http requests
 * change .env file to export each line
 * enter ". .env" in VSCode editor. 
 * copy .env file into dev.env file
 * set TC to use dev.env as environment variables
 * start server: npm run start
 * select new request in TC
 * view http://localhost:3000/users in TC with GET function to make GET requests.
 * 
 * Current response format:
 * [
  {
    "id": "fd46d14a-f382-44cf-ac30-ce1eaf485eaa",
    "username": "testUser1",
    "last_location": "b35cd847-42eb-496f-b23a-de5ce41ac754",
    "created_at": "2023-09-20T21:01:31.583Z",
    "updated_at": "2023-09-20T21:01:31.583Z"
  },
  {
    "id": "9e88ef9f-7d9b-4286-baa8-0b37d7a0940e",
    "username": "testUser2",
    "last_location": "b35cd847-42eb-496f-b23a-de5ce41ac754",
    "created_at": "2023-09-20T21:01:31.583Z",
    "updated_at": "2023-09-20T21:01:31.583Z"
  },
  {
    "id": "eafeab76-a8b8-4a73-a076-f4466c2e824b",
    "username": "testUser3",
    "last_location": "b35cd847-42eb-496f-b23a-de5ce41ac754",
    "created_at": "2023-09-20T21:04:31.159Z",
    "updated_at": "2023-09-20T21:04:31.159Z"
  },
  {
    "id": "f94a7e7e-eafd-48c8-b4e9-12f0ee7064bf",
    "username": "testUser4",
    "last_location": "b35cd847-42eb-496f-b23a-de5ce41ac754",
    "created_at": "2023-09-20T21:04:31.159Z",
    "updated_at": "2023-09-20T21:04:31.159Z"
  }
];
 */

//const path = require("path");
//const users = require("../controllers/users.js");
//const express = require('express')
//const router = express.Router()
//const users = require('/Users/jess/projects/senior-experience-group-project-community-first/src/controllers/users.js')

require("dotenv").config();

const Pool = require("pg").Pool;

const pool = new Pool({
    user: process.env.POSTGRES_USR,
    host: process.env.POSTGRES_HOST,
    password: process.env.POSTGRES_PWD,
    database: process.env.POSTGRES_DB
});

module.exports = function(app){

    app.get("/users", (request, response) => {
        pool.query("SELECT * from users", (error, result) => {
            if (error) {
                console.log("throwing error");
                throw error;
            }
              response.status(200).json(result.rows);
        });
    });

/*app.post("/users", (req, res) => {
    res.send("Create a new user");
});

app.get("/", function(req, res) {
  console.log("INITIAL REQUEST");
  res.sendFile(path.join(__dirname, "../../public/index.html"));
});

app.get("/posts", (request, response) => {
        console.log("POST ROUTE CALLED");

    
    });*/
};
