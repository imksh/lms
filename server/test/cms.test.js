import { jest } from "@jest/globals";
import request from "supertest";

// Mock the database connection
jest.unstable_mockModule("../src/utils/db.js", () => {
  return {
    default: async () => {},
  };
});

// Mock jsonwebtoken
jest.unstable_mockModule("jsonwebtoken", () => {
  return {
    default: {
      sign: () => "mocked.jwt.token",
      verify: () => ({ id: "mockadmin123" }),
    },
  };
});

// Dynamically import models and app after the mocks are defined
const { default: User } = await import("../src/models/User.js");
const { default: Subject } = await import("../src/models/Subject.js");
const { default: Topic } = await import("../src/models/Topic.js");
const { default: app } = await import("../src/app.js");

describe("LMS CMS API Endpoints", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Subjects CMS Routes", () => {
    it("GET /api/cms/subjects should fetch subjects list", async () => {
      Subject.find = jest.fn().mockReturnValue({
        sort: jest.fn().mockResolvedValue([
          { key: "react", title: "React Masterclass" },
        ]),
      });

      const response = await request(app).get("/api/cms/subjects");

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body[0].key).toBe("react");
    });

    it("POST /api/cms/subjects should allow admin to create subject", async () => {
      // Mock auth user lookup to return role admin
      User.findById = jest.fn().mockReturnValue({
        select: jest.fn().mockResolvedValue({ _id: "mockadmin123", role: "admin" }),
      });

      Subject.findOne = jest.fn().mockResolvedValue(null);
      Subject.create = jest.fn().mockResolvedValue({
        key: "sql",
        title: "SQL Basics",
      });

      const response = await request(app)
        .post("/api/cms/subjects")
        .set("Authorization", "Bearer mocked-jwt-token")
        .send({ key: "sql", title: "SQL Basics" });

      expect(response.status).toBe(201);
      expect(response.body.key).toBe("sql");
    });

    it("POST /api/cms/subjects should deny access for regular user", async () => {
      // Mock auth user lookup to return role user
      User.findById = jest.fn().mockReturnValue({
        select: jest.fn().mockResolvedValue({ _id: "mockadmin123", role: "user" }),
      });

      const response = await request(app)
        .post("/api/cms/subjects")
        .set("Authorization", "Bearer mocked-jwt-token")
        .send({ key: "sql", title: "SQL Basics" });

      expect(response.status).toBe(403);
      expect(response.body.message).toContain("Access denied");
    });
  });

  describe("Topics CMS Routes", () => {
    it("GET /api/cms/topics should fetch topics list", async () => {
      Topic.find = jest.fn().mockReturnValue({
        sort: jest.fn().mockResolvedValue([
          { topicId: "/introduction", title: "Intro" },
        ]),
      });

      const response = await request(app).get("/api/cms/topics");

      expect(response.status).toBe(200);
      expect(response.body[0].topicId).toBe("/introduction");
    });

    it("POST /api/cms/topics should allow admin to create topic", async () => {
      User.findById = jest.fn().mockReturnValue({
        select: jest.fn().mockResolvedValue({ _id: "mockadmin123", role: "admin" }),
      });

      Topic.findOne = jest.fn().mockResolvedValue(null);
      Topic.create = jest.fn().mockResolvedValue({
        topicId: "/sql/select",
        title: "SELECT query",
      });

      const response = await request(app)
        .post("/api/cms/topics")
        .set("Authorization", "Bearer mocked-jwt-token")
        .send({ subjectKey: "sql", topicId: "/sql/select", title: "SELECT query" });

      expect(response.status).toBe(201);
      expect(response.body.topicId).toBe("/sql/select");
    });
  });
});
