const port = 8000;
const express = require('express');
const http = require('http'); // Import the HTTP module
const cors = require('cors');
const path = require('path');
const db = require('./Schemas/db');
const userRoute = require('./Routers/users');
const postRoute = require('./Routers/posts');
const homeRoute = require('./Routers/home');
const message = require("./Schemas/messages")
const app = express();
const messageRoute = require("./Routers/messages")
const server = http.createServer(app); // Create an HTTP server
const io = require('socket.io')(server, {cors: {origin: "*"}});

// const io = socketIo(server);

db();
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.json());
app.use(cors());
// app.use(express.static(path.join(__dirname, "../client/dist")))
// Routes for Login, Registration
app.use('/', userRoute);

// Routes for Uploading, Getting Posts
app.use('/', postRoute);
app.use('/message', messageRoute);

// Routes for User Authentication
app.use('/', homeRoute);
app.get("/", (req,res)=>{
  res.send("hello")
})
io.on('connection', (socket) => {
  socket.on("setup", (userData) => {
    socket.join(userData._id);
    console.log("user connected", userData._id)
  });
  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User Joined Room: " + room);
  });
  socket.on("send", (newMessageRecieved) => {
    var chat = newMessageRecieved.chat;

    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (user == newMessageRecieved.sender._id) return;
      // console.log(user)
      socket.in(user).emit("recieved", newMessageRecieved);
      // console.log(user)
    });
  });
  socket.on("typing",(room)=>socket.in(room).emit("typing"))
  socket.on("stopTyping",(room)=>socket.in(room).emit("stopTyping"))
  console.log('Connected to Socket.IO');
});


// app.get("/message/:from/:to", async (req,res)=>{

//   const {from, to} = req.params
//   console.log(from, to)
//   const msg = await message.find({from, to})
//   res.send(msg )
//   console.log(msg)
// })
const chatdata = [
  {
    chatname : "John",
    id : "1"
  },
  {
    chatname : "John23123",
    id : "2"

  },
  {
    chatname : "John234234",
    id : "3"

  },
  
]

app.get("/home", (req,res)=>{
res.send("Home")
})




app.get("/chats", (req,res)=>{
res.send(chatdata)
})
app.get("/chats/:id", (req,res)=>{
const {id} = req.params
const data = chatdata.find((e)=> e.id == id)
res.send(data)
})



server.listen(port, () => {
  console.log('Server running on port ' + port);
});
