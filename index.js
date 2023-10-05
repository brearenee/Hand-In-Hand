const express = require('express');
const app = express();
require('./src/routes/routes')(app);
const postsRoutes = require('./src/routes/post-routes.js');
const port = process.env.PORT || 3000;

const { swaggerUi, specs } = require('./swagger.js'); // Path to your swagger options file

// Serve Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
app.use('/posts', postsRoutes);




app.use(express.static('public'));

app.listen(port);
console.log('Server started at http://localhost:' + port);


