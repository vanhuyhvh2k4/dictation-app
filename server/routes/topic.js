import express from 'express';
import { getAllTopics, getTopicById, createTopic, updateTopic, deleteTopic } from '../controllers/topicController.js';
import * as videoCtrl from '../controllers/videoController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/:id', getTopicById);
// Get videos by topic ID
router.get('/:topicId/videos', videoCtrl.getVideosByTopicId);
// Get all topics (including inactive)
router.get('/', getAllTopics); 

// Protected routes (require authentication)
router.use(authMiddleware);
router.post('/', createTopic);
router.put('/:id', updateTopic);
router.delete('/:id', deleteTopic);

export default router;