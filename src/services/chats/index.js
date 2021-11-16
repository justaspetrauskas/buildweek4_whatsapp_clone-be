import express from "express";
import ChatModel from "../../schemas/chatSchema.js";

const chatRouter = express.Router();

chatRouter.get("/", async (req, res, next) => {
  try {
    //   Returns all chats in which you are a member
    const chats = await ChatModel.find({ user: req.user }).populate({
      path: "history",
      select: "content",
    });

    res.send(chats);
  } catch (error) {
    next(error);
  }
});

chatRouter.post("/", async (req, res, next) => {
  try {
    // check if the request sender had and active chat with this user (look for the history)
    const chatExists = await ChatModel.findOne({ members: req.body.userId });

    // if not: create a new chat among the request sender and the members listed in the request body
    const newChat = new ChatModel({
      members: [req.body.receiverId],
    });
  } catch (error) {
    next(error);
  }
});

chatRouter.get("/:chatID", async (req, res, next) => {
  try {
    // must be a chat member
    const chat = await ChatModel.findOne({ history: req.params.chatID });
  } catch (error) {
    next(error);
  }
});

chatRouter.post("/:chatID/image", async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
});

export default chatRouter;
