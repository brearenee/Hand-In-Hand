const express = require('express');
const app = express();
require('./src/routes/routes')(app);
const postsRoutes = require('./src/routes/post-routes.js');
const port = process.env.PORT || 3000;

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger/swagger.json');


// Serve Swagger documentation
app.use(express.json());
app.use(express.static('/api-docs'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/posts', postsRoutes);



app.use(express.static('public'));

app.listen(port);
console.log('Server started at http://localhost:' + port);
