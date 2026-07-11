import { jest } from "@jest/globals";
import request from "supertest";

// Mock the database connection to prevent real attempts to connect
jest.unstable_mockModule("../src/utils/db.js", () => {
  return {
    default: async () => {},
  };
});

// Mock jsonwebtoken using ESM Mocking
jest.unstable_mockModule("jsonwebtoken", () => {
  return {
    default: {
      sign: () => "mocked.jwt.token",
      verify: () => ({ id: "mockuser123" }),
    },
  };
});

// Dynamically import models and app after the mocks are defined
const { default: User } = await import("../src/models/User.js");
const { default: Note } = await import("../src/models/Note.js");
const { default: Progress } = await import("../src/models/Progress.js");
const { default: Answer } = await import("../src/models/Answer.js");
const { default: app } = await import("../src/app.js");

describe("LMS Backend API Endpoints", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Auth Routes", () => {
    it("POST /api/auth/signup should register a user", async () => {
      User.findOne = jest.fn().mockResolvedValue(null);
      User.create = jest.fn().mockResolvedValue({
        _id: "mockuser123",
        name: "Test User",
        email: "test@example.com",
      });

      const response = await request(app)
        .post("/api/auth/signup")
        .send({
          name: "Test User",
          email: "test@example.com",
          password: "password123",
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("token");
      expect(response.body.email).toBe("test@example.com");
    });

    it("POST /api/auth/login should log in a user", async () => {
      const mockUser = {
        _id: "mockuser123",
        name: "Test User",
        email: "test@example.com",
        comparePassword: jest.fn().mockResolvedValue(true),
      };
      User.findOne = jest.fn().mockResolvedValue(mockUser);

      const response = await request(app)
        .post("/api/auth/login")
        .send({
          email: "test@example.com",
          password: "password123",
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("token");
      expect(response.body.name).toBe("Test User");
    });
  });

  describe("Notes Routes", () => {
    it("GET /api/notes should retrieve user notes", async () => {
      User.findById = jest.fn().mockReturnValue({
        select: jest.fn().mockResolvedValue({ _id: "mockuser123" }),
      });

      Note.find = jest.fn().mockResolvedValue([
        { topicId: "/jsx", content: "React notes" },
      ]);

      const response = await request(app)
        .get("/api/notes")
        .set("Authorization", "Bearer mocked-jwt-token");

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body[0].topicId).toBe("/jsx");
    });

    it("POST /api/notes should upsert a note", async () => {
      User.findById = jest.fn().mockReturnValue({
        select: jest.fn().mockResolvedValue({ _id: "mockuser123" }),
      });

      Note.findOneAndUpdate = jest.fn().mockResolvedValue({
        topicId: "/jsx",
        content: "New content",
      });

      const response = await request(app)
        .post("/api/notes")
        .set("Authorization", "Bearer mocked-jwt-token")
        .send({ topicId: "/jsx", content: "New content" });

      expect(response.status).toBe(200);
      expect(response.body.content).toBe("New content");
    });
  });

  describe("Progress Routes", () => {
    it("GET /api/progress should get user progress", async () => {
      User.findById = jest.fn().mockReturnValue({
        select: jest.fn().mockResolvedValue({ _id: "mockuser123" }),
      });

      Progress.findOne = jest.fn().mockResolvedValue({
        completedTopics: ["/jsx", "/components"],
      });

      const response = await request(app)
        .get("/api/progress")
        .set("Authorization", "Bearer mocked-jwt-token");

      expect(response.status).toBe(200);
      expect(response.body).toContain("/jsx");
    });
  });
});
