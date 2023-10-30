
const axios = require("axios");
const apiUrl = "http://localhost:3000/locations";
const assert = require("assert");
require("dotenv").config();
const {db}= require("../src/utils/db");

//coordinates already in everyones local DB 
let lat = 39.798770010686965;
let long = -105.07207748323874;


const mockLocation = {
    lat: "-1.1",
    long: "-1.1",
    city: "Denver",
    state_long: "Colorado",
    state_short:"CO",
    zip:"80203"
};


describe("Location Routes Tests ", function() {

    before( async function() {  
    });

    after( async function() {
        try{
            await db.none("DELETE FROM locations WHERE lat = $1", mockLocation.lat);
        } catch(error) {console.log("cannot delete test entries: ", error);}
    });

    it("Gets Location By Coordinates", async function() {
        try{
            let response = await axios.get(`${apiUrl}/lat/${lat}/long/${long}`);
            assert.equal(response.status, 200, `expected 200, recieved ${response.status}`);
            assert.equal(response.data.city, "Arvada", `expected Arvada, recieved ${response.data.city}`);
        }catch(error){
            assert.fail(`location Get Request failed ${error}`);
        }
    });

    it("Get- Returns 404 If Coordinates Don't Exist", async function() {
        let response;
        try{
            response = await axios.get(`${apiUrl}/lat/111111/long/22222`);
            assert.fail(`Did not return 404 ${error}`);
        }catch(error){
            assert.equal(error.response.status, 404, `expected 404, recieved ${error.response.status}`);
        }
    });

    it("Post- Creates a new location if doesn't exist", async function() {
        let response;
        try{   
            response = await axios.post(apiUrl, mockLocation);
        } catch(error){
            assert.fail(`Did not return 201 ${error}`);
        }
        assert.equal(response.status, 201, `expected 201, recieved ${response.status}`);
        assert.equal(response.data.city, "Denver", `expected Arvada, recieved ${response.data.city}`);
    });



    it("Post- Returns 409 error if location already exists", async function() {
        let response;
        try{   
            response = await axios.post(apiUrl, mockLocation);
            response = await axios.post(apiUrl, mockLocation);
        } catch(error){
            return assert.equal(error.response.status, 409, `expected 409, recieved ${error.response.status}`);
        }
        assert.fail(`returned ${response.status}`);
    
    });

});