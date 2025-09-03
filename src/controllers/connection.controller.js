import e from "express";
import Connection from "../model/Connection.model.js";
import Matched from "../model/Matched.model.js";
import User from "../model/User.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

export const sendConnectionRequest = async (req, res, next) => {
  const { toUserId } = req.params;
  const fromUserId = req.user;

  try {
    if (!fromUserId || !toUserId) {
      throw new ApiError(
        400,
        "Connection request failed: fromUserId and toUserId are required"
      );
    }
    if (fromUserId === toUserId) {
      throw new ApiError(
        400,

        "Connection request failed: You cannot connect with yourself"
      );
    }

    const [fromUser, toUser] = await Promise.all([
      User.findById(fromUserId),
      User.findById(toUserId),
    ]);

    if (!fromUser || !toUser) {
      throw new ApiError(404, "Connection request failed: User not found");
    }

    const existingConnection = await Connection.findOne({
      $or: [
        { fromUserId, toUserId },
        { fromUserId: toUserId, toUserId: fromUserId },
      ],
    });
    if (existingConnection) {
      switch (existingConnection.status) {
        case "accepted":
          return res
            .status(200)
            .json(
              new ApiResponse(
                200,
                { connection: existingConnection },
                `Connection request failed: You are already connected to ${toUser.firstName}`
              )
            );
        case "pending":
          return res
            .status(200)
            .json(
              new ApiResponse(
                200,
                { connection: existingConnection },
                `Connection request failed: You have already sent a request to ${toUser.firstName}`
              )
            );
        case "rejected":
          return res
            .status(200)
            .json(
              new ApiResponse(
                200,
                { connection: existingConnection },
                `Connection request failed: ${toUser.firstName} has already rejected a request from ${fromUser.firstName}`
              )
            );
        case "passed":
          return res
            .status(200)
            .json(
              new ApiResponse(
                200,
                { connection: existingConnection },
                `Connection request failed: You have already passed on ${toUser.firstName}`
              )
            );
        default:
          throw new ApiError(
            400,
            "Connection accept failed: Unknown connection status"
          );
      }
    }

    const newConnection = await Connection.create({
      fromUserId,
      toUserId,
    });

    return res.status(201).json(
      new ApiResponse(
        201,
        {
          connection: newConnection,
        },
        `${fromUser.firstName} sent a connection request to ${toUser.firstName}`
      )
    );
  } catch (error) {
    next(error);
  }
};

export const passConnection = async (req, res, next) => {
  const { toUserId } = req.params;
  const fromUserId = req.user;

  try {
    if (!fromUserId || !toUserId) {
      throw new ApiError(
        400,
        "Connection pass failed: fromUserId and toUserId are required"
      );
    }
    if (fromUserId === toUserId) {
      throw new ApiError(
        400,
        "Connection pass failed: You cannot pass yourself"
      );
    }
    const [fromUser, toUser] = await Promise.all([
      User.findById(fromUserId),
      User.findById(toUserId),
    ]);
    if (!fromUser || !toUser) {
      throw new ApiError(404, "Connection pass failed: User not found");
    }

    const existingConnection = await Connection.findOne({
      $or: [
        { fromUserId, toUserId },
        { fromUserId: toUserId, toUserId: fromUserId },
      ],
    });

    if (existingConnection) {
      switch (existingConnection.status) {
        case "accepted":
          return res
            .status(200)
            .json(
              new ApiResponse(
                200,
                { connection: existingConnection },
                `${fromUser.firstName} is already connected with ${toUser.firstName}.`
              )
            );
        case "pending":
          return res
            .status(200)
            .json(
              new ApiResponse(
                200,
                { connection: existingConnection },
                `A connection request between ${fromUser.firstName} and ${toUser.firstName} is still pending.`
              )
            );
        case "rejected":
          return res
            .status(200)
            .json(
              new ApiResponse(
                200,
                { connection: existingConnection },
                `${toUser.firstName} has already rejected a connection request from ${fromUser.firstName}.`
              )
            );
        case "passed":
          return res
            .status(200)
            .json(
              new ApiResponse(
                200,
                { connection: existingConnection },
                `You have already passed on ${toUser.firstName}.`
              )
            );
        default:
          throw new ApiError(
            400,
            "Connection accept failed: Unknown connection status"
          );
      }
    }
    const newPass = await Connection.create({
      fromUserId,
      toUserId,
      status: "passed",
    });
    return res
      .status(201)
      .json(
        new ApiResponse(
          201,
          { connection: newPass },
          `${fromUser.firstName} has passed on ${toUser.firstName}.`
        )
      );
  } catch (error) {
    next(error);
  }
};

