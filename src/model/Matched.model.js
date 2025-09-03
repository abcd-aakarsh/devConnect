import mongoose from "mongoose";

const matchedSchema = new mongoose.Schema(
  {
    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
  },
  {
    timestamps: true,
  }
);

matchedSchema.pre("save", function (next) {
  this.users.sort();
  next();
});
matchedSchema.index({ "users.0": 1, "users.1": 1 }, { unique: true });

const Matched = mongoose.model("Matched", matchedSchema);
export default Matched;
