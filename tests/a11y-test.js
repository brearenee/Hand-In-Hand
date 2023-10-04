const { expect } = require('chai');
const axe = require('axe-core');
const path = require('path');


const file = path.join(__dirname, '../public/index.html');

describe('Accessibility Tests', function () {
  it('should have no accessibility violations', function (done) {
    // Load the HTML content using fetch
    fetch(file)
      .then((response) => response.text())
      .then((html) => {
        // Run axe-core on the HTML
        axe.run(html, (err, results) => {
          if (err) throw err;

          // Check for accessibility violations
          expect(results.violations.length).to.equal(0);

          // Log accessibility violations (if any)
          if (results.violations.length > 0) {
            console.log('Accessibility Violations:');
            results.violations.forEach((violation) => {
              console.log(`- Impact: ${violation.impact}`);
              console.log(`- Description: ${violation.description}`);
              console.log(`- Help: ${violation.help}`);
              console.log(`- Tags: ${violation.tags.join(', ')}`);
              console.log('-------');
            });
          }

          done();
        });
      })
      .catch((error) => {
        console.error('Error loading HTML:', error);
        done(error);
      });
  });
});
