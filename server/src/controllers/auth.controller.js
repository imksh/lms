import * as authService from "../services/auth.service.js";

export const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000,
  path: "/",
};

const setTokenCookie = (res, token) => {
  res.cookie("token", token, COOKIE_OPTIONS);
};

export const signup = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide name, email, and password" });
    }
    const result = await authService.registerUser(name, email, password, role);
    setTokenCookie(res, result.token);
    return res.status(201).json(result);
  } catch (error) {
    return next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide email and password" });
    }
    const result = await authService.loginUser(email, password);
    setTokenCookie(res, result.token);
    return res.status(200).json(result);
  } catch (error) {
    return next(error);
  }
};

export const getMe = async (req, res, next) => {
  try {
    return res.status(200).json(req.user);
  } catch (error) {
    return next(error);
  }
};

export const updateMe = async (req, res, next) => {
  try {
    const updatedUser = await authService.updateUserProfile(
      req.user._id,
      req.body,
    );
    return res.status(200).json(updatedUser);
  } catch (error) {
    return next(error);
  }
};

export const getMyStats = async (req, res, next) => {
  try {
    const { _id, role } = req.user;
    let stats = {};

    if (role === "student") {
      const { default: Progress } = await import("../models/progress.model.js");
      const { default: Submission } =
        await import("../models/submission.model.js");

      const progress = await Progress.findOne({ user: _id });
      const completedTopics = progress ? progress.completedTopics.length : 0;

      const submissions = await Submission.find({ user: _id });
      const totalSubmissions = submissions.length;
      const totalPoints = submissions
        .filter((sub) => sub.status === "approved" && sub.grade != null)
        .reduce((sum, sub) => sum + sub.grade, 0);

      stats = { completedTopics, totalSubmissions, totalPoints };
    } else {
      const { default: Subject } = await import("../models/subject.model.js");
      const { default: Submission } =
        await import("../models/submission.model.js");

      const totalSubjects = await Subject.countDocuments(
        role === "teacher" ? { teacher: _id } : {},
      );

      const pendingEvaluations = await Submission.countDocuments({
        status: "pending",
      });

      stats = { totalSubjects, pendingEvaluations };
    }

    return res.status(200).json(stats);
  } catch (error) {
    return next(error);
  }
};

export const logout = async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
    path: "/",
  });
  return res.status(200).json({ message: "Logged out successfully" });
};
