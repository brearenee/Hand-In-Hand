const { expect } = require('chai');
const { stub, createFakeServer } = require('sinon');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const path = require('path');

// Set fetch to the global fetch function
let fetch = global.fetch;

const { readFileSync } = require('fs');

// Import the code you want to test using CommonJS require syntax
const { fetchAndPopulateFeed } = require('../public/scripts/script');
const file = path.join(__dirname, '../public/index.html');

describe('fetchPosts', () => {
  let server;
  let fetchStub;
  let document;

  before(() => {
    // Load your existing index.html file into a DOM environment
    const html = readFileSync(file, 'utf-8');
    const dom = new JSDOM(html, { runScripts: 'dangerously' });
    document = dom.window.document;

    // Create a spy on the fetch function
    fetchStub = stub(global, 'fetch');

    // Start a fake server using sinon
    server = createFakeServer();
  });

  after(() => {
    // Restore the original fetch function and clean up
    fetchStub.restore();
    server.restore();
    delete global.fetch;
  });

  it('should fetch and populate feed content', async () => {
    // Define the fake response data
    const responseData = [
      {
        title: 'Post 1',
        created_at: '2023-09-25',
        body: 'Content of Post 1',
      },
      {
        title: 'Post 2',
        created_at: '2023-09-26',
        body: 'Content of Post 2',
      },
    ];

    // Mock the fetch function to return the fake response data
    fetchStub.resolves({
      json: async () => responseData,
    });

    // Call the function you want to test (assuming it's a function in script.js)
    await fetchAndPopulateFeed(document);

    // Verify that the fetch was called with the correct URL
    expect(fetchStub.calledWith('/posts')).to.be.true;

    // Verify that the feed content was populated with the correct data
    const feedContent = document.getElementById('feed-content');
    console.log('Content of children:', feedContent.children); // Add this line
    console.log('Number of children:', feedContent.children.length); // Add this line
    expect(feedContent.children.length).to.equal(responseData.length);

    // You can add more assertions to check the content of the cloned templates if needed
  });
});
