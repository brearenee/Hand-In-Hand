const sinon = require("sinon");
const axios = require("axios");
const apiUrl = "https://localhost:3000/locations";
const assert = require("assert");
require("dotenv").config();
const {db}= require("../src/utils/db");
const { reverseGeocode, doesLocationExist, getLocationByCoor, createLocation } = require("../src/controllers/location-controller");
const locationController = require("../src/controllers/location-controller");
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";


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

    it("tests reverseGeocode funtion", async function() {
        this.timeout(5000); 
        const lat1 = 39.7326503;
        const long2 = -104.979527;
        try{
            let address = await reverseGeocode(lat1,long2);
            assert.equal(address.neighborhood, "Capitol Hill", `expected Capitol Hill, recieved ${address.neighborhood}`);
            assert.equal(address.zip, "80203", `expected 80203, recieved ${address.zip}`);
        }catch(error){
            assert.fail(`error in reverseGeocoding${error}`);
        }
    });

    //TODO: test case for reverseGeocode failing

    it("Gets Location By Coordinates", async function() {
        try{
            let response = await axios.get(`${apiUrl}/lat/${lat}/long/${long}`);
            assert.equal(response.status, 200, `expected 200, recieved ${response.status}`);
            assert.equal(response.data.city, "Arvada", `expected Arvada, recieved ${response.data.city}`);
        }catch(error){
            assert.fail(`location Get Request failed ${error}`);
        }
    });



});

describe("Location Unit Tests", () => {
    let req;
    let res;
    let sandbox;
  
    beforeEach(() => {
        sandbox = sinon.createSandbox();
        req = {
            params: {
                locationId: 1 
            },
            query:{
                street_number: "111",
                street_name: "111",
            },
            body: {
                street_number: "123",
                street_name: "westave",
                neighborhood: 2,
                city: "denver",
                state_long: "Colorado",
                state_short: "CO"
            }
        };
      
        res = {
            status: sandbox.stub().returnsThis(),
            json: sandbox.spy()
        };
    });
  
    afterEach(() => {
        sandbox.restore();
    });
  
    it("doesLocationExist returns location", async function(){
        const dbQ = { id: 1, lat: "Updated Title", long: "Updated Body"};
        const poolQueryStub = sandbox.stub(db, "oneOrNone");
        poolQueryStub.resolves(dbQ);   
        const result = await doesLocationExist(111,111);        
        assert.equal(result.id, 1);   
    });

    it("getLocationByCoor should return 200", async () => {

    });

});