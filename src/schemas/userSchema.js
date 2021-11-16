import mongoose from "mongoose";

const { Schema, model } = mongoose;

const userschema = new Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  avatar: {
    type: String,
    default:
      "https://www.pngfind.com/pngs/m/676-6764065_default-profile-picture-transparent-hd-png-download.png",
  },
});

export default model("users", userschema);
