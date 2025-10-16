import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import crypto from "crypto";
const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "First name is required"],
    trim: true,
    minLength: 2,
    maxLength: 30,
  },
  lastName: {
    type: String,
    trim: true,
    minLength: 2,
    maxLength: 30,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/.+\@.+\..+/, "Invalid email format"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    trim: true,
    minLength: 6,
  },
  dob: {
    type: Date,
    required: [true, "Date of birth is required"],
  },

  verified: {
    type: Boolean,
    default: false,
  },
  avatar: {
    type: String,
    default: "https://avatarfiles.alphacoders.com/376/thumb-1920-376048.png",
  },
  bio: {
    type: String,
    default: "Nothing...",
  },
  interests: {
    type: [String],
    default: [],
  },
  experienceLevel: {
    type: String,
    enum: ["student", "junior", "mid", "senior", "lead"],
    default: "student",
  },
  location: {
    type: String,
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
});

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.generateResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.resetPasswordToken = resetToken;
  this.resetPasswordExpire = Date.now() + 30 * 60 * 1000; // 30 minutes
  return resetToken;
};

userSchema.virtual("age").get(function () {
  const currentDate = new Date();
  const birthDate = new Date(this.dob);
  let age = currentDate.getFullYear() - birthDate.getFullYear();
  const monthDiff = currentDate.getMonth() - birthDate.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && currentDate.getDate() < birthDate.getDate())
  ) {
    age--;
  }
  return age;
});

userSchema.set("toJSON", { virtuals: true, versionKey: false, id: false });
userSchema.set("toObject", { virtuals: true, versionKey: false, id: false });

const User = mongoose.model("User", userSchema);

export default User;
