const { expect } = require("chai");
const { Builder, By } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");

describe("fetchPosts using Selenium", function() {
    // Set the timeout for this hook
    this.timeout(10000);
    let driver;

    before(async function() {
        

        // Initialize a headless chrome driver
        driver = new Builder()
            .forBrowser("chrome")
            .setChromeOptions(new chrome.Options().headless())
            .build();

        // Go to your HTML page
        await driver.get("http://localhost:3000"); 

        // For the purpose of the test, we use a free online service to mock the posts API
        await driver.executeScript("fetchAndPopulateFeed();");
    });

    it("should fetch and populate feed content using Selenium", async function() {
        await new Promise(resolve => setTimeout(resolve, 2000));

        const feedContent = await driver.findElement(By.id("feed-content"));
        const children = await feedContent.findElements(By.css(".row"));
        
        expect(children.length).to.be.at.least(1); 

        const firstCardTitle = await children[0].findElement(By.css("h4")).getText();
        expect(firstCardTitle).to.be.a("string");
    });

    after(async function() {
        if (driver) {
            await driver.quit();
        }
    });
});
