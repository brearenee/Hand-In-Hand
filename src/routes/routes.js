/*
 * Resources: https://blog.logrocket.com/crud-rest-api-node-js-express-postgresql/
 * https://stackoverflow.com/questions/13397691/how-can-i-send-a-success-status-to-browser-from-nodejs-express
 * https://stackoverflow.com/questions/3582552/what-is-the-format-for-the-postgresql-connection-string-url
 * https://www.google.com/search?q=allow+legacy+dependacny+flag&oq=allow+legacy+dependacny+flag&aqs=chrome..69i57j33i10i160.7957j0j7&sourceid=chrome&ie=UTF-8
 *    https://reintech.io/blog/using-node-js-with-a-rest-api-the-best-libraries-for-developers 
 * 
 * 
 * PLEASE NOTE: THIS IS A VERY ROUGH DRAFT, used mainly to understand more of the API process,
 * and to figure out the curren http response format. 
 * 
 * The Swagger documentation on this branch is currently working.  
 * It will only run when app-1 container is not running due to port usage.
 * 
 * TODO: Figure out how app-1 container can be included in this api.
 * TODO: create schemas for api.
 * 
 * 
 */

require("dotenv").config();

const Pool = require("pg").Pool;

const pool = new Pool({
    user: process.env.POSTGRES_USR,
    host: process.env.POSTGRES_HOST,
    password: process.env.POSTGRES_PWD,
    database: process.env.POSTGRES_DB
});
/** 
 * @swagger
 * /users:
 *   get:
 *     summary: Retrieve a list of users
 *     description: Get a list of all users from the database
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */


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

/** 
 * @swagger
 * /users:
 *   post:
 *     summary: Add a user
 *     description: Add a user
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */

/** 
 * @swagger
 * /users:
 *   delete:
 *     summary: Delete a user
 *     description: Delete a user based off of their api id. 
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */

/** 
 * @swagger
 * /users {id}:
 *   get:
 *     summary: get a user based on id
 *     description: Get a user based off of their id.
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */

/** 
 * @swagger
 * /users {id}:
 *   get:
 *     summary: get a user based on id
 *     description: Get a user based off of their id.
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */

/** 
 * @swagger
 * /users {id}:
 *   put:
 *     summary: Update a user based on id
 *     description: Update user
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */





//Posts

/** 
 * @swagger
 * /posts {id}:
 *   get:
 *     summary: Get a post based off of its id
 *     description: Get a specific post
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */
/** 
 * @swagger
 * /posts {id}:
 *   delete:
 *     summary: Delete a posts based off of its id
 *     description: Delete a specific post
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */
/** 
 * @swagger
 * /posts:
 *   delete:
 *     summary: Delete all posts 
 *     description: Delete a post
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */

/** 
 * @swagger
 * /posts:
 *   get:
 *     summary: get all posts 
 *     description: Get all posts
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */

/** 
 * @swagger
 * /posts {id }:
 *    put :
 *     summary: Update a user based on id
 *     description: Update a user based off of their id.
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */


//free items


/** 
 * @swagger
 * /freeItem {name}:
 *   get:
 *     summary: Get a freeItem based off of its name
 *     description: Get a specific freeItem
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */
/** 
 * @swagger
 * /freeItem {id}:
 *   delete:
 *     summary: Delete a freeItem based off of its id
 *     description: Delete a specific freeItem
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */
/** 
 * @swagger
 * /freeItem:
 *   delete:
 *     summary: Delete all freeItem
 *     description: Delete a freeItem
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */

/** 
 * @swagger
 * /freeItem:
 *   get:
 *     summary: get all freeItems
 *     description: Get all freeItem
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */



/** 
 * @swagger
 * /freeItem :
 *   post:
 *     summary: create new freeItem
 *     description: create freeItem
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */