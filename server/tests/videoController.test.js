const request = require("supertest");
const express = require("express");
const bodyParser = require("body-parser");
const videoController = require("../controllers/videoController");
const { Video, Transcript } = require("../models");

jest.mock("../models", () => ({
  Video: { findAll: jest.fn(), findByPk: jest.fn() },
  Transcript: {},
}));

const app = express();
app.use(bodyParser.json());
app.get("/videos", videoController.getVideos);
app.get("/videos/:id", videoController.getVideoById);

describe("Video Controller", () => {
  afterEach(() => jest.clearAllMocks());

  test("GET /videos → trả về danh sách video", async () => {
    Video.findAll.mockResolvedValue([{ id: 1, title: "Video 1" }]);

    const res = await request(app).get("/videos");

    expect(res.statusCode).toBe(200);
    expect(res.body[0].title).toBe("Video 1");
  });

  test("GET /videos/:id → trả về 1 video kèm transcript", async () => {
    const mockVideo = { id: 1, title: "Video 1", Transcripts: [{ text: "Hello" }] };
    Video.findByPk.mockResolvedValue(mockVideo);

    const res = await request(app).get("/videos/1");

    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe("Video 1");
    expect(res.body.Transcripts[0].text).toBe("Hello");
  });

  test("GET /videos/:id → video không tồn tại", async () => {
    Video.findByPk.mockResolvedValue(null);

    const res = await request(app).get("/videos/99");

    expect(res.statusCode).toBe(404);
  });
});
