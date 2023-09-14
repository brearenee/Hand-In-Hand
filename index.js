const express = require('express');
const app = express();
require('./src/routes/routes')(app);
const port = process.env.PORT || 3000;


app.use(express.static('public'));

app.listen(port);
console.log('Server started at http://localhost:' + port);


