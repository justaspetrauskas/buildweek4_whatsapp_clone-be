import mongoose from "mongoose";

const { Schema, model } = mongoose;
const chatSchema = new Schema(
  {
    members: [{ type: Schema.Types.ObjectId, ref: "User" }],
    history: [{ type: Schema.Types.ObjectId, ref: "Message" }],
  },
  { timestamp: false }
);

export default model("Chat", chatSchema);
