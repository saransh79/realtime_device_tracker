import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import geolib from "geolib";

const app = express();

app.use(cors());
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));
app.set("view engine", "ejs");

let users = [];

// Handle socket connection
io.on('connection', (socket) => {
  console.log('New client connected');

  // When a user sends their location
  socket.on('sendLocation', (location) => {
    const user = { id: socket.id, ...location };
    users = users.filter(u => u.id !== socket.id);
    users.push(user);

    // Filter users within 10km range
    const nearbyUsers = users.filter(u => {
      return geolib.isPointWithinRadius(
        { latitude: u.latitude, longitude: u.longitude },
        { latitude: location.latitude, longitude: location.longitude },
        10000 // 10km radius
      );
    });

    // Emit the nearby users' locations
    io.emit('locationUpdate', nearbyUsers);
  });

  // When a user disconnects
  socket.on('disconnect', () => {
    console.log('Client disconnected');
    users = users.filter(u => u.id !== socket.id);
  });
});

app.get("/", (req, res) => {
  res.render("index");
});

export default server;
