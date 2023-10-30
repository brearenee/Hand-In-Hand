const express = require("express");
const app = express();
app.use(express.json());
const { db }= require("../utils/db");

async function getLocationByCoor(req, res) {
    request = await req;
    const lat = request.params.lat; 
    const long = request.params.long;
    const locationInput = [lat,long];
    let response;

    try{
        response = await db.oneOrNone(`SELECT * FROM locations
        WHERE (lat = $1 AND long = $2);`, locationInput);
    } catch(error){
        res.status(500).json({ error: "Internal Server Error" });
    }
    if (response != null){ 
        res.status(200).json(response);
    } else {
        res.status(404).json({ error: "Coordinates not found" });
    }
}

async function createLocation(req, res) {
    console.log("CreateLocation");
    const { lat, long, neighborhood, 
        street_number, street_name, city, 
        state_long,state_short, zip  } = await req.body;
    let locationInput = [lat,long];

    if (!lat || !long ||!city || !state_long || !state_short || !zip) {
        return res.status(400).json({ error: "Latitude, Longitude, City, State (abbreviated and full), and Zip are all required fields" });
    }

    try{
        await db.none(`
                SELECT * FROM locations
                WHERE (lat = $1 AND long = $2);`,
        locationInput);
    }catch{
        return res.status(409).json({ error: "Coordinates already exist" });
    }
    try{
        let result = await db.one(`
            INSERT INTO locations 
            (lat, long, neighborhood, street_number,
            street_name, city, state_long, state_short, zip)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`, [lat, long, neighborhood, street_number, street_name, city, state_long, state_short, zip]);
        console.log(result);
        return res.status(201).json(result);
    } catch(error) { res.status(500).json({ error: "Internal Server Error" });}
}


module.exports = {
    getLocationByCoor,
    createLocation
};