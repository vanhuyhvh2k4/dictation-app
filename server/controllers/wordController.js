import models from "../models/index.js";
const { Word } = models;

// thêm từ vựng
export const addWord = async (req, res) => {
  try {
    const { word, meaning, example } = req.body;
    const newWord = await Word.create({
      word,
      meaning,
      example,
      userId: req.user.id,
    });
    res.status(201).json(newWord);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// lấy danh sách từ vựng của user
export const getWordlist = async (req, res) => {
  try {
    const words = await Word.findAll({ where: { userId: req.user.id } });
    res.json(words);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// xóa từ vựng
export const deleteWord = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Word.destroy({
      where: { id, userId: req.user.id },
    });
    if (!deleted) return res.status(404).json({ error: "Word not found" });
    res.json({ message: "Word deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
