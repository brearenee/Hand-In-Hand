const port = process.env.PORT || 3000;
const path = require('path');
require('dotenv').config()
const Pool = require('pg').Pool

const pool = new Pool({
  user: process.env.POSTGRES_USR,
  host: process.env.POSTGRES_HOST,
  password: process.env.POSTGRES_PWD,
  database: process.env.POSTGRES_DB
})

module.exports = function(app){

app.get('/', function(req, res) {
  console.log("INITIAL REQUEST")
  res.sendFile(path.join(__dirname, '../../public/index.html'));
});

app.get('/posts', (request, response) => {
    console.log('POST ROUTE CALLED')
  
    pool.query('SELECT * FROM posts', (error, result) => {
        if (error) {
        console.log("throwing error") 
        throw error;}
        console.log(result)
        response.send(result.rows);
    })
  });
}