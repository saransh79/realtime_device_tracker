import express from "express";
import http from "http";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);
const io= new Server(server);

app.use(express.static('public'));
app.set("view engine", "ejs");

io.on('connection', (socket)=>{
    console.log('IO connnected');
})

app.get('/', (req, res)=>{
    res.render('index');
})

export default server;