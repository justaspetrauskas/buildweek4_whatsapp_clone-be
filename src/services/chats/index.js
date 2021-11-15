import express from "express";
import ChatModel from "../../schemas/chatSchema.js";

const chatRouter = express.Router();

chatRouter.get("/", async (req, res, next) => {
  try {
    //   Returns all chats in which you are a member
    const chats = await ChatModel.find().populate({
      path: "history",
      select: "content",
    });

    res.send(accomodations);
  } catch (error) {
    next(error);
  }
});

chatRouter.post("/", async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
});

chatRouter.get("/:chatID", async (req, res, next) => {
  try {
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
