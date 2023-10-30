require("dotenv").config();
const path = require('path');

module.exports = function(app){
    app.get('/', function(req, res) {
      console.log("INITIAL REQUEST")
      res.sendFile(path.join(__dirname, '../../public/index.html'));
    });
    app.get('/sign-in', function(req, res) {
      console.log("INITIAL REQUEST")
      res.sendFile(path.join(__dirname, '../../public/sign-in.html'));
    });
};