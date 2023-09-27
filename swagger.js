const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "HandinHand API",
            version: "1.0.0",
            description: "API for interaction with HandinHand database",
        },
    },
    apis: ["./src/routes/*.js"], // Path to your API routes
};

const specs = swaggerJsdoc(options);

module.exports = {
    swaggerUi,
    specs,
};
