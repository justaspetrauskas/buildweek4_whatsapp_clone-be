import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import listEndpoints from "express-list-endpoints";
import { createServer } from "http";
import { Server } from "socket.io";


// import express from "express";
// import mongoose from "mongoose";
// import cors from "cors";
// import listEndpoints from "express-list-endpoints"
import {notFoundHandler, badRequestHandler, genericErrorHandler} from "./errorhandlers.js"
import userRouter from "./services/users/index.js"

// const server = express()
// const port = process.env.PORT || 3001


// server.use(express.json())
// server.use(cors())

// server.use("/users", userRouter)


// server.use(notFoundHandler)
// server.use(badRequestHandler)
// server.use(genericErrorHandler)

// mongoose.connect(process.env.MONGO_CONNECTION)

// mongoose.connection.on("connected", () => {
//     console.log("successful!! to Mongo")
//     server.listen(port, () => {
//         console.table(listEndpoints(server))
//         console.log(`server running on port ${port}`)
//     })
// })

// mongoose.connection.on("error", err => {
//     console.log(err)
//   })

import ChatRouter from "./services/chats/index.js";

const server = express();

const { PORT = 3009 } = process.env;

// MIDDLEWARE

server.use(cors());
server.use(express.json());

// SERVICES
server.use("/chats", ChatRouter);

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

