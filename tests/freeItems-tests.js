const assert = require("assert");
const sinon = require("sinon");
const axios = require("axios");
const proxyquire = require("proxyquire");
require("dotenv").config();
const { db, pool } = require("../src/utils/db");
const freeItemController = require("../src/controllers/free-item-controller");

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

describe("Free Item Unit Tests", function () {
    let req;
    let res;
    let sandbox;
    let axiosPostStub; // Define axiosPostStub here

    before(function () {
        sandbox = sinon.createSandbox();
    });

    beforeEach(function () {
        req = {
            params: {
                lat: 39.798770010686965,
                long: -105.07207748323874,
            },
        };
        res = {
            status: sandbox.stub().returnsThis(),
            json: sandbox.spy(),
        };
        if (!axios.post.restore) {
            // Only create the stub if it doesn't exist
            axiosPostStub = sandbox.stub(axios, "post").resolves({data: {
                posts: [
                    { latitude: 39.798770010686965, longitude: -105.07207748323874, title: "Title1", content: "Content1", reselling:null },
                    { latitude: 40.712776, longitude: -74.005974, title: "Title2", content: "Content2", reselling:null }
                ]}
            });
        }
    });

    afterEach(function () {
        sandbox.restore();
    });

    it("get free items is called", async function () {
        const poolQueryStub = sandbox.stub(pool, "query");
        poolQueryStub.resolves({
            rows: [{ id: 1, username: "TestUser", email: "a@b.com" }],
        });

        // Stub the insertItems function using proxyquire
        const insertItemsStub = sandbox.stub();

        const freeItemController = proxyquire("../src/controllers/free-item-controller", {
            "./post-controller": {
                insertItems: insertItemsStub,
            },
            axios: {
                post: axiosPostStub,
            },
        });

        // Call the getFreeItems function with the provided request and response objects
        await freeItemController.getFreeItems(req, res);

        // Assert the response status and JSON payload
        sinon.assert.calledOnceWithExactly(res.status, 200);
        // Assert that insertItems was not called in this test
        sinon.assert.notCalled(insertItemsStub);
    });

    it("refuses incorrect request for insertItems", async function () {
    // Call the insertItems function with your desired arguments
        const request = { result: { data: { posts: [{ title: "", content: "" }] } } };
        const response = {};
        await freeItemController.insertItems(request, response);

        // Assert that axios.post was not called
        sinon.assert.notCalled(axiosPostStub);
    });

    it("should insert items correctly", async function () {
        const request = {
            result: {
                data: {
                    posts: [
                        { latitude: 39.798770010686965, longitude: -105.07207748323874, title: "Title1", content: "Content1", reselling: null },
                        { latitude: 40.712776, longitude: -74.005974, title: "Title2", content: "Content2", reselling: null }
                    ]
                }
            }
        };

        // Stub fetch to resolve with a location
        sandbox.stub(global, "fetch").resolves({ json: () => ({ lat:100, long:100 }) });

        // Stub db.oneOrNone to resolve with null (no existing record)
        const poolQueryStub = sandbox.stub(db, "oneOrNone").resolves(null);
    
        // Stub console.log to capture log messages
        const consoleLogStub = sandbox.stub(console, "log");

        await freeItemController.insertItems(request, {});

        // Assert that fetch was called for each post
        sinon.assert.calledTwice(global.fetch);

        // Assert that axios.post was called for each post
        sinon.assert.calledTwice(axiosPostStub);

        // Assert that db.oneOrNone was called for each post
        sinon.assert.calledTwice(poolQueryStub);

        // Assert that console.log was called for each successful
        sinon.assert.calledWithExactly(consoleLogStub, "TrashNothing Post Created");
    });
});
