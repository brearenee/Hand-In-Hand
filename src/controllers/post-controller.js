const {pool} = require("../utils/db");
const express = require("express");
const app = express();
app.use(express.json());
require("dotenv").config();

// Check for dev vs. production environment and set baseUrl
let baseUrl; 
if (process.env.NODE_ENV == "production"){
    baseUrl = "https://hand-in-hand-f3ebe38822bf.herokuapp.com";
} else{
    baseUrl = "https://localhost:3000";
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}

async function editPost(req, res) {
    request = await req;
    const postId = req.params.postId; // Assuming the post ID is passed as a URL parameter

    const { title, body, location_id, type } = request.body;

    try {
        // Check if the post with the given ID exists
        const existingPost = await pool.query("SELECT * FROM posts WHERE id = $1", [postId]);

        if (existingPost.rows.length === 0) {
            return res.status(404).json({ error: "Post not found." });
        }

        // Update the post in the database, only if the fields are provided in the request
        const updateFields = {};
        if (title !== undefined) {
            updateFields.title = title;
        }
        if (body !== undefined) {
            updateFields.body = body;
        }
        if (location_id !== undefined) {
            updateFields.location_id = location_id;
        }
        if (type !== undefined) {
            updateFields.type = type;
        }

        // Update the post in the database with the provided fields
        const result = await pool.query(
            "UPDATE posts SET title = COALESCE($1, title), body = COALESCE($2, body), location_id = COALESCE($3, location_id), type = COALESCE($4, type), updated_at = now() WHERE id = $5 RETURNING *",
            [updateFields.title, updateFields.body, updateFields.location_id, updateFields.type, postId]
        );

        res.status(200).json(result.rows[0]); // Respond with the updated post
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
}

async function getPostById(req, res) {
    const postId = req.params.postId;
    try{
        const result = await pool.query("SELECT * FROM posts where id = $1", [postId]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "No posts found with this id" });
        }
        else {return res.status(202).json(result.rows);}
    }catch(error){
        res.status(500).json({error: "Internal Server Error"});
    }
}

//get all by default. Filter by parmeters when passed. 
//needs BOTH to and from dates in the form YYY-MM-DD
async function getPosts(req, res) {
    const fromDate = req.query.fromDate;
    const toDate = req.query.toDate;
    const locationId = req.query.locationId;
    const userId = req.query.userId;

    let query = "SELECT * FROM posts WHERE 1=1 ";
    const queryParams = [];

    if (fromDate && toDate) {
        query += " AND created_at::DATE BETWEEN $1::DATE AND $2::DATE";
        queryParams.push(fromDate, toDate);
    }

    if (locationId) {
        query += " AND location_id = $" + (queryParams.length + 1);
        queryParams.push(locationId);
    }

    if (userId) {
        query += " AND user_id = $" + (queryParams.length + 1);
        queryParams.push(userId);
    }

    query += " ORDER BY request_from ASC";

    try {
        const result = await pool.query(query, queryParams);
        res.status(200).json(result.rows);
    } catch (error) {
        // console.error("ERROR: getPosts ", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}
//userId is path parameter at URL posts/user/:userId
async function getPostsByUserId(req, res) {
    const userId = req.params.userId;
    //console.log(userId);
    try{
        const result = await pool.query("SELECT * FROM posts where user_id = $1", [userId]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "No posts found for this user." });
        }
        res.status(200).json(result.rows);
    }catch(error){
        //console.error("ERROR: getPostsByUserId",error);
        res.status(500).json({error: "Internal Server Error"});
    }
}

async function getPostsByType(req, res){

    const type = req.params.type;
    console.log(type);
    try{
        const result = await pool.query("SELECT * FROM posts where type = $1", [type]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "No posts found for this post type." });
        }
        res.json(result.rows);
    }catch(error){
        //console.error("ERROR: getPostsByType",error);
        res.status(500).json({error: "Internal Server Error"});
    }
}

async function deletePostById(req, res) {
    const postId = req.params.postId;
    try {
        const result = await pool.query("DELETE FROM posts WHERE id = $1", [postId]);
        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Post not found" });
        }
        else {return res.status(204).json();}
    } catch (error) {
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

async function createPost(req, res) {
    const { title, body, user_id, location, type, request_to, request_from } = req.body;
    let locationId;

    if (!title || !body || !type || !location) {

        return res.status(400).json({ error: "Title, body, and post type are required fields." });
    }


    //take latt long and see if it exists in the db. 
    //if user declined location services, default lat long is 0, 0. locationId can't be blank, so we use these coordinates for now. 
    if ((location.lat == 0 && location.long == 0) ){
        locationId = await getDefaultLocation(39.798770010686965, -105.07207748323874);
    } else  {
        let locationResponse = await fetch(`${baseUrl}/locations/lat/${location.lat}/long/${location.long}`);
        locationResponse = await locationResponse.json();
        locationId = locationResponse.id;
    }

    const defaultUserId = await getDefaultUserId("testUser1");
    const userId = user_id || defaultUserId;
  

    try {
        const placeholders = [];
        const values = [title, body, userId, locationId, type];

        if (request_to !== undefined) {
            placeholders.push("$" + (values.length + 1));
            values.push(request_to);
        } else {
            placeholders.push("DEFAULT"); // Use DEFAULT keyword in SQL to insert default value
        }

        if (request_from !== undefined) {
            placeholders.push("$" + (values.length + 1));
            values.push(request_from);
        } else {
            placeholders.push("DEFAULT"); // Use DEFAULT keyword in SQL to insert default value
        }

        const query = `INSERT INTO posts (title, body, user_id, location_id, type, request_to, request_from, created_at) VALUES ($1, $2, $3, $4, $5, ${placeholders.join(", ")}, now()) RETURNING *`;

        const result = await pool.query(query, values);
        res.status(201).json(result.rows[0]); // Respond with the created post
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
}

async function getDefaultUserId(username) {
    try {
        const query = "SELECT id FROM users WHERE username = $1";
        const result = await pool.query(query, [username]);

        if (result.rows.length > 0) {
            return result.rows[0].id;
        } else {
            // User not found
            return null;
        }
    } catch (error) {
        throw error;
    }
}
async function getDefaultLocation(latitude, longitude) {
    try {
        const query = "SELECT id FROM locations WHERE lat = $1 AND long = $2";
        const result = await pool.query(query, [latitude,longitude]);

        if (result.rows.length > 0) {
            return result.rows[0].id;
        } else {
            console.log("location not found");
            return null;
        }
    } catch (error) {
        //location not found
        throw error;
    }
}

module.exports = {
    getPostById, 
    getPosts, 
    getPostsByUserId, 
    getPostsByType,
    deletePostById,
    createPost, 
    getDefaultLocation, 
    editPost,
    getDefaultUserId
};