import models from "../models/index.js";
import { getSignedUrl } from "../config/supabase.js";
const { UserProgress, Video, Transcript } = models;

// Cập nhật tiến độ của video và điểm số
export const updateVideoProgress = async (req, res) => {
    try {
        const { videoId } = req.params;
        const userId = req.userId;
        const { currentTranscriptIndex, transcriptScore } = req.body;

        const video = await Video.findByPk(videoId, {
            include: [{
                model: Transcript,
                attributes: ['id']
            }]
        });

        if (!video) {
            return res.status(404).json({ message: "Video not found" });
        }

        const totalTranscripts = video.Transcripts.length;

        if (currentTranscriptIndex >= totalTranscripts) {
            return res.status(400).json({ 
                message: "Current transcript index exceeds total transcripts" 
            });
        }

        // Find or create a progress record
        const [progress, created] = await UserProgress.findOrCreate({
            where: { userId, videoId },
            defaults: {
                currentTranscriptIndex: 0,
                transcriptsCompleted: 0,
                totalScore: 0,
                completed: false
            }
        });

        // Update transcripts completed if moving to next transcript
        let transcriptsCompleted = progress.transcriptsCompleted;
        if (currentTranscriptIndex > progress.currentTranscriptIndex) {
            transcriptsCompleted = currentTranscriptIndex;
        }

        // Calculate total score
        const newTotalScore = progress.totalScore + (transcriptScore || 0);

        // Check if all transcripts are completed
        const completed = transcriptsCompleted >= totalTranscripts - 1;

        // Update the progress
        await progress.update({
            currentTranscriptIndex,
            transcriptsCompleted,
            totalScore: newTotalScore,
            completed,
            updatedAt: new Date()
        });

        res.json({
            data: {
                ...progress.toJSON(),
                totalTranscripts
            }
        });
    } catch (error) {
        console.error('Error updating video progress:', error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Lấy tiến độ của một video cụ thể
export const getVideoProgress = async (req, res) => {
    try {
        const { videoId } = req.params;
        const userId = req.userId;

        // Get progress with video info and total transcripts count
        const progress = await UserProgress.findOne({
            where: { userId, videoId },
            include: [{
                model: Video,
                attributes: ['title'],
            }]
        });

        if (!progress) {
            return res.json({
                data: {
                    currentTranscriptIndex: 0,
                    completed: false,
                    totalScore: 0,
                    transcriptsCompleted: 0,
                    totalTranscripts: 0
                }
            });
        }

        // Add total transcripts count to response
        const totalTranscripts = progress.Video?.Transcripts?.length || 0;

        res.json({
            data: {
                ...progress.toJSON(),
                totalTranscripts
            }
        });

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
                attributes: [
                    'id', 'title', 'channel', 'view', 'topicId', 'thumbnail',
                    'url', 'duration', 'level', 'status', 'createdAt', 'updatedAt'
                ]
            }],
            order: [['lastUpdated', 'DESC']]
        });

        // Transform data and get signed URLs for thumbnails and videos
        const transformedProgress = await Promise.all(progress.map(async (item) => {
            const progressData = item.toJSON();
            const video = progressData.Video;
            
            // Get signed URL for thumbnail
            if (video?.thumbnail) {
                const { url, error } = await getSignedUrl('/thumbnails', video.thumbnail);
                if (!error) {
                    video.thumbnail = url;
                }
            }

            // Get signed URL for video
            if (video?.url) {
                const { url, error } = await getSignedUrl('/videos', video.url);
                if (!error) {
                    video.url = url;
                }
            }

            return {
                ...video,
                progress: {
                    currentTranscriptIndex: progressData.currentTranscriptIndex,
                    transcriptsCompleted: progressData.transcriptsCompleted,
                    totalScore: progressData.totalScore,
                    completed: progressData.completed,
                    totalTranscripts: progressData.totalTranscripts || 0,
                    createdAt: progressData.createdAt,
                    updatedAt: progressData.updatedAt
                }
            };
        }));

        res.json(transformedProgress);

    } catch (error) {
        console.error('Error getting all user progress:', error);
        res.status(500).json({
            message: "Error getting user progress",
            error: error.message
        });
    }
};