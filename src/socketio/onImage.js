import Message from "../schemas/messageSchema.js";
import Chat from "../schemas/chatSchema.js";

const onImage = async (io, socket, payload) => {
  const { chatId, media } = payload;
  //to all clients that are connected to the room
  io.in(chatId).emit("image", {
    media: media.toString("base64"),
    sender: socket.user,
  });
  // new message is created
  const newMessage = await new Message({
    chatId,
    media,
    sender: socket.user._id,
  }).save();

  //   store the message in history of the chat
  const chat = await Chat.findById(chatId);
  chat.history.push(newMessage);
  await chat.save();
};

export default onImage;
