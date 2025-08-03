const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger/openapi.yaml');

const app = express();

// Middleware to parse JSON requests
app.use(express.json());

// Serve Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Example route
app.get('/', (req, res) => {
    res.send('Welcome to the API documentation!');
});

module.exports = app;