export const acceptConnection = async (req, res, next) => {
  const { requestId } = req.params;
  const loggedInUserId = req.user;

  try {
    if (!loggedInUserId || !requestId) {
      throw new ApiError(
        400,
        "Connection accept failed: loggedInUserId and requestId are required"
      );
    }
    const connectionRequest = await Connection.findById(requestId);
    if (!connectionRequest) {
      throw new ApiError(
        400,
        "Connection accept failed: Connection request not found"
      );
    }
    if (loggedInUserId.toString() !== connectionRequest.toUserId.toString()) {
      throw new ApiError(
        403,
        "Connection accept failed: You are not authorized to accept this request"
      );
    }
    const [loggedInUser, fromUser] = await Promise.all([
      User.findById(loggedInUserId),
      User.findById(connectionRequest.fromUserId),
    ]);

    switch (connectionRequest.status) {
      case "passed":
      case "rejected":
        return res
          .status(200)
          .json(
            new ApiResponse(
              200,
              { connection: connectionRequest },
              "Connection accept failed: This request was already passed or rejected."
            )
          );

      case "accepted":
        return res
          .status(200)
          .json(
            new ApiResponse(
              200,
              { connection: connectionRequest },
              `${loggedInUser.firstName} is already connected to ${fromUser.firstName}.`
            )
          );

      case "pending":
        connectionRequest.status = "accepted";
        await connectionRequest.save();

        const match = await Matched.create({
          users: [loggedInUserId, connectionRequest.fromUserId],
        });

        return res
          .status(200)
          .json(
            new ApiResponse(
              200,
              { connection: connectionRequest, match },
              `${loggedInUser.firstName} accepted the connection request from ${fromUser.firstName}`
            )
          );
      default:
        throw new ApiError(
          400,
          "Connection accept failed: Unknown connection status"
        );
    }
  } catch (error) {
    next(error);
  }
};
export const rejectConnection = async (req, res, next) => {
  const { requestId } = req.params;
  const loggedInUserId = req.user;
  try {
    if (!loggedInUserId || !requestId) {
      throw new ApiError(
        400,
        "Connection reject failed: loggedInUserId and requestId are required"
      );
    }
    const connectionRequest = await Connection.findById(requestId);
    if (!connectionRequest) {
      throw new ApiError(
        400,
        "Connection reject failed: Connection request not found"
      );
    }
    if (loggedInUserId.toString() !== connectionRequest.toUserId.toString()) {
      throw new ApiError(
        403,
        "Connection reject failed: You are not authorized to reject this request"
      );
    }

    const [loggedInUser, fromUser] = await Promise.all([
      User.findById(loggedInUserId),
      User.findById(connectionRequest.fromUserId),
    ]);
    if (!loggedInUser || !fromUser) {
      throw new ApiError(404, "Connection reject failed: User not found");
    }

    switch (connectionRequest.status) {
      case "accepted":
        return res
          .status(200)
          .json(
            new ApiResponse(
              200,
              { connection: connectionRequest },
              `${loggedInUser.firstName} is already connected with ${fromUser.firstName}, you cannot reject this connection.`
            )
          );
      case "pending":
        connectionRequest.status = "rejected";
        await connectionRequest.save();
        return res
          .status(200)
          .json(
            new ApiResponse(
              200,
              { connection: connectionRequest },
              `${loggedInUser.firstName} rejected the connection request from ${fromUser.firstName}`
            )
          );
      case "rejected":
        return res
          .status(200)
          .json(
            new ApiResponse(
              200,
              { connection: connectionRequest },
              `${loggedInUser.firstName} has already rejected a connection request from ${fromUser.firstName}.`
            )
          );
      case "passed":
        return res
          .status(200)
          .json(
            new ApiResponse(
              200,
              { connection: connectionRequest },
              `You have already passed on ${fromUser.firstName} or ${fromUser.firstName} has passed on you.`
            )
          );
      default:
        throw new ApiError(
          400,
          "Connection reject failed: Unknown connection status"
        );
    }
  } catch (error) {
    next(error);
  }
};
