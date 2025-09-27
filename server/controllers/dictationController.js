import models from "../models/index.js";
const { Transcript, UserProgress } = models;

function normalizeText(s) {
  return s
    .toLowerCase()
    .replace(/[\.,!?;:\"'()\[\]{}]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

// So sánh 1 câu người dùng nhập vs transcript chuẩn
function gradeSentence(userText, correctText) {
  const u = normalizeText(userText).split(" ").filter(Boolean);
  const c = normalizeText(correctText).split(" ").filter(Boolean);
  const total = c.length || 1;
  let correctCount = 0;
  const detail = [];

  // So sánh theo vị trí đơn giản
  for (let i = 0; i < total; i++) {
    if (u[i] && u[i] === c[i]) {
      correctCount++;
      detail.push({ word: c[i], ok: true });
    } else {
      detail.push({ word: c[i], ok: false, userWord: u[i] || null });
    }
  }

  const score = (correctCount / total) * 100;
  return { score, correctCount, total, detail };
}

// Endpoint: nộp 1 câu
export const submitSentence = async (req, res) => {
  try {
    const { transcriptId, userText } = req.body;
    const transcript = await Transcript.findByPk(transcriptId);
    if (!transcript)
      return res.status(404).json({ message: "Transcript not found" });

    const result = gradeSentence(userText, transcript.text);

    // (Tuỳ chọn) lưu điểm từng câu vào UserProgress - ở phiên bản gọn ta lưu điểm trung bình khi video hoàn thành
    res.json({ transcriptId, result });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Endpoint: khi hoàn thành toàn bộ video
export const completeVideo = async (req, res) => {
  try {
    const { videoId, averageScore } = req.body; // averageScore do client tính toán từ từng câu hoặc server có thể tính
    const userId = req.userId;
    const up = await UserProgress.create({
      userId,
      videoId,
      score: averageScore,
    });
    res.json({ message: "Saved progress", userProgress: up });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
