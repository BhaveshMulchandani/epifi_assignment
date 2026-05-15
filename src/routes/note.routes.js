const express = require('express');
const { body, query, param } = require('express-validator');
const authenticate = require('../middleware/auth.middleware');
const validateRequest = require('../middleware/validate.middleware');
const noteController = require('../controllers/note.controller');

const router = express.Router();

/**
 * @swagger
 * /notes:
 *   get:
 *     summary: Get notes owned by or shared with the authenticated user
 *     tags:
 *       - Notes
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: page
 *         in: query
 *         schema:
 *           type: integer
 *         description: Page number
 *       - name: limit
 *         in: query
 *         schema:
 *           type: integer
 *         description: Results per page
 *       - name: archived
 *         in: query
 *         schema:
 *           type: boolean
 *         description: Return archived notes when true
 *     responses:
 *       200:
 *         description: List of notes
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SearchResponse'
 */
router.get(
  '/notes',
  authenticate,
  [query('page').optional().isInt({ min: 1 }).withMessage('page must be a positive integer'), query('limit').optional().isInt({ min: 1 }).withMessage('limit must be a positive integer'), query('archived').optional().isBoolean().withMessage('archived must be true or false')],
  validateRequest,
  noteController.getNotes
);

/**
 * @swagger
 * /notes/{id}:
 *   get:
 *     summary: Get a note by ID
 *     tags:
 *       - Notes
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Note ID
 *     responses:
 *       200:
 *         description: Note details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NoteResponse'
 *       403:
 *         description: Forbidden access
 *       404:
 *         description: Note not found
 */
router.get('/notes/:id', authenticate, noteController.getNoteById);

/**
 * @swagger
 * /notes:
 *   post:
 *     summary: Create a new note
 *     tags:
 *       - Notes
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NoteCreateRequest'
 *     responses:
 *       201:
 *         description: Note created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NoteResponse'
 */
router.post(
  '/notes',
  authenticate,
  [
    body('title').isString().trim().notEmpty().withMessage('Title is required').isLength({ max: 100 }).withMessage('Title cannot exceed 100 characters'),
    body('content').isString().trim().notEmpty().withMessage('Content is required'),
  ],
  validateRequest,
  noteController.createNote
);

/**
 * @swagger
 * /notes/{id}:
 *   put:
 *     summary: Update a note
 *     tags:
 *       - Notes
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *     responses:
 *       200:
 *         description: Note updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NoteResponse'
 */
router.put(
  '/notes/:id',
  authenticate,
  [
    param('id').isString().withMessage('Note ID must be provided'),
    body('title').optional().isString().trim().notEmpty().withMessage('Title must be a string').isLength({ max: 100 }).withMessage('Title cannot exceed 100 characters'),
    body('content').optional().isString().trim().notEmpty().withMessage('Content must be a string'),
  ],
  validateRequest,
  noteController.updateNote
);

/**
 * @swagger
 * /notes/{id}:
 *   delete:
 *     summary: Delete a note
 *     tags:
 *       - Notes
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Note deleted successfully
 */
router.delete('/notes/:id', authenticate, noteController.deleteNote);

/**
 * @swagger
 * /notes/{id}/share:
 *   post:
 *     summary: Share a note with another user
 *     tags:
 *       - Notes
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - share_with_email
 *             properties:
 *               share_with_email:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: Note shared
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 */
router.post(
  '/notes/:id/share',
  authenticate,
  [
    body('share_with_email').isEmail().withMessage('Please provide a valid email'),
  ],
  validateRequest,
  noteController.shareNote
);

/**
 * @swagger
 * /notes/{id}/archive:
 *   patch:
 *     summary: Archive a note
 *     tags:
 *       - Notes
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Note archived successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 */
router.patch('/notes/:id/archive', authenticate, noteController.archiveNote);

/**
 * @swagger
 * /notes/{id}/unarchive:
 *   patch:
 *     summary: Unarchive a note
 *     tags:
 *       - Notes
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Note unarchived successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 */
router.patch('/notes/:id/unarchive', authenticate, noteController.unarchiveNote);

/**
 * @swagger
 * /search:
 *   get:
 *     summary: Search notes by title or content
 *     tags:
 *       - Notes
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: q
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *       - name: page
 *         in: query
 *         schema:
 *           type: integer
 *       - name: limit
 *         in: query
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Search results
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SearchResponse'
 *       400:
 *         description: Bad request
 */
router.get(
  '/search',
  authenticate,
  [query('q').exists().withMessage('Query q is required')],
  validateRequest,
  noteController.searchNotes
);

module.exports = router;
