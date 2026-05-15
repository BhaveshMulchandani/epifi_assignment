const express = require('express');

const router = express.Router();

/**
 * @swagger
 * /about:
 *   get:
 *     summary: Information about the API and features
 *     tags:
 *       - App
 *     responses:
 *       200:
 *         description: API information
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AboutResponse'
 */
router.get('/about', (req, res) => {
  res.status(200).json({
    name: 'Notes App API',
    email: 'support@notesapp.example',
    'my features': {
      search: 'Implemented full text search for notes using MongoDB regex.',
      pagination: 'Added pagination support for scalable note retrieval.',
      archive: 'Added note archive and unarchive support for owner-controlled workflows.',
    },
  });
});

module.exports = router;
