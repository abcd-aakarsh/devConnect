import ApiError from "../utils/ApiError.js";

export const validate = (schema) => (req, res, next) => {
  try {
    schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    next();
  } catch (error) {
    if (error.errors) {
      // Zod v3
      const formatted = error.errors[0]?.message || "Validation failed";
      next(new ApiError(400, formatted));
    } else if (error.issues) {
      // Zod v4
      const formatted = error.issues[0]?.message || "Validation failed";
      next(new ApiError(400, formatted));
    } else {
      next(new ApiError(400, "Validation failed"));
    }
  }
};
