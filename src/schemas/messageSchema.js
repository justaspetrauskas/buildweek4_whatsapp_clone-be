import mongoose from "mongoose";

const { Schema, model } = mongoose;

const messageSchema = new Schema(
  {
    sender: {
      type: String,
      required: true,
    },
    content: {
      text: { type: String, required: false },
      media: { type: String, required: false },
    },
  },
  {
    timestamp: true,
  }
);

export default model("Message", messageSchema);
