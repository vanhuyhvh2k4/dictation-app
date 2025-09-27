// routes/word.js
import express from 'express';
import * as wordCtrl from '../controllers/wordController.js';
import auth from '../middlewares/authMiddleware.js';

const router = express.Router();

// POST /api/word - add a new word
router.post('/', auth, wordCtrl.addWord);

// GET /api/word - list user's words
router.get('/', auth, wordCtrl.getWordlist);

// DELETE /api/word/:id - delete a word from user's wordlist
router.delete('/:id', auth, wordCtrl.deleteWord);

export default router;
