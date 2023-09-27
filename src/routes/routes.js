/*
 * Resources: https://blog.logrocket.com/crud-rest-api-node-js-express-postgresql/
 * https://stackoverflow.com/questions/13397691/how-can-i-send-a-success-status-to-browser-from-nodejs-express
 * https://stackoverflow.com/questions/3582552/what-is-the-format-for-the-postgresql-connection-string-url
 * https://www.google.com/search?q=allow+legacy+dependacny+flag&oq=allow+legacy+dependacny+flag&aqs=chrome..69i57j33i10i160.7957j0j7&sourceid=chrome&ie=UTF-8
 *    https://reintech.io/blog/using-node-js-with-a-rest-api-the-best-libraries-for-developers 
 * 
 * 
 * PLEASE NOTE: THIS IS A VERY ROUGH DRAFT, used mainly to understand more of the API process,
 * and to figure out the curren http response format. See Teams for more documentation.
 * 
 * The Swagger documentation on this branch is currently working.  
 * 
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
*     parameters:
 *     - in: query
 *       name: param1
 *       required: false
 *       description: Enter in location_id
 *       schema:
 *         type: string
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 
 */


module.exports = function(app){

    app.get("/users", (request, response) => {
        pool.query("SELECT * from users", (error, result) => {
            if (error) {
                console.log("throwing error; unable to get users from postgres");
                throw error;
            }
            response.status(200).json(result.rows);
        });
    });

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
 *                
 */

/** 
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Delete a user
 *     description: Delete a user based off of their id. 
 *     parameters:
 *     - in: query
 *       name: id
 *       required: true
 *       description: Enter in user_id
 *       schema:
 *         type: string
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *             
 */

/** 
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get a user based on id
 *     description: Get a user based off of their id.
 *     parameters:
 *     - in: query
 *       name: id
 *       required: true
 *       description: Enter in user_id
 *       schema:
 *         type: string
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *              
 */

/** 
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Update a user based on id
 *     description: Update user
 *     parameters:
 *     - in: query
 *       name: id
 *       required: true
 *       description: Enter in user_id
 *       schema:
 *         type: string
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *       
 */





//Posts

/** 
 * @swagger
 * /posts/{id}:
 *   get:
 *     summary: Get a post based off of its id
 *     description: Get a specific post
 *     parameters:
 *     - in: query
 *       name: id
 *       required: false
 *       description: Enter in post_id
 *       schema:
 *         type: string
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *         
 */
/** 
 * @swagger
 * /posts/{id}:
 *   delete:
 *     summary: Delete a posts based off of its id
 *     description: Delete a specific post
 *     parameters:
 *     - in: query
 *       name: id
 *       required: false
 *       description: Enter in post_id
 *       schema:
 *         type: string
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *         
 */

/** 
 * @swagger
 * /posts:
 *   get:
 *     summary: Get all posts 
 *     description: Get all posts
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *            
 */


/** 
 * @swagger
 * /posts:
 *    post :
 *     summary: Create new post
 *     description: Create new post
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *         
 */

/** 
 * @swagger
 * /posts/{id}:
 *    put :
 *     summary: Update a post based on id
 *     description: Update a post based off of their id.
 *     parameters:
 *     - in: query
 *       name: id
 *       required: true
 *       description: Enter in post_id
 *       schema:
 *         type: string
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *              
 */

/** 
 * @swagger
 * /posts/{id}:
 *    Delete :
 *     summary: Delete a post based on id
 *     description: Delete a post based off of their id.
 *     parameters:
 *     - in: query
 *       name: id
 *       required: true
 *       description: Enter in post_id
 *       schema:
 *         type: string
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *          
 */

//locations
/** 
 * @swagger
 * /location :
 *   post:
 *     summary: Create new location
 *     description: Create location.
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *
 */

/** 
 * @swagger
 * /location/{location_id} :
 *   post:
 *     summary: Create new location
 *     description: Create location. Design TBD
*     parameters:
 *     - in: query
 *       name: id
 *       required: true
 *       description: Enter in location_id
 *       schema:
 *         type: string
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *        
 */




//free items


/** 
 * @swagger
 * /freeItem/{name}:
 *   get:
 *     summary: Get a freeItem based off of its name. 
 *     description: Get a specific freeItem. More Design TBD
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *        
 */
