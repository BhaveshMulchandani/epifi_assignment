# Notes App API

A production-ready backend Notes application built with Node.js, Express.js, MongoDB, and JWT authentication. This API supports user registration, login, note CRUD operations, note sharing, note archiving, pagination, search, and OpenAPI documentation.

## Features

- User registration and login with secure password hashing
- JWT authentication with expiration
- CRUD operations for notes
- Share notes with other users by email
- Archive and unarchive notes
- Pagination support for notes listing
- Search notes by title or content
- **AI-Powered Mind Map Generation** - uses Google Gemini API to transform notes into structured semantic mind maps
- Swagger/OpenAPI documentation
- Centralized error handling, validation, rate limiting, and security middleware
- Render-ready deployment configuration

## Folder Structure

/config
/controllers
/middlewares
/models
/routes
/utils
/docs
server.js
src/app.js
.env.example
package.json
README.md

## Setup

1. Clone the repository.
2. Install dependencies:

npm install

3. Create a `.env` file
4. Start the development server:


npm start

5. Start the production server:

npm start

## API Endpoints

### Auth

- `POST /register` - register a new user
- `POST /login` - login and receive a JWT token

### Notes

- `GET /notes` - get notes created by or shared with the user
- `GET /notes/:id` - get a single note by ID
- `POST /notes` - create a note
- `PUT /notes/:id` - update a note (owner only)
- `DELETE /notes/:id` - delete a note (owner only)
- `POST /notes/:id/share` - share a note with another user (owner only)
- `PATCH /notes/:id/archive` - archive a note (owner only)
- `PATCH /notes/:id/unarchive` - unarchive a note (owner only)
- `POST /notes/:id/mindmap` - generate AI-powered mind map from note content (owner or shared user)
- `GET /search` - search notes by keyword
- `GET /about` - application metadata
- `GET /openapi.json` - OpenAPI specification JSON
- `GET /api-docs` - Swagger UI

## Sample Requests

```bash
curl -X POST http://localhost:3000/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"123456"}'
```

```bash
curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"123456"}'
```

```bash
curl -X GET http://localhost:3000/notes \
  -H "Authorization: Bearer <token>"
```

```bash
curl -X POST http://localhost:3000/notes/:id/mindmap \
  -H "Authorization: Bearer <token>"
```

## Environment Variables

- `PORT` - port for app to listen on
- `MONGODB_URI` - MongoDB Atlas connection string
- `JWT_SECRET` - secret for signing JWT tokens
- `NODE_ENV` - environment mode (`development` or `production`)
- `GEMINI_API_KEY` - Google Gemini API key for AI mind map generation

## AI-Powered Mind Map Generation

The API includes an intelligent mind map generator powered by Google Gemini API that transforms unstructured notes into structured semantic mind maps:

- Extracts main topics from note content
- Identifies important concepts and relationships
- Returns structured JSON with nodes and connections
- Maximum 10 nodes per mind map for clarity and usability

## Deployment to Render

https://epifi-assignment-z2g9.onrender.com

OpenAPI JSON is available at:

https://epifi-assignment-z2g9.onrender.com/openapi.json

If you want to deploy from source, use these steps:

1. Create a new Web Service on Render.
2. Connect your GitHub repository.
3. Set the build command:

```bash
npm install
```

4. Set the start command:

```bash
npm start
```

5. Add environment variables in Render:

- `MONGODB_URI`
- `JWT_SECRET`
- `GEMINI_API_KEY`
- `PORT`
- `NODE_ENV=production`

6. Deploy the service.

## Technologies Used

- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JWT
- bcryptjs
- express-validator
- helmet
- cors
- morgan
- swagger-jsdoc
- swagger-ui-express
- express-rate-limit
- @google/generative-ai (Google Gemini API)
