import Chat from "../schemas/chatSchema.js";
import mongoose from "mongoose";
import onMessage from "./onMessage.js";
import User from "../schemas/userSchema.js";
// import onImage from "./onImage.js";

const onlineUser = {};

const onSocketConnected = async (io, socket) => {
  // add to online users
  // onlineUser[socket.id] = socket.user._id;
  // console.log("user online", socket);

  // load chats that user is a participant
  const chatsThatUserIsParticipant = await Chat.find({
    members: new mongoose.Types.ObjectId(socket.user._id),
  });
  chatsThatUserIsParticipant.forEach((chat) => {
    socket.join(chat._id.toString());
  });
  console.log(chatsThatUserIsParticipant);
  // receive chats that user is a participant
  socket.emit("lastChat", chatsThatUserIsParticipant[0]);

  //   to receive a message
  socket.on("message", (payload) => onMessage(io, socket, payload));
  //   socket.on("image", (payload) => onImage(io, socket, payload));

  socket.on("typing", (data) => {
    if (data.typing == true) io.emit("display", data);
    else io.emit("display", data);
  });

  socket.on("disconnect", async () => {
    console.log("disconnected socket " + socket.id);
    // remove from online users
    delete onlineUser[socket.id];
  });
};

export default onSocketConnected;
