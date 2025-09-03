import User from "../model/User.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user);
    if (!user) {
      throw new ApiError(404, "User not found");
    }
    res
      .status(200)
      .json(new ApiResponse(200, user, "User retrieved successfully"));
  } catch (error) {
    next(error);
  }
};

export const editProfile = async (req, res, next) => {
  const allowedUpdates = [
    "firstName",
    "lastName",
    "avatar",
    "bio",
    "interests",
    "experienceLevel",
    "location",
  ];

  const updates = Object.keys(req.body);

  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return next(new ApiError(400, "Invalid updates"));
  }

  try {
    const updateData = {};
    updates.forEach((field) => {
      updateData[field] = req.body[field];
    });

    const user = await User.findByIdAndUpdate(
      req.user,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!user) {
      return next(new ApiError(404, "User not found"));
    }

    return res
      .status(200)
      .json(new ApiResponse(200, user, "User updated successfully"));
  } catch (error) {
    next(error);
  }
};
export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      throw new ApiError(404, "User not found");
    }
    return res
      .status(200)
      .json(new ApiResponse(200, user, "User retrieved successfully"));
  } catch (error) {
    next(error);
  }
};
