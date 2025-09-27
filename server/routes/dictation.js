// routes/dictation.js
import express from 'express';
import * as dictationCtrl from '../controllers/dictationController.js';
import auth from '../middlewares/authMiddleware.js';

const router = express.Router();

// POST /api/dictation/submit - submit a single sentence for grading
router.post('/submit', auth, dictationCtrl.submitSentence);

// POST /api/dictation/complete - mark a video as completed and save average score
router.post('/complete', auth, dictationCtrl.completeVideo);

export default router;
