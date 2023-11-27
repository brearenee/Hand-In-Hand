const axios = require("axios");
const {db}= require("../utils/db");
const { getDefaultLocation } = require("./post-controller");
const { getLocationByCoor } = require("./location-controller");

const type = "Free Marketplace Item"; //type of trashnothing posts
const apiUrlForPosts = "https://localhost:3000/posts";
const user_id = "11111111-0000-1111-0000-000000000000"; //id for trashnothing user
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

//get the items and put them into our db
const getFreeItems = async (request, response) => {
    const api_key = process.env.TN_API_KEY;
    let location;

    //get lat and long from params
    const latitude = request.params.lat;
    const longitude = request.params.long;
    const apiUrlForLocation = `https://localhost:3000/locations/lat/${latitude}/long/${longitude}`;
    
    //get location of user to include a correct location_id for the posts
    const locationObj = {lat: latitude,
        long: longitude
    };
    try {
        //get location based off of coordinates
        location = await getDefaultLocation(locationObj.lat, locationObj.long);
    } catch {
        console.log("location does not exist yet");
        //create new location and get id
        location = await getLocationByCoor(locationObj);
        location = await getDefaultLocation(locationObj.lat, locationObj.long);
    }

    //url for api call to trash nothing
    const apiBaseUrl = `https://trashnothing.com/api/v1.3/posts?sort_by=date&types=offer&sources=trashnothing&per_page=20&page=1&device_pixel_ratio=1&latitude=${latitude}&longitude=${longitude}&radius=100000&outcomes=not-promised&include_reposts=1&api_key=${api_key}`;
    try {

        //make the call to trashnothing api
        const result = await axios.get(apiBaseUrl);
        //console.log(response)
        response.status(200).json(result.status);

        //create one object with location and result from trashnothing api
        const resultAndLocation = { 
            location: location, 
            result: result
        };

        insertItems(resultAndLocation);

    } catch {
        console.log("Could not get marketplace items");
    }    
};

const insertItems = async (request, response) => {
    try {
        // Insert code to put filtered posts into posts db
        //get each item as an individual post
        for (const element of request.result.data.posts) {
            let postData = {
                user_id: user_id,
                title: element.title,
                body: element.content,
                type: type,
                location_id: request.location
            };
            //filter out posts if they are already in our db
            if (!request.result.data.posts.reselling) {
                db.oneOrNone("SELECT * FROM posts WHERE title = $1 AND body = $2", [element.title, element.content])
                    .then(existingRecord => {
                        if (existingRecord == null) {
                            //console.log("Post does not exist");
                            axios.post(apiUrlForPosts, postData);
                        } else {
                            //console.log("Record already exists");
                        }
                    })
                    .catch(error => {
                        console.error("Error:", error);
                    });
            }
        }
    } catch {
        console.log("Could not insert into trash nothing posts db");
    }
};

module.exports = {
    getFreeItems,
    insertItems
};