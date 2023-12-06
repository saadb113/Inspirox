const express = require("express")
const router = express.Router()
const User = require("../Schemas/users")
const authenticateToken = require("./Authentication")
const expressAsyncHandler = require("express-async-handler")
const Chat = require("../Schemas/chats")
const message = require("../Schemas/messages")
// const Chat = require("../Schemas/chats")
const searchUserFunc = expressAsyncHandler(async (req,res)=>{
 
const keyword = req.query.search ? {
    $or : [
        {username : {$regex : req.query.search, $options : "i"}},
        {email : {$regex : req.query.search, $options : "i"}} 
    ] 
} : {}
// console.log(req.user)
const users = await User.find(keyword).find({username : {$ne : req.user.username}, status : "active"})
res.json(users)
})

const accessChat = expressAsyncHandler(async (req, res) => {

    const { userId } = req.body;
  
    if (!userId) {
      console.log("UserId param not sent with request");
      return res.sendStatus(400);
    }
  
    var isChat = await Chat.find({
      isGroupChat: false,
      $and: [
        { users: { $elemMatch: { $eq: req.user._id } } },
        { users: { $elemMatch: { $eq: userId } } },
      ],
    })
      .populate("users", "-password")
      .populate("latestMessage");
      isChat = await User.populate(isChat, {
          path: "latestMessage.sender",
          select: "name username dp",
        });
        // console.log(isChat)
//   console.log(isChat)
    if (isChat.length > 0) {
      res.send(isChat[0]);
    } else {
      var chatData = {
        chatName: "sender",
        isGroupChat: false,
        users: [req.user._id, userId],
        latestMessage : null
      };
  
      try {
        const createdChat = await Chat.create(chatData);
        const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
          "users",
          "-password"
        );
        res.status(200).json(FullChat);
      } catch (error) {
        res.status(400);
        throw new Error(error.message);
      }
    }
  });

  
  const fetchChats = expressAsyncHandler(async (req, res) => {
    try {
      Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
        .populate("users", "-password")
        .populate("latestMessage")
        .sort({ updatedAt: -1 })
        .then(async (results) => {
          results = await User.populate(results, {
            path: "latestMessage.sender",
            select: "name pic email",
          });
          res.status(200).send(results);
        });
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  });

  const createGroupChat = expressAsyncHandler(async (req, res) => {
    if (!req.body.users || !req.body.name) {
      return res.status(400).send({ message: "Please Fill all the feilds" });
    }
    
    var users = req.body.users;
    
    if (users.length < 2) {
      return res
      .status(400)
      .send("More than 2 users are required to form a group chat");
    }
    
    users.push(req.user._id);
    // console.log(users)
  
    try {
      const groupChat = await Chat.create({
        chatName: req.body.name,
        users: users,
        isGroupChat: true,
        groupAdmin: req.user._id,
      });
      const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate("users", "-password")
        .populate("groupAdmin", "-password");
  
      res.status(200).json(fullGroupChat);
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  });

  const renameGroup = expressAsyncHandler(async(req,res)=>{
    const {id, chatName}= req.body
    const chatrename = await Chat.findByIdAndUpdate(id, {chatName}, {new : true})
    .populate("users", "-password")
    .populate("groupAdmin", "-password")

    if(!chatrename){
      res.status(404).send({message : "Group not found"})
    }else{
      res.json(chatrename)
    }
  })

  const addGroup = expressAsyncHandler(async(req,res)=>{
    const {id, userId} = req.body

    const add = await Chat.find(id, {
      $push : {users : userId}
    }, {new : true})
    
    if(!add){
      res.status(404).send({message : "Not Found"})
    }else{
      res.json(add)
    }
  })
  const removeGroup = expressAsyncHandler(async(req,res)=>{
    const {id, userId} = req.body

    const add = await Chat.find(id, {
      $pull : {users : userId}
    }, {new : true})
    
    if(!add){
      res.status(404).send({message : "Not Found"})
    }else{
      res.json(add)
    }
  })

  const createMessage = ()=>{
    const {content, users} = req.body
  }

router.get("/search-user",authenticateToken,searchUserFunc)
router.post("/",authenticateToken, accessChat)
router.get("/",authenticateToken, fetchChats)
router.post("/group",authenticateToken, createGroupChat)
router.put("/grouprename", renameGroup)
router.put("/groupadd", addGroup)
router.put("/groupremove", removeGroup)
router.post("/createmessage", createMessage)


const sendMessage = expressAsyncHandler(async(req,res)=>{
const {content, chat} = req.body
const sender = req.user._id

const now = new Date();
let hours = now.getHours();
const minutes = now.getMinutes();
const ampm = hours >= 12 ? 'PM' : 'AM';

hours = hours % 12;
hours = hours ? hours : 12;

const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
const currentTime = `${hours}:${formattedMinutes} ${ampm}`;

const createmsg = await message.create({
  sender,content, chat, time : currentTime
})

const data = await message.findOne({_id : createmsg._id}).populate("sender", "-password").populate("chat")
const UpdatelatestMessage = await Chat.findOneAndUpdate({_id: chat},{latestMessage : data._id},{new : true}).populate("latestMessage")

res.json(data) 

})


const getMessages = expressAsyncHandler(async(req,res)=>{
  const {id} = req.query
  const chat = await message.find({chat : id}).populate("sender", "-password")
  res.json(chat.reverse())
})
router.post('/sendMessage', authenticateToken, sendMessage)
router.get('/getMessages', authenticateToken, getMessages)

module.exports  = router

