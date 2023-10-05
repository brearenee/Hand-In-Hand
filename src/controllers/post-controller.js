const pool = require('../utils/db')
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json());

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
    const date = new Date();
    const formattedTimestamp = date.toISOString().replace('T', ' ').replace('Z', '');
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

module.exports = {
    getPostById, 
    getPosts, 
    getPostsByUserId
};
