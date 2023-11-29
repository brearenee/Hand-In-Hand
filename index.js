const express = require("express");
const app = express();
const YAML = require("yamljs");
require("./src/routes/routes")(app);
const postsRoutes = require("./src/routes/post-routes.js");
const userRoutes = require("./src/routes/user-routes.js");
const signInRoutes = require("./src/routes/routes.js");

const freeItemRoutes = require("./src/routes/free-item-routes.js");
const locationRoutes = require("./src/routes/location-routes.js");
const port = process.env.PORT || 3000;
const swaggerUi = require("swagger-ui-express");
const swaggerDoc = YAML.load("./swagger/swagger.yaml");
const https = require("https");
const fs = require("fs");
require("dotenv").config(); 

const options = {
    key: fs.readFileSync(process.env.KEY_PATH),   
    cert: fs.readFileSync(process.env.CERT_PATH)  
};

app.use(express.json());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDoc));
app.use("/posts", postsRoutes);
app.use("/users", userRoutes);
app.use("/locations", locationRoutes);
app.use("/sign-in", signInRoutes);
app.use("/freeItems", freeItemRoutes);
app.use(express.static("public"));

app.get("/geocode/:query", async (req, res) => {
    const { query } = req.params;
 
    try {
        const mapboxResponse = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${query}.json?access_token=${process.env.MAPBOX_API_SEARCH}&country=US`);
        const data = await mapboxResponse.json();
        res.json(data);
        //console.log(data)
    } catch (error) {
        console.error("Error fetching data from Mapbox:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

const server = https.createServer(options, app);

server.listen(port);
console.log("Server started at https://localhost:" + port);

module.exports={app};