const { expect } = require("chai");
const axe = require("axe-core");
const path = require("path");
const fs = require("fs");
const { JSDOM } = require("jsdom");

const file = path.join(__dirname, "../public/index.html");

// Utility function to run specific axe rule
function runAxeRule(element, rule, callback) {
    axe.run(element, { runOnly: { type: "rule", values: [rule] } }, callback);
}


describe("Accessibility Tests", function() {
    this.timeout(10000);
  
    const html = fs.readFileSync(file, "utf-8");
    const { window, document } = new JSDOM(html).window;


    // check color contrast 
    describe("Color Contrast", function() {
        it("should meet color contrast standards", function(done) {
            runAxeRule(document.body, "color-contrast", function(err, results) {
                expect(results.violations.length).to.equal(0, JSON.stringify(results.violations));
                done();
            });
        });
    });


    // check for alt text 
    describe("Image Alt Text", function() {
        it("should have alt text for all images", function(done) {
            runAxeRule(document.body, "image-alt", function(err, results) {
                expect(results.violations.length).to.equal(0, JSON.stringify(results.violations));
                done();
            });
        });
    });
    
    // add more tests for WCAG guidelines 
        
});