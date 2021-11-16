import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import listEndpoints from "express-list-endpoints";
import { createServer } from "http";
import { Server } from "socket.io";

import UserRouter from "./services/users/index.js";
import ChatRouter from "./services/chats/index.js";

const server = express();
const port = process.env.PORT || 3001;

server.use(express.json());
server.use(cors());

const { PORT = 3009 } = process.env;

// MIDDLEWARE

server.use(cors());
server.use(express.json());

// SERVICES
server.use("/chats", ChatRouter);
server.use("/users", UserRouter);

const httpServer = createServer(server);

const io = new Server(httpServer, { allowEIO3: true });

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on("send_message", async ({ message, members }) => {
    await ChatModel.findOneAndUpdate(
      { members },
      { $push: { chatHistory: message } }
    );

    socket.to(members).emit("receive_message", message);
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
});

// SERVER
server.listen(PORT, () => {
  // connect to mongoose Server

  mongoose.connect(process.env.MONGODB, {});

  console.log(`Server is listening on port ${PORT}`);
  console.table(listEndpoints(server));
});

server.on("error", (error) => {
  console.log("Server is stopped ", error);
});
