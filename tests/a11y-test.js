const { expect } = require("chai");
const path = require("path");


const { AxeBuilder } = require("@axe-core/webdriverjs");
const { Builder } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");

async function checkAccessibilityRule(driver, rule) {
    const results = await new AxeBuilder(driver).analyze();
    return results.violations.filter(violation => violation.id === rule);
}



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

    it("should meet color contrast standards", async () => {
        const violations = await checkAccessibilityRule(driver, "color-contrast");
        expect(violations.length).to.equal(0, JSON.stringify(violations, null, 2));
    });

    it("should have alt text for all images", async () => {
        const violations = await checkAccessibilityRule(driver, "image-alt");
        expect(violations.length).to.equal(0, JSON.stringify(violations, null, 2));
    });

    // Add more tests for other rules as needed...

    after(async () => {
        if (driver) await driver.quit();
    });
});



