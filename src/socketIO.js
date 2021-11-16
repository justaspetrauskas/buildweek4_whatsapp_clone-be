// import { io } from "./server.js";
// import { verifyJWT } from "./Authorization/tools";

//=======================================Socket IO=====================================================
// compatibility option
// io.use((socket, next) => {
//   if (socket.handshake.query && socket.handshake.query.token) {
//     const decodedToken = await verifyJWT(socket.handshake.query.token);
//   }
// });
// io.on("connection", (socket) => {
//   console.log(socket.request.user);
//   console.log(socket.handshake.query);
//   console.log(`User Connected: ${socket.id}`);
// });
