import Meta from "../models/meta.model.js";

// GET /api/meta — public, returns the singleton LMS meta document
export const getMeta = async (req, res, next) => {
  try {
    let meta = await Meta.findOne();
    if (!meta) {
      meta = await Meta.create({});
    }
    return res.status(200).json(meta);
  } catch (error) {
    return next(error);
  }
};

// PUT /api/meta — admin only, upserts the singleton
export const updateMeta = async (req, res, next) => {
  try {
    let meta = await Meta.findOne();
    if (meta) {
      Object.assign(meta, req.body);
      await meta.save();
    } else {
      meta = await Meta.create(req.body);
    }
    return res.status(200).json(meta);
  } catch (error) {
    return next(error);
  }
};
