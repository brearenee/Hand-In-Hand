//Resources:
//https://stackoverflow.com/questions/63293861/how-do-i-get-a-server-js-file-to-pull-a-password-from-another-file-like-config-j
//https://builtin.com/software-engineering-perspectives/javascript-api-call

const axios = require("axios");
const {db}= require("../utils/db");
const api_key = process.env.TN_API_KEY;
const userName = "TrashNothing";
const latitude = "43.653226";
const type = "gift";
const apiUrlForPosts = "https://localhost:3000/posts";
const apiUrlForUser = "https://localhost:3000/users/";
const user_id = "";//Insert pre-existing userId
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
const longitude = "-79.383184";
const apiBaseUrl = `https://trashnothing.com/api/v1.3/posts?sort_by=date&types=offer&sources=trashnothing&per_page=20&page=1&device_pixel_ratio=1&latitude=${latitude}&longitude=${longitude}&radius=3000&outcomes=not-promised&include_reposts=1&api_key=${api_key}`;
const {getDefaultLocation}= require("./post-controller");


const getFreeItems = async (request, response) => {
    try {
        const result = await axios.get(apiBaseUrl);
        console.log(result.status);
        response.status(200).json(result.data);

        try {
        // Insert code to put filtered posts into posts db
            for (const element of result.data.posts) {
                let postData = {
                    user_id: user_id,
                    title: element.title,
                    body: element.content,
                    type: type
                };

                if (!result.data.posts.reselling) {
                    db.oneOrNone("SELECT * FROM posts WHERE title = $1 AND body = $2", [element.title, element.content])
                        .then(existingRecord => {
                            console.log(existingRecord);
                            if (existingRecord == null) {
                                console.log("Post does not exist");
                                axios.post(apiUrlForPosts, postData);
                            } else {
                                console.log("Record already exists");
                            }
                        })
                        .catch(error => {
                            console.error("Error:", error);
                        });
                }
            }
        } catch {
            console.log("Could not insert into posts db");
        }
    } catch {
        console.log("Could not get marketplace items");
    }

    
};

module.exports = {
    getFreeItems

};