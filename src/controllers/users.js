//TODO:  logic for the routes // queries. 
/*const express = require('express');
const app = express();
const port = 3000; 


app.use(express.json());*/
const swagger = require('swagger.js'); 
// Swagger Documentation
swagger(app); // Integrate Swagger for API documentation

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

app.post('/users', (req, res) => {
    res.send('Create a new user');
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
