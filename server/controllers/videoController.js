import { createClient } from "@supabase/supabase-js";
import models from "../models/index.js";

const { Video, Transcript, UserProgress } = models;
const BUCKET_NAME = "dictation_app";

// Supabase client - upload từ server, dùng SERVICE_ROLE_KEY
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Lấy danh sách video
export const getListVideos = async (req, res) => {
  try {
    // Lấy userId từ auth middleware (nếu có)
    const userId = req.userId;
    const { level } = req.query;
    console.log('Current userId:', userId);
    console.log('Query level:', level);

    // Cấu hình where condition
    const whereCondition = {};
    if (level) {
      whereCondition.level = level;
    }

    // Cấu hình include cho query
    const includes = [
      {
        model: Transcript,
        attributes: ['id']
      }
    ];

    // Chỉ thêm UserProgress vào query nếu có userId
    if (userId) {
      includes.push({
        model: UserProgress,
        where: { userId },
        required: false, // LEFT JOIN để lấy cả video chưa có progress
        attributes: [
          'id',
          'userId',
          'videoId',
          'currentTranscriptIndex',
          'transcriptsCompleted',
          'totalScore',
          'completed'
        ]
      });
    }

    console.log('Query includes:', JSON.stringify(includes, null, 2));

    // Find all videos with optional user progress and level filter
    const videos = await Video.findAll({
      where: whereCondition,
      order: [["createdAt", "DESC"]],
      include: includes,
      logging: console.log // Log the actual SQL query
    });

    const listVideos = await Promise.all(
      videos.map(async (video) => {
        try {
          const plainVideo = video.get({ plain: true });

          // Tạo signed URL tạm thời
          const { data: signedVideoData, error: videoError } = await supabase.storage
            .from(`${BUCKET_NAME}/videos`)
            .createSignedUrl(video.url, 60 * 60); // 1 giờ
            
          if (videoError) {
            throw videoError;
          }

          const { data: signedThumbnailData, error: thumbnailError } = await supabase.storage
            .from(`${BUCKET_NAME}/thumbnails`)
            .createSignedUrl(video.thumbnail, 60 * 60); // 1 giờ
            
          if (thumbnailError) {
            throw thumbnailError;
          }

          // Format progress data
          const totalTranscripts = plainVideo.Transcripts?.length || 0;
          let progressData = null;

          console.log('Processing video:', plainVideo.id);
          console.log('UserProgresses:', plainVideo.UserProgresses);
          
          // Chỉ xử lý progress nếu có UserProgresses và userId
          if (userId && plainVideo.UserProgresses?.length > 0) {
            const progress = plainVideo.UserProgresses[0];
            console.log('Found progress for video:', plainVideo.id, progress);
            progressData = {
              currentTranscriptIndex: progress.currentTranscriptIndex,
              transcriptsCompleted: progress.transcriptsCompleted,
              totalScore: progress.totalScore,
              completed: progress.completed,
              totalTranscripts
            };
          }

          return {
            ...plainVideo,
            url: signedVideoData?.signedUrl,
            thumbnail: signedThumbnailData?.signedUrl,
            progress: progressData,
            Transcripts: undefined, // Remove transcripts from response
            UserProgresses: undefined // Remove raw progress data
          };
      } catch (err) {
        // Trường hợp lỗi 1 video => vẫn trả video nhưng kèm cờ báo lỗi
        return {
          ...video,
          url: video.url,
          error: err.message || "Failed to create signed URL",
        };
      }
    })
  );

    res.status(200).json(listVideos);
  } catch (error) {
    console.error("Error fetching videos:", error);
    res.status(500).json({ error: "Failed to fetch videos" });
  }
};

// Lấy video daily
export const getDailyVideo = async (req, res) => {
  try {
    const video = await Video.findOne({
      order: [["date", "DESC"]],
      include: [{ model: Transcript }],
    });

    if (!video) return res.status(404).json({ message: "No video found" });

    return res.json(video);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error fetching daily video", error: error.message });
  }
};

// Lấy video theo ID
export const getVideoById = async (req, res) => {
  try {
    const { id } = req.params;
    const video = await Video.findByPk(id, {
      include: [{ model: Transcript }],
    });

    if (!video) return res.status(404).json({ message: "Video not found" });

    // Tạo signed URL tạm thời
    const { data: signedVideoData, videoError } = await supabase.storage
      .from(`${BUCKET_NAME}/videos`)
      .createSignedUrl(video.url, 60 * 60); // 1 giờ

    if (videoError) return res.status(500).json({ error: error.message });

    // Tạo signed URL tạm thời
    const { data: signedThumbnailData, thumbnailError } = await supabase.storage
      .from(`${BUCKET_NAME}/thumbnails`)
      .createSignedUrl(video.thumbnail, 60 * 60); // 1 giờ

    if (thumbnailError) return res.status(500).json({ error: error.message });

    res.json({
      ...video.toJSON(),
      url: signedVideoData.signedUrl,
      thumbnail: signedThumbnailData.signedUrl,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error fetching video", error: error.message });
  }
};

export const uploadVideo = async (req, res, next) => {
  // Nếu file không đầy đủ
  if (!req.files.video) {
    return res.status(400).json({ error: "Video not uploaded" });
  }

  const videoFile = req.files.video[0];

  const videoFileName = `${Date.now()}-${videoFile.originalname}`;

  // Upload video
  const { data: videoData, error: videoError } = await supabase.storage
    .from(`${BUCKET_NAME}/videos`)
    .upload(videoFileName, videoFile.buffer, {
      contentType: videoFile.mimetype,
      upsert: true,
    });

  if (videoError) return res.status(500).json({ error: videoError.message });

  console.log("Upload successful", videoData);

  req.video = {
    url: videoFileName,
  };

  next();
};

export const uploadThumbnail = async (req, res, next) => {
  // Nếu file không đầy đủ
  if (!req.files.thumbnail) {
    return res.status(400).json({ error: "Thumbnail not uploaded" });
  }

  const thumbnailFile = req.files.thumbnail[0];

  const thumbnailFileName = `${Date.now()}-${thumbnailFile.originalname}`;

  // Upload thumbnail
  const { data: thumbData, error: thumbError } = await supabase.storage
    .from(`${BUCKET_NAME}/thumbnails`)
    .upload(thumbnailFileName, thumbnailFile.buffer, {
      contentType: thumbnailFile.mimetype,
      upsert: true,
    });

  if (thumbError) return res.status(500).json({ error: thumbError.message });

  console.log("Upload successful", thumbData);

  req.video = {
    ...req.video,
    thumbnail: thumbnailFileName,
  };

  next();
};

export const finalizeUpload = async (req, res, next) => {
  try {
    const videoData = req.video;
    const validatedBody = req.validatedBody;

    const newVideo = await Video.create({
      title: validatedBody.title || "Untitled",
      url: videoData.url,
      date: new Date(),
      level: validatedBody.level,
      channel: validatedBody.channel,
      view: 0,
      thumbnail: videoData.thumbnail,
      duration: validatedBody.duration,
    });

    req.video = newVideo;
    next();
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error creating video", error: error.message });
  }
};
