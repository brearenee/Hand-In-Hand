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
            axiosPostStub = sandbox.stub(axios, "post").resolves({ data: "fake response" });
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

    it("posts correct request for insertItems", async function () {
    // Call the insertItems function with desired arguments
        const request = { result: { data: { posts: [] } } };
        const response = {};
  
        await freeItemController.insertItems(request, response);
  
        // Allow some time for asynchronous operations to complete
        await new Promise(resolve => setTimeout(resolve, 1000));
  
        // Assert that axios.post was called at least once
        sinon.assert.called(axiosPostStub);
    });
  
});
