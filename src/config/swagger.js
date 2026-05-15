const swaggerJSDoc = require('swagger-jsdoc');

const path = require('path');

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Notes App API',
    version: '1.0.0',
    description: 'Backend API for a multi-user Notes application with authentication, sharing, archiving, and search.',
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Local development server',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
    schemas: {
      RegisterRequest: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', format: 'email' },
          password: { type: 'string', minLength: 6 },
        },
      },
      LoginRequest: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', format: 'email' },
          password: { type: 'string', minLength: 6 },
        },
      },
      AuthResponse: {
        type: 'object',
        properties: {
          access_token: { type: 'string' },
        },
      },
      MessageResponse: {
        type: 'object',
        properties: {
          message: { type: 'string' },
        },
      },
      NoteCreateRequest: {
        type: 'object',
        required: ['title', 'content'],
        properties: {
          title: { type: 'string', maxLength: 100 },
          content: { type: 'string' },
        },
      },
      NoteResponse: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          title: { type: 'string' },
          content: { type: 'string' },
          owner: { type: 'string' },
          sharedWith: { type: 'array', items: { type: 'string' } },
          archived: { type: 'boolean' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      SearchResponse: {
        type: 'object',
        properties: {
          notes: {
            type: 'array',
            items: { $ref: '#/components/schemas/NoteResponse' },
          },
          page: { type: 'integer' },
          limit: { type: 'integer' },
          total: { type: 'integer' },
        },
      },
      AboutResponse: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          email: { type: 'string' },
          'my features': {
            type: 'object',
            additionalProperties: { type: 'string' },
          },
        },
      },
    },
  },
  security: [
    {
      bearerAuth: [],
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: [path.join(__dirname, '../routes/*.js')],
};

module.exports = swaggerJSDoc(options);
