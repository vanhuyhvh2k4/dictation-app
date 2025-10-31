import express from 'express';
import * as analyticsCtrl from '../controllers/factUserController.js';
import isAdminMiddleware from '../middlewares/isAdminMiddleware.js';

const router = express.Router();

// Bảo vệ tất cả các routes với middleware admin
router.use(isAdminMiddleware);

// Get today's analytics
router.get('/today', analyticsCtrl.getTodayAnalytics);

// Get analytics by date range
router.get('/range', analyticsCtrl.getAnalyticsByDateRange);

// Get last N days analytics
router.get('/last-days', analyticsCtrl.getLastNDaysAnalytics);

export default router;