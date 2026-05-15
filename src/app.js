const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
const apiLimiter = require('./middleware/rateLimit.middleware');
const errorHandler = require('./middleware/error.middleware');
const authRoutes = require('./routes/auth.routes');
const noteRoutes = require('./routes/note.routes');
const appRoutes = require('./routes/app.routes');

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('combined'));
app.use(apiLimiter);

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Notes App API is running successfully",
    swagger_documentation: "/openapi.json",
  });
});

app.get('/openapi.json', (req, res) => res.json(swaggerSpec));

app.use(authRoutes);
app.use(noteRoutes);
app.use(appRoutes);

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.use(errorHandler);

module.exports = app;
