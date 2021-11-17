import Chat from "../schemas/chatSchema.js";
import mongoose from "mongoose";
import onMessage from "./onMessage.js";
const onSocketConnected = async (io, socket) => {
  // load only chats that user is a participant
  const chatsThatUserIsParticipant = await Chat.find({
    members: new mongoose.Types.ObjectId(socket.user._id),
  });
  chatsThatUserIsParticipant.forEach((chat) => {
    socket.join(chat._id.toString());
  });
  //   to receive a message
  socket.on("message", (payload) => onMessage(io, socket, payload));
};

export default onSocketConnected;
