const assert = require("assert");
const axios = require('axios');
const { error } = require("console");
const { response } = require("express");
const apiUrl = 'http://localhost:3000/users'; // Replace with your actual API endpoint URL

describe("Tests user routes", function() {
    //before({});
    //after({});

    it("Post a new user", async function(){
        const userData = {
            id:"00000000-0000-0000-0000-000000000000",
            username:"testuser0",
            last_location:"586d8255-e629-4eda-a78b-af2ac0c6a4d9",
            created_at:"2023-10-10T02:20:06.021Z",
            updated_at:"2023-10-10T02:20:06.021Z"
        };

        axios.post(apiUrl, userData).then(response => {
            console.log('Response status:', response.status);
            console.log('Response data:', response.data);
            assert.equal(response.data.id, userData.id, `does not equal testUser created.`);
        });


});


});