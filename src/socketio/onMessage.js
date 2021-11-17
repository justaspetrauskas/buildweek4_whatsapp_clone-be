import Message from "../schemas/messageSchema.js";
import Chat from "../schemas/chatSchema.js";

const onMessage = async (io, socket, payload) => {
  const { chatId, text } = payload;
  //to all clients that are connected to the room
  io.in(chatId).emit("onmessage", { text, sender: socket.user });
  console.log(socket.rooms);
  console.log("chat id ", chatId);
  // new message is created
  const newMessage = await new Message({
    chatId,
    text,
    sender: socket.user._id,
  }).save();
  console.log("message ", newMessage);

  //   store the message in history of the chat
  const chat = await Chat.findById(chatId);
  chat.history.push(newMessage);
  await chat.save();
  console.log(chat);
};

export default onMessage;
