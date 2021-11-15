import express from "express";
import cors from "cors";
import mongoose from "mongoose";

import listEndpoints from "express-list-endpoints";

const server = express();

const { PORT = 3009 } = process.env;

// MIDDLEWARE

server.use(cors());
server.use(express.json());

// SERVICES

server.listen(PORT, () => {
  // connect to mongoose Server

  mongoose.connect(process.env.MONGODB, {});

  console.log(`Server is listening on port ${PORT}`);
  console.table(listEndpoints(server));
});

server.on("error", (error) => {
  console.log("Server is stopped ", error);
});
