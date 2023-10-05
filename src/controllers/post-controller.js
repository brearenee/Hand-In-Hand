const pool = require('../utils/db')
const express = require('express');
const app = express();
app.use(express.json());
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
async function getPosts(req, res) {
    const fromDate = req.query.fromDate;
    const toDate = req.query.toDate;

    const locationId = req.query.locationId;
    let query = 'SELECT * FROM posts';
    const queryParams = [];

    if (fromDate && toDate && locationId) {
        query += ' WHERE created_at::DATE BETWEEN $1::DATE AND $2::DATE AND location_id = $3';
        queryParams.push(fromDate, toDate, locationId)
    } else if (fromDate && toDate) {
        query += ' WHERE created_at::DATE BETWEEN $1::DATE AND $2::DATE';
        queryParams.push(fromDate, toDate)
    } else if (locationId) {
        query += ' WHERE location_id = $3';
        queryParams.push(locationId)
    }
    try{
        const result = await pool.query(query, queryParams);
        res.json(result.rows);
    }catch(error){
        console.error('ERROR: getPosts ',error)
        res.status(500).json({error: 'Internal Server Error'});
    };

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
    try{
        const result = await pool.query('DELETE FROM posts where id = $1', [postId]);
        res.json(result.rows);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'No posts found with this id' });
        }
    }catch(error){
        console.error('ERROR: getPostById', error)
        res.status(500).json({error: 'Internal Server Error'});
    };

}

//having issues with body parsing. :-(
async function createPost(req, res){
    request = await req
    console.log('request0', req)
    console.log(req.body)
    /*const { title, body, user_id, location_id, type } = req.body;
    //default userIds for beginning implementation
    const defaultUserId = '5bc4f097-8924-4873-9e85-a0f1de817e18'; 
    const defaultLocationId = '08f0cdeb-adcd-4382-98ab-920b4926fd67'; 

    const userId = user_id || defaultUserId;
    const locationId = location_id || defaultLocationId;

    if (!title || !body || !type) {
        return res.status(400).json({ error: 'Title, body, and post type are required fields.' });
      }

      try {
        const client = await pool.connect();
        const result = await client.query(
          'INSERT INTO posts (title, body, user_id, location_id, type, created_at) VALUES ($1, $2, $3, $4, $5, now()) RETURNING *',
          [title, body, userId, locationId, type]
        );
    
        client.release();
        res.status(201).json(result.rows[0]); // Respond with the created post
      } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }*/
      res.status(500).json({ error: 'Internal Server Error' });
    }



module.exports = {
    getPostById, 
    getPosts, 
    getPostsByUserId, 
    deletePostById,
    createPost
};
