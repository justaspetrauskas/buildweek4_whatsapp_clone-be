import mongoose from "mongoose";

const { Schema, model } = mongoose;

const messageSchema = new Schema(
  {
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    text: { type: String, required: false },
    media: { type: String, required: false },
    chatId: { type: Schema.Types.ObjectId, ref: "Chat" },
  },
  {
    timestamps: true,
  }
);

export default model("Message", messageSchema);
