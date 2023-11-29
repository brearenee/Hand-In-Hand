const axios = require("axios");
const {db}= require("../utils/db");
const type = "Free Marketplace Item"; //type of trashnothing posts
const apiUrlForPosts = "https://localhost:3000/posts";
const user_id = "11111111-0000-1111-0000-000000000000"; //id for trashnothing user
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

//get the items and put them into our db
const getFreeItems = async (request, response) => {
    const api_key = process.env.TN_API_KEY;
    let location;
    let apiResponse;

    const latitude = request.params.lat;
    const longitude = request.params.long;
  
    try {
        //if user declines browser,  lat/long will be 0,0 and therefore decline TrashNothing feed. 
        if (latitude != 0 && longitude != 0){
            //create the location if it doesn't exist. 
            apiResponse = await fetch(`https://localhost:3000/locations/lat/${latitude}/long/${longitude}`);}
        location = await apiResponse.json();
    
    } catch {
        console.log("/Locations Error");

    }

    //url for api call to trash nothing
    const apiBaseUrl = `https://trashnothing.com/api/v1.3/posts?sort_by=date&types=offer&sources=trashnothing&per_page=20&page=1&device_pixel_ratio=1&latitude=${latitude}&longitude=${longitude}&radius=100000&outcomes=not-promised&include_reposts=1&api_key=${api_key}`;
    try {

        //make the call to trashnothing api
        const result = await axios.get(apiBaseUrl);
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
            //get/create location of each post
            let lat = element.latitude;
            let long = element.longitude;
            let apiResponse = await fetch(`https://localhost:3000/locations/lat/${lat}/long/${long}`);
            let location = await apiResponse.json();

            let postData = {
                user_id: user_id,
                title: element.title,
                body: element.content,
                type: type,
                location: location
            };
            //filter out posts if they are already in our db
            if (!request.result.data.posts.reselling) {
                db.oneOrNone("SELECT * FROM posts WHERE title = $1 AND body = $2", [element.title, element.content])
                    .then(existingRecord => {
                        if (existingRecord == null) {

                            axios.post(apiUrlForPosts, postData)
                                .then(response => {
                                    console.log("TrashNothing Post Created");
                                })
                                .catch(error => {
                                    console.log("/Posts error");
                                    console.error("Error:", error);
                                });
                        } else {
                            console.log("Record Already Exists");
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