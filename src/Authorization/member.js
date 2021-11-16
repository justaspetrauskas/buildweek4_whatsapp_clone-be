import mongoose from "mongoose";
import ChatModel from "../schemas/chatSchema.js";

export const isChatMember = async (req, res, next) => {
  try {
    const chat = await ChatModel.findById(req.params.id);
    if (chat) {
      const isMember = chat.members.equals(req.user._id);
      console.log(isMember);
      return isMember;
    } else {
      res.status(404, "Chat not found");
    }
  } catch (err) {
    next(err);
  }
};
