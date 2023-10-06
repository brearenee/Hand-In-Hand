const pool = require('../utils/db')
const pgp = require('pg-promise')();
const express = require('express');
const app = express();
app.use(express.json());
const db = pgp({ pool });

//const bodyParser = require('body-parser');
//app.use(bodyParser.json());
//postid is path parameter
async function getPostById(req, res) {
    const postId = req.params.postId;
    try{
        const result = await pool.query('SELECT * FROM posts where id = $1', [postId]);
        res.json(result.rows);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'No posts found with this id' });
        }
    }catch(error){
        console.error('ERROR: getPostById', error)
        res.status(500).json({error: 'Internal Server Error'});
    };
};

//get all by default. Filter by parmeters when passed. 
//needs BOTH to and from dates in the form YYY-MM-DD
//TODO: query by userId. no longer a path. 
async function getPosts(req, res) {
    const fromDate = req.query.fromDate;
    const toDate = req.query.toDate;
    const locationId = req.query.locationId;
    const userId = req.query.userId;

    let query = 'SELECT * FROM posts WHERE 1=1';
    const queryParams = [];

    if (fromDate && toDate) {
        query += ' AND created_at::DATE BETWEEN $1::DATE AND $2::DATE';
        queryParams.push(fromDate, toDate);
    }

    if (locationId) {
        query += ' AND location_id = $' + (queryParams.length + 1);
        queryParams.push(locationId);
    }

    if (userId) {
        query += ' AND user_id = $' + (queryParams.length + 1);
        queryParams.push(userId);
    }

    try {
        const result = await pool.query(query, queryParams);
        res.json(result.rows);
    } catch (error) {
        console.error('ERROR: getPosts ', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
//userId is path parameter at URL posts/user/:userId
async function getPostsByUserId(req, res) {
    const userId = req.params.userId;
    console.log(userId)
    try{
        const result = await pool.query('SELECT * FROM posts where user_id = $1', [userId]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'No posts found for this user.' });
        }
        res.json(result.rows);
    }catch(error){
        console.error('ERROR: getPostsByUserId',error)
        res.status(500).json({error: 'Internal Server Error'});
    };
};

async function deletePostById(req, res) {
    const postId = req.params.postId;
    console.log(postId)
    try {
        const result = await pool.query('DELETE FROM posts WHERE id = $1', [postId]);
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Post not found' });
        }
        return res.status(204).send();
    } catch (error) {
        console.error('ERROR: DeletePostById', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}

<<<<<<< HEAD
=======


>>>>>>> bc3e049 (swagger documentation in full force)
async function createPost(req, res){
    request = await req
    const { title, body, user_id, location_id, type } = req.body;
<<<<<<< HEAD
    //default user/location Ids for beginning implementation
    const defaultUserId = await getDefaultUserId('testUser1');
    const defaultLocationId = await getDefaultLocation(39.798770010686965, -105.07207748323874)
=======
    //default userIds for beginning implementation
    //TODO: query method to get the userid since theyre unique across machines
    const defaultUserId = '5bc4f097-8924-4873-9e85-a0f1de817e18'; 
    const defaultLocationId = '08f0cdeb-adcd-4382-98ab-920b4926fd67'; 
>>>>>>> bc3e049 (swagger documentation in full force)

    const userId = user_id || defaultUserId;
    const locationId = location_id || defaultLocationId;

    if (!title || !body || !type) {
        return res.status(400).json({ error: 'Title, body, and post type are required fields.' });
    }

    try {
        const result = await pool.query(
            'INSERT INTO posts (title, body, user_id, location_id, type, created_at) VALUES ($1, $2, $3, $4, $5, now()) RETURNING *',
            [title, body, userId, locationId, type]
        );

        res.status(201).json(result.rows[0]); // Respond with the created post
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
async function getDefaultUserId(username) {
    try {
        const query = 'SELECT id FROM users WHERE username = $1';
        const result = await pool.query(query, [username]);
    
        if (result.rows.length > 0) {
          return result.rows[0].id;
        } else {
          // User not found
          console.log("user not found")
          return null;
        }
      } catch (error) {
        console.error('Error fetching user ID:', error);
        throw error;
      }
    }
async function getDefaultLocation(latitude, longitude) {
    try {
        const query = 'SELECT * FROM locations WHERE lat = $1 AND long = $2';
        const result = await pool.query(query, [latitude,longitude]);
    
        if (result.rows.length > 0) {
          return result.rows[0].id;
        } else {
          console.log("location not found")
          return null;
        }
      } catch (error) {
        console.error('Error fetching user ID:', error);
        throw error;
      }
}

module.exports = {
    getPostById, 
    getPosts, 
    getPostsByUserId, 
    deletePostById,
    createPost
};
