import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import listEndpoints from "express-list-endpoints";
import { createServer } from "http";
import { Server } from "socket.io";
import UserRouter from "./services/users/index.js";
import ChatRouter from "./services/chats/index.js";

// for socketIO
import { verifyJWT } from "./Authorization/tools.js";
import UserModel from "./schemas/userSchema.js";
import ChatModel from "./schemas/chatSchema.js";

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

//=======================================Socket IO=====================================================

// compatibility option
export const io = new Server(httpServer, { allowEIO3: true });

const isValidJwt = async (header) => {
  const decodedToken = await verifyJWT(header);
  const user = await UserModel.findById(decodedToken._id);
  return user;
};

io.use(async (socket, next) => {
  const token = socket.handshake.headers["authorization"];
  const user = await isValidJwt(token);
  if (user) {
    return next();
  } else {
    return next(new Error("authentication error"));
  }
});
io.on("connection", (socket) => {
  console.log(socket.id);
  socket.on("sendmessage", async ({ message, room }) => {
    // console.log(room)

    // we need to save the message to the Database

    // try {

    //     throw new Error("Something went wrong")

    await ChatModel.findOneAndUpdate(
      { room },
      {
        $push: { history: message },
      }
    );

    // socket.broadcast.emit("message", message)
    socket.to(room).emit("message", message);

    // } catch (error) {
    //     socket.emit("message-error", { error: error.message })
    // }
  });
});

// SERVER

if (!process.env.MONGODB) {
  throw new Error("No MongoDB url defined");
}

mongoose.connect(process.env.MONGODB).then(() => {
  console.log("connected to mongo");
  httpServer.listen(PORT);
  console.table(listEndpoints(server));
});

server.on("error", (error) => {
  console.log("Server is stopped ", error);
});
