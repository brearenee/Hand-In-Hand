const express = require('express');
const app = express();
const YAML = require('yamljs');
require('./src/routes/routes')(app);
const postsRoutes = require('./src/routes/post-routes.js');
const userRoutes = require('./src/routes/user-routes.js');
const signInRoutes = require('./src/routes/routes.js')
const port = process.env.PORT || 3000;
const swaggerUi = require('swagger-ui-express');
const swaggerDoc = YAML.load('./swagger/swagger.yaml');
const https = require('https');
const fs = require('fs');
require("dotenv").config(); 

const options = {
    key: fs.readFileSync(process.env.KEY_PATH),   
    cert: fs.readFileSync(process.env.CERT_PATH)  
}

app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));
app.use('/posts', postsRoutes);
app.use('/users', userRoutes);
app.use('/sign-in', signInRoutes);
app.use(express.static('public'));

const server = https.createServer(options, app);

server.listen(port);
console.log('Server started at https://localhost:' + port);

module.exports={app}