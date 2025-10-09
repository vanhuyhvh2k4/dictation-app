// controllers/transcriptController.js
import ffmpeg from "fluent-ffmpeg";
import ffmpegPath from "ffmpeg-static";
import fs from "fs/promises";
import path from "path";
import openai from "../utils/openai.js";
import models from "../models/index.js";
import { parseSubtitleContent } from '../utils/parseSubtitleContent.js';

const { Transcript } = models;
ffmpeg.setFfmpegPath(ffmpegPath);

export const generateTranscript = async (req, res) => {
  try {
    const { videoId } = req.body;
    const videoFile = req.file;

    if (!videoFile) {
      return res.status(400).json({ error: "No video file uploaded" });
    }

    // B1: convert video -> wav
    const audioPath = path.join(process.cwd(), `uploads/${Date.now()}.wav`);
    await new Promise((resolve, reject) => {
      ffmpeg(videoFile.path)
        .output(audioPath)
        .audioChannels(1)
        .audioFrequency(16000)
        .toFormat("wav")
        .on("end", resolve)
        .on("error", reject)
        .run();
    });

    // B2: gửi audio đến Whisper
    const response = await openai.audio.transcriptions.create({
      file: fs.createReadStream(audioPath),
      model: "whisper-1",
      response_format: "verbose_json", // để có start/end
    });

    // B3: Lưu DB
    const records = response.segments.map((seg, index) => ({
      videoId,
      sentenceIndex: index + 1,
      text: seg.text,
      start: seg.start,
      end: seg.end,
    }));

    await Transcript.bulkCreate(records);

    res.status(201).json({
      message: "Transcript generated successfully",
      count: records.length,
    });
  } catch (error) {
    console.error("Generate transcript error:", error);
    res.status(500).json({ error: "Failed to generate transcript" });
  }
};

export const importSubtitle = async (req, res) => {
  try {
    const file = req.files.transcript?.[0];
    const video = req.video;
    const videoId = video?.id;

    if (!file) return res.status(400).json({ error: 'Subtitle file required (field name: transcript)' });
    if (!videoId) return res.status(400).json({ error: 'videoId is required' });

    const ext = path.extname(file.originalname).toLowerCase();
    if (!['.srt', '.vtt', '.txt'].includes(ext)) {
      return res.status(400).json({ error: 'Unsupported file type. Use .srt or .vtt or .txt' });
    }

    // đọc trực tiếp từ buffer (memoryStorage)
    const raw = file.buffer.toString("utf8");
    const segments = parseSubtitleContent(raw);

    if (segments.length === 0) {
      return res.status(400).json({ error: 'No subtitles parsed from file' });
    }

    // xóa transcript cũ của video
    await Transcript.destroy({ where: { videoId } });

    // build records mới
    const records = segments.map((s, idx) => ({
      videoId: Number(videoId),
      sentenceIndex: idx,
      text: s.text,
      start: Number(s.start),
      end: Number(s.end)
    }));

    await Transcript.bulkCreate(records);

    return res.status(201).json({ 
      message: 'Imported successfully', 
      video, 
      count: records.length 
    });
  } catch (error) {
    console.error('Import subtitle error:', error);
    return res.status(500).json({ error: 'Server error importing subtitles' });
  }
};

