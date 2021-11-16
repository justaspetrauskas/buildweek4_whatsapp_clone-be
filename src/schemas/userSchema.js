import mongoose from "mongoose";
import bcrypt from "bcrypt";
const { Schema, model } = mongoose;

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: [true, "Such email already exists"],
  },
  password: { type: String, required: true },
  avatar: {
    type: String,
    default:
      "https://www.pngfind.com/pngs/m/676-6764065_default-profile-picture-transparent-hd-png-download.png",
  },
  refreshToken: { type: String },
});

userSchema.pre("save", async function (next) {
  const user = this;
  const plainpassword = user.password;
  console.log("coming from schema", plainpassword);
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(plainpassword, 10);
    console.log(user.password);
  }
  next();
});

userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();
  delete userObject.password;
  delete userObject.createdAt;
  delete userObject.updatedAt;
  delete userObject.__v;
  delete userObject.refreshToken;

  return userObject;
};

userSchema.statics.checkCredentials = async function (email, plainpassword) {
  const user = await this.findOne({ email });

  if (user) {
    console.log("user find:", user);

    const isMatch = await bcrypt.compare(plainpassword, user.password);

    if (isMatch) return user;
    else return null;
  } else return null;
};

export default model("User", userSchema);
