const express = require("express");
require("dotenv").config();
const app = express();
app.use(express.json());
const { db }= require("../utils/db");
const axios = require("axios");

async function doesLocationExist(lat,long) {
    try{
        const location = await db.oneOrNone(`SELECT * FROM locations
        WHERE (lat = $1 AND long = $2);`, [lat, long]);
        return location;

    } catch(error){
        console.log(error);
        return null;
    }
}

async function getLocationByCoor(req, res) {

    request = await req;
    const lat = request.params.lat; 
    const long = request.params.long;
    let address;

    //does the location exist? 
    const location = await doesLocationExist(lat, long);
    //if not, create it. 
    if (location == null){ 
        try{
            address = await createLocation(lat, long);
            res.status(200).json(address);
        } catch(error){console.log("error in createLocation function"); }
    } 
    else {
        res.status(200).json(location);
    }
}


async function createLocation(lat, long) {
    const address = await reverseGeocode(lat, long);
    try{
        let result = await db.one(`
            INSERT INTO locations
            (lat, long, neighborhood, street_number,
            street_name, city, state_long, state_short, zip)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *;`, [address.lat, address.long, address.neighborhood, address.street_number,
            address.street_name, address.city, address.state_long, address.state_short, address.zip]);
        return result;
    } catch(error) { console.log("error inserting into database", error);}
}

async function reverseGeocode(latitude, longitude) {
    try {
        // Make an external call to Mapbox Places API for reverse geocoding
        const response = await axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json`, {
            params: {
                access_token: process.env.MAPBOX_API_TOKEN,
                limit: 1 
            }
        });

        //object to place the api response.
        const address = {
            "full_address":null,
            "lat": latitude,
            "long": longitude,
            "neighborhood": null,
            "street_number": null,
            "street_name": null,
            "city": null,
            "state_long": null,
            "state_short": null,
            "zip": null
        };
        //put in the full address. 
        address.full_address = response.data.features[0].place_name;
        address.street_number = response.data.features[0].address;

        // Extract the street name
        const startIndex = address.street_number.length;
        const endIndex = address.full_address.indexOf(",", startIndex);
        address.street_name = address.full_address.substring(startIndex, endIndex).trim();

        const apiResponse = response.data.features[0].context;    
        for (const i in apiResponse) {
            let currentObj = apiResponse[i];
            if (apiResponse.hasOwnProperty(i)) {
                
                if (currentObj.id.startsWith("neighborhood")) {
                    address.neighborhood = currentObj.text;
                } else if (currentObj.id.startsWith("postcode")) {
                    address.zip = currentObj.text;
                } else if (currentObj.id.startsWith("place")) {
                    address.city = currentObj.text;
                } else if (currentObj.id.startsWith("region")) {
                    address.state_long = currentObj.text;
                    address.state_short = currentObj.short_code.substring(currentObj.short_code.length - 2);}
            }
        }
        return address;
      
    } catch (error) {
        console.error("Error fetching data from Mapbox API:", error);
    }

}


module.exports = {
    getLocationByCoor,
    createLocation, 
    reverseGeocode,
    doesLocationExist,
};
