import { Schema, model, models } from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new Schema(
  {
    fullname: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String },
  },
  { timestamps: true },
);

// Every role to user
userSchema.pre("save", function () {
  this.role = "user";
});

userSchema.pre("save", async function () {
  this.password = await bcrypt.hash(this.password.toString(), 12);
});

const UserModel = models.User || model("User", userSchema);
export default UserModel;
