import Connection from "../model/Connection.model.js";
import Matched from "../model/Matched.model.js";
import User from "../model/User.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { safeData, shuffle } from "../utils/constants.js";

export const pendingRequests = async (req, res, next) => {
  const loggedInUserId = req.user;

  try {
    if (!loggedInUserId) {
      throw new ApiError(400, "User ID is required");
    }

    const data = await Connection.find({
      toUserId: loggedInUserId,
      status: "pending",
    }).populate("fromUserId", safeData.join(" "));

    if (!data || data.length === 0) {
      return res
        .status(404)
        .json(new ApiResponse(404, "No pending connection requests found"));
    }
    const connections = data.map((connection) => connection.fromUserId);
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { connections },
          "User connection pending requests retrieved successfully"
        )
      );
  } catch (error) {
    next(error);
  }
};

export const matches = async (req, res, next) => {
  const loggedInUserId = req.user;

  try {
    if (!loggedInUserId) {
      throw new ApiError(400, "User not logged in");
    }

    const data = await Matched.find({
      users: { $in: [loggedInUserId] },
    }).populate("users", safeData.join(" "));

    if (!data || data.length === 0) {
      return res
        .status(404)
        .json(new ApiResponse(404, "No accepted connections found"));
    }
    const connections = data.map((match) =>
      match.users.find(
        (user) => user._id.toString() !== loggedInUserId.toString()
      )
    );

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { connections },
          "User connections retrieved successfully"
        )
      );
  } catch (error) {
    next(error);
  }
};

export const feed = async (req, res, next) => {
  const loggedInUserId = req.user;
  let page = req.query.page ? parseInt(req.query.page) : 1;
  let limit = req.query.limit ? parseInt(req.query.limit) : 10;
  if (limit > 10) limit = 10;
  if (page <= 0) page = 1;

  try {
    if (!loggedInUserId) {
      throw new ApiError(400, "User ID is required");
    }

    const excludedIds = new Set([loggedInUserId.toString()]);

    const connections = await Connection.find({
      $or: [{ fromUserId: loggedInUserId }, { toUserId: loggedInUserId }],
    });

    connections.forEach((c) => {
      excludedIds.add(c.fromUserId.toString());
      excludedIds.add(c.toUserId.toString());
    });
    const totalUsers = await User.countDocuments({
      _id: { $nin: Array.from(excludedIds) },
    });
    let feedUsers = await User.find({
      _id: { $nin: Array.from(excludedIds) },
    })
      .select(safeData.join(" "))
      .skip((page - 1) * limit)
      .limit(limit);
    const totalPages = Math.ceil(totalUsers / limit);
    return res.status(200).json(
      new ApiResponse(
        200,
        {
          users: feedUsers,
          page,
          limit,
          totalUsers,
          totalPages,
        },
        "Feed retrieved successfully"
      )
    );
  } catch (error) {
    next(error);
  }
};
