import express from "express";
import ChatModel from "../../schemas/chatSchema.js";
import { JWTAuthMiddleware } from "../../Authorization/token.js";
import mongoose from "mongoose";
import { imageUpload } from "../../Tools/multerTools.js";

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

chatRouter.get("/:chatID", JWTAuthMiddleware, async (req, res, next) => {
  try {
    // must be a chat member
    const { chatID } = req.params;
    const chat = await ChatModel.findById(chatID);
    // if found check if the user is a member
    if (chat) {
      const isMember = chat.members.indexOf(
        mongoose.Types.ObjectId(req.user._id)
      );

      if (isMember > -1) {
        res.send(chat);
      } else {
        res.send("user is not in this chat");
      }
    } else {
      res.send("chat is not found");
    }
  } catch (error) {
    next(error);
  }
});

chatRouter.post(
  "/:chatID/image",
  JWTAuthMiddleware,
  imageUpload.single("chatImage"),
  async (req, res, next) => {
    try {
      const imagePath = req.file.path;
      const { chatID } = req.params;
      const chat = await ChatModel.findById(chatID);
      if (chat) {
        console.log(chat);
        const isMember = chat.members.indexOf(
          mongoose.Types.ObjectId(req.user._id)
        );
        if (isMember > -1) {
          chat.chatImage = imagePath;
          await chat.save();
          res.send(chat);
        } else {
          res.send("user is not in this chat");
        }
      } else {
        res.send("chat is not found");
      }
    } catch (error) {
      next(error);
    }
  }
);

export default chatRouter;
