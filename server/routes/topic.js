import express from 'express';
import { getAllTopics, getTopicById, createTopic, updateTopic, deleteTopic } from '../controllers/topicController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/:id', getTopicById);
router.get('/', getAllTopics); // Get all topics (including inactive)

// Protected routes (require authentication)
router.use(authMiddleware);
router.post('/', createTopic);
router.put('/:id', updateTopic);
router.delete('/:id', deleteTopic);

export default router;