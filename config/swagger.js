const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Amazon-style Backend API',
      version: '1.0.0',
      description: 'REST API for an Amazon-like e-commerce platform — auth, products, cart, orders, reviews, and mock payments.'
    },
    servers: [
      { url: 'http://localhost:5000', description: 'Local server' }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    security: [{ bearerAuth: [] }]
  },
  apis: ['./routes/*.js']
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;