import express from "express";
import ChatModel from "../../schemas/chatSchema.js";
import { isChatMember } from "../../Authorization/member.js";
import { JWTAuthMiddleware } from "../../Authorization/token.js";

const chatRouter = express.Router();

chatRouter.get("/", JWTAuthMiddleware, async (req, res, next) => {
  try {
    //   Returns all chats in which you are a member
    console.log(req.user._id);
    const chats = await ChatModel.find({
      members: { $in: req.user._id },
    });

    res.send(chats);
  } catch (error) {
    next(error);
  }
});

chatRouter.post("/", JWTAuthMiddleware, async (req, res, next) => {
  try {
    // check if the request sender had and active chat with this user (look for the history)
    const { members } = req.body;

    // new chat
    const newChat = new ChatModel({
      members: [...members, req.user._id],
    }).save();

    // add members to the newly created chat room
    for (socket of req.io.sockets.sockets) {
      const [socketId, socketObject] = Object.values(socket);
      if (members.includes(socketObject.user._id)) {
        socketObject.join(newChat._id.toString());
      }
    }
    res.send(newChat);
  } catch (error) {
    next(error);
  }
});

chatRouter.get("/:chatID", isChatMember, async (req, res, next) => {
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
