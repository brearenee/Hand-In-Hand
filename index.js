const express = require('express');
const app = express();
const YAML = require('yamljs');
require('./src/routes/routes')(app);
const postsRoutes = require('./src/routes/post-routes.js');
const usersRoutes = require('./src/routes/user-routes.js');
const port = process.env.PORT || 3000;
const swaggerUi = require('swagger-ui-express');
<<<<<<< HEAD
const swaggerDoc = YAML.load('./swagger/swagger.yaml');
 
app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));
app.use('/posts', postsRoutes);
app.use('/users', usersRoutes);
=======
const swaggerDocument = require('./src/routes/swagger.json');


// Serve Swagger documentation
app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/posts', postsRoutes);



>>>>>>> adb2179 (can now create posts woo)
app.use(express.static('public'));

app.listen(port);
console.log('Server started at http://localhost:' + port);
  