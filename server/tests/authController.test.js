const request = require("supertest");
const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const authController = require("../controllers/authController");
const { User } = require("../models");

jest.mock("../models", () => ({
  User: {
    create: jest.fn(),
    findOne: jest.fn(),
  },
}));

jest.mock("bcryptjs");
jest.mock("jsonwebtoken");

const app = express();
app.use(bodyParser.json());
app.post("/signup", authController.signup);
app.post("/login", authController.login);

describe("Auth Controller", () => {
  afterEach(() => jest.clearAllMocks());

  test("POST /signup → tạo user mới", async () => {
    bcrypt.hash.mockResolvedValue("hashed_pw");
    User.create.mockResolvedValue({ id: 1, username: "test", password: "hashed_pw" });

    const res = await request(app).post("/signup").send({ username: "test", password: "123" });

    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe("User created successfully");
    expect(User.create).toHaveBeenCalledWith({ username: "test", password: "hashed_pw" });
  });

  test("POST /login → đăng nhập thành công", async () => {
    const mockUser = { id: 1, username: "test", password: "hashed_pw" };
    User.findOne.mockResolvedValue(mockUser);
    bcrypt.compare.mockResolvedValue(true);
    jwt.sign.mockReturnValue("fake_token");

    const res = await request(app).post("/login").send({ username: "test", password: "123" });

    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBe("fake_token");
  });

  test("POST /login → sai mật khẩu", async () => {
    User.findOne.mockResolvedValue({ id: 1, username: "test", password: "hashed_pw" });
    bcrypt.compare.mockResolvedValue(false);

    const res = await request(app).post("/login").send({ username: "test", password: "wrong" });

    expect(res.statusCode).toBe(401);
  });
});
