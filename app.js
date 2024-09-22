import express from "express";
import http from "http";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));
app.set("view engine", "ejs");

io.on("connection", (socket) => {
  
  socket.on("send-location", (data) => {
    io.emit("recieve-location", { id: socket.id, ...data });
    console.log("user connnected");
  });
  socket.on("disconnect", () => {
    io.emit("user-disconnected", socket.id);
    console.log('user disconnected');
  });
});

app.get("/", (req, res) => {
  res.render("index");
});

export default server;
