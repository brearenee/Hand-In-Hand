const assert = require("assert");
require("dotenv").config();
const date = require("../src/utils/date-formatting");
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";


//coordinates already in everyones local DB 



describe("DateFormatting Helper Function", function() {

  
    beforeEach(function() {

    });
  
    afterEach(function() {

    });
  
  
    it("timestamptzToYyyMmDd", async function() {
        const timestamp = "2023-11-20 23:58:32.366876+00";
        const formattedDate = "2023 11 20";
        const test= date.timestamptzToYyyyMmDd(timestamp);
        assert.equal(test, formattedDate);
    });

});