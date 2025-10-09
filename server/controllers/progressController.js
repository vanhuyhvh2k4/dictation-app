import models from "../models/index.js";
const { UserProgress, Video } = models;

// Cập nhật tiến độ xem video
export const updateVideoProgress = async (req, res) => {
    try {
        const { videoId } = req.params;
        const userId = req.userId; // From authMiddleware
        const { currentTime, completed } = req.body;

        // Validate input
        if (typeof currentTime !== 'number' || currentTime < 0) {
            return res.status(400).json({ message: 'Current time must be a non-negative number' });
        }

        // Find or create progress record
        const [progress, created] = await UserProgress.findOrCreate({
            where: { userId, videoId },
            defaults: {
                currentTime: 0,
                completed: false,
                score: null
            }
        });

        // Update progress
        await progress.update({
            currentTime,
            completed: completed || progress.completed,
            lastWatched: new Date()
        });

        res.json({
            message: "Progress updated successfully",
            data: progress
        });

    } catch (error) {
        console.error('Error updating video progress:', error);
        res.status(500).json({
            message: "Error updating video progress",
            error: error.message
        });
    }
};

// Lấy tiến độ của một video cụ thể
export const getVideoProgress = async (req, res) => {
    try {
        const { videoId } = req.params;
        const userId = req.userId; // From authMiddleware

        const progress = await UserProgress.findOne({
            where: { userId, videoId },
            include: [{
                model: Video,
                attributes: ['title', 'duration', 'thumbnail']
            }]
        });

        if (!progress) {
            return res.json({
                data: {
                    currentTime: 0,
                    completed: false,
                    score: null,
                    video: null
                }
            });
        }

        res.json({ data: progress });

    } catch (error) {
        console.error('Error getting video progress:', error);
        res.status(500).json({
            message: "Error getting video progress",
            error: error.message
        });
    }
};

// Lấy tiến độ của tất cả video của user
export const getAllUserProgress = async (req, res) => {
    try {
        const userId = req.userId; // From authMiddleware

        const progress = await UserProgress.findAll({
            where: { userId },
            include: [{
                model: Video,
                attributes: ['title', 'duration', 'thumbnail']
            }],
            order: [['lastWatched', 'DESC']] // Sắp xếp theo thời gian xem gần nhất
        });

        res.json({ data: progress });

    } catch (error) {
        console.error('Error getting all user progress:', error);
        res.status(500).json({
            message: "Error getting user progress",
            error: error.message
        });
    }
};