import User from "../model/User.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { generateJwt } from "../utils/generateJwt.js";
export const signUp = async (req, res, next) => {
  const { firstName, lastName, email, password, dob } = req.body;

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new ApiError(409, "Email already in use");
    }

    const user = new User({
      firstName,
      lastName,
      email,
      password,
      dob,
    });
    await user.save();
    return res
      .status(201)
      .json(new ApiResponse(201, user, "User created successfully"));
  } catch (error) {
    next(error);
  }
};
export const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      throw new ApiError(401, "Invalid email or password");
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      throw new ApiError(401, "Invalid email or password");
    }

    const token = generateJwt(user._id);
    res.cookie("token", token, {
      expires: new Date(Date.now() + 2 * 24 * 3600000),
      httpOnly: true,
    }); // 2 days

    return res.status(200).json(new ApiResponse(200, user, "Login successful"));
  } catch (error) {
    next(error);
  }
};
export const logout = async (req, res, next) => {
  try {
    res.clearCookie("token");
    return res
      .status(200)
      .json(new ApiResponse(200, null, "Logout successful"));
  } catch (error) {
    next(error);
  }
};
export const forgotPassword = async (req, res, next) => {
  // TODO: Implement forgot password functionality
  // get email from request body
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return next(new ApiError(404, "Invalid email address"));
    }

    const resetToken = user.generateResetToken();
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpire = Date.now() + 30 * 60 * 1000; // 30 minutes

    await user.save();
    // sendEmail({
    //   email: user.email,
    //   subject: "Password Reset Token",
    //   message: `Forgot your password? Reset it here: ${resetToken}`,
    // });

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { resetToken },
          "Password reset link sent to email with reset token"
        )
      );
  } catch (error) {
    next(error);
  }
};
