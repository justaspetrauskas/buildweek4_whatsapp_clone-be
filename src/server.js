
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import listEndpoints from "express-list-endpoints"
import {notFoundHandler, badRequestHandler, genericErrorHandler} from "./errorhandlers.js"
import userRouter from "./services/users/index.js"

const server = express()
const port = process.env.PORT || 3001


server.use(express.json())
server.use(cors())

server.use("/users", userRouter)


server.use(notFoundHandler)
server.use(badRequestHandler)
server.use(genericErrorHandler)

mongoose.connect(process.env.MONGO_CONNECTION)

mongoose.connection.on("connected", () => {
    console.log("successful!! to Mongo")
    server.listen(port, () => {
        console.table(listEndpoints(server))
        console.log(`server running on port ${port}`)
    })
})

mongoose.connection.on("error", err => {
    console.log(err)
  })