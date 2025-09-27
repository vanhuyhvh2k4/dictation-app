const request = require("supertest");
const express = require("express");
const bodyParser = require("body-parser");

// Import controller & model
const wordController = require("../controllers/wordController");
const { Word } = require("../models");

// Mock Sequelize model
jest.mock("../models", () => ({
  Word: {
    create: jest.fn(),
    findAll: jest.fn(),
    destroy: jest.fn(),
  },
}));

// Setup Express app để test router/controller
const app = express();
app.use(bodyParser.json());

// Fake middleware để gán user
app.use((req, res, next) => {
  req.user = { id: 1 }; // giả lập userId = 1
  next();
});

app.post("/words", wordController.addWord);
app.get("/words", wordController.getWords);
app.delete("/words/:id", wordController.deleteWord);

describe("Word Controller", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("POST /words → thêm từ mới", async () => {
    const mockWord = { id: 1, word: "apple", meaning: "quả táo", example: "I eat an apple" };
    Word.create.mockResolvedValue(mockWord);

    const res = await request(app)
      .post("/words")
      .send({ word: "apple", meaning: "quả táo", example: "I eat an apple" });

    expect(res.statusCode).toBe(201);
    expect(res.body.word).toBe("apple");
    expect(Word.create).toHaveBeenCalledWith({
      word: "apple",
      meaning: "quả táo",
      example: "I eat an apple",
      userId: 1,
    });
  });

  test("GET /words → lấy danh sách từ", async () => {
    const mockWords = [
      { id: 1, word: "apple", meaning: "quả táo" },
      { id: 2, word: "banana", meaning: "quả chuối" },
    ];
    Word.findAll.mockResolvedValue(mockWords);

    const res = await request(app).get("/words");

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveLength(2);
    expect(res.body[0].word).toBe("apple");
    expect(Word.findAll).toHaveBeenCalledWith({ where: { userId: 1 } });
  });

  test("DELETE /words/:id → xóa từ", async () => {
    Word.destroy.mockResolvedValue(1); // giả lập xóa thành công

    const res = await request(app).delete("/words/1");

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Word deleted successfully");
    expect(Word.destroy).toHaveBeenCalledWith({ where: { id: "1", userId: 1 } });
  });

  test("DELETE /words/:id → không tìm thấy từ", async () => {
    Word.destroy.mockResolvedValue(0); // không xóa được

    const res = await request(app).delete("/words/99");

    expect(res.statusCode).toBe(404);
    expect(res.body.error).toBe("Word not found");
  });
});
