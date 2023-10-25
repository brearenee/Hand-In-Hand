const { expect } = require("chai");
const { AxeBuilder } = require("@axe-core/webdriverjs");
const { Builder } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");


// Utility function to run accessibility check on specific guideline rule
async function runAxe(driver, rule) {
    const results = await new AxeBuilder(driver).analyze();
    return results.violations.filter(violation => violation.id === rule);
}


/**
 * Accessibility Tests
 * 
 * This suite tests the web application for accessibility violations using axe-core and Selenium WebDriver.
 * Each test within the suite focuses on a specific accessibility rule or guideline.
 * Violations are logged in  JSON format
 * 
 * Note: Ensure your local server is running and serving the web application at 'http://localhost:3000/' 
 * before executing these tests.
 */
describe("Accessibility Tests", function() {
    this.timeout(10000);
    let driver;

    before(async () => {
        driver = new Builder()
            .forBrowser("chrome")
            .setChromeOptions(new chrome.Options().headless())
            .build();
        await driver.get("http://localhost:3000/");
    });

    // Check color contrast 
    it("should meet color contrast standards", async () => {
        const violations = await runAxe(driver, "color-contrast");
        expect(violations.length).to.equal(0, JSON.stringify(violations, null, 2));
    });

    // Check ALT attribute for images 
    it("should have alt text for all images", async () => {
        const violations = await runAxe(driver, "image-alt");
        expect(violations.length).to.equal(0, JSON.stringify(violations, null, 2));
    });

    // TODO: Add more tests for other rules as needed...


    // Tear down selenium driver
    after(async () => {
        if (driver) await driver.quit();
    });
});



