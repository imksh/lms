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
      verify: () => ({ id: "mockuser123" }),
    },
  };
});

// Dynamically import models and app after the mocks are defined
const { default: User } = await import("../src/models/User.js");
const { default: Submission } = await import("../src/models/Submission.js");
const { default: app } = await import("../src/app.js");

describe("LMS Submissions API Endpoints", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Student Task Submission", () => {
    it("POST /api/submissions should successfully submit/upsert a task answer", async () => {
      // Mock auth user lookup
      User.findById = jest.fn().mockReturnValue({
        select: jest.fn().mockResolvedValue({ _id: "mockuser123", role: "user" }),
      });

      Submission.findOneAndUpdate = jest.fn().mockResolvedValue({
        user: "mockuser123",
        topicId: "/jsx",
        sectionIndex: 2,
        submissionType: "text",
        submittedContent: "I completed the JSX challenge.",
        status: "pending",
      });

      const response = await request(app)
        .post("/api/submissions")
        .set("Authorization", "Bearer mocked-jwt-token")
        .send({
          topicId: "/jsx",
          sectionIndex: 2,
          submissionType: "text",
          submittedContent: "I completed the JSX challenge.",
        });

      expect(response.status).toBe(200);
      expect(response.body.topicId).toBe("/jsx");
      expect(response.body.submittedContent).toBe("I completed the JSX challenge.");
      expect(response.body.status).toBe("pending");
    });

    it("GET /api/submissions/my should return student's own submissions", async () => {
      User.findById = jest.fn().mockReturnValue({
        select: jest.fn().mockResolvedValue({ _id: "mockuser123", role: "user" }),
      });

      Submission.find = jest.fn().mockResolvedValue([
        {
          topicId: "/jsx",
          sectionIndex: 2,
          submittedContent: "My JSX answer",
        },
      ]);

      const response = await request(app)
        .get("/api/submissions/my")
        .set("Authorization", "Bearer mocked-jwt-token");

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body[0].topicId).toBe("/jsx");
    });
  });

  describe("Admin Submissions Evaluation", () => {
    it("GET /api/submissions should allow admin to view all submissions", async () => {
      // Mock admin user lookup
      User.findById = jest.fn().mockReturnValue({
        select: jest.fn().mockResolvedValue({ _id: "mockuser123", role: "admin" }),
      });

      Submission.find = jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnValue({
          sort: jest.fn().mockResolvedValue([
            {
              topicId: "/jsx",
              sectionIndex: 2,
              submittedContent: "Student's JSX code",
              user: { name: "Alice" },
            },
          ]),
        }),
      });

      const response = await request(app)
        .get("/api/submissions")
        .set("Authorization", "Bearer mocked-jwt-token");

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body[0].user.name).toBe("Alice");
    });

    it("PUT /api/submissions/:id/evaluate should allow admin to grade submission", async () => {
      User.findById = jest.fn().mockReturnValue({
        select: jest.fn().mockResolvedValue({ _id: "mockuser123", role: "admin" }),
      });

      Submission.findByIdAndUpdate = jest.fn().mockReturnValue({
        populate: jest.fn().mockResolvedValue({
          _id: "submission123",
          status: "approved",
          grade: 10,
          feedback: "Great job!",
          user: { name: "Alice" },
        }),
      });

      const response = await request(app)
        .put("/api/submissions/submission123/evaluate")
        .set("Authorization", "Bearer mocked-jwt-token")
        .send({
          status: "approved",
          grade: 10,
          feedback: "Great job!",
        });

      expect(response.status).toBe(200);
      expect(response.body.status).toBe("approved");
      expect(response.body.grade).toBe(10);
      expect(response.body.feedback).toBe("Great job!");
    });
  });
});
