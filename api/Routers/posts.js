const express = require("express")
const router = express.Router()
const multer = require('multer');
const Posts = require("../Schemas/post")
const path = require('path');
const expressAsyncHandler = require("express-async-handler")
const app = express()
const TimeFunc = require('./Time');
const Time = TimeFunc()
const fs = require("fs")
const Story = require("../Schemas/storyUpdate")
const authenticateToken = require("./Authentication");
const User = require("../Schemas/users");
const uploadDirectory = path.join(__dirname, '../uploads'); 
const {date, month, hours, minutes, ampm} = Time
const time = `${date} ${month} ${hours}:${minutes} ${ampm}`
const storage = multer.diskStorage({
    destination: './uploads/',
    filename: function (req, file, cb) {
      cb(null, `${file.originalname.split(".")[0]}-${Date.now()}${path.extname(file.originalname)}`);
    },
  });
  const upload = multer({
    storage,
    fileFilter: function (req, file, cb) {
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'text/plain',
        'image/png',
        'image/jpeg',
        'video/mp4',
      ];
  
      if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error('Invalid file type'));
      }
    },
  });
  
  router.post('/engage', async (req, res) => {

    const { PostId, engage, comment, user } = req.body;
    if(comment){
      comment.time = time
    }
    if (engage == "starAdd") { // For liking post
       await Posts.findOneAndUpdate(
        {_id :  PostId },
        { $push: { likes: user } }
      );
    } else if (engage == "starSubt") { //For disliking post
      
        await Posts.findOneAndUpdate(
          { _id : PostId },
          { $pull: { likes: user } }
        );
      
    } else if (engage == "comment") { // For comment

      const newComment = await Posts.findOneAndUpdate(
        { _id: PostId },
        { $push: { comments: { $each: [comment], $position: 0 } } },
        { new: true }
      );
      
      // res.send(newComment.filter(x=>x.comments._id == PostId))
      
     
    }
  });


  router.get("/post:userID", async (req, res) => {
  
    const contact = await Posts.find({ user: req.params.userID }).sort({ _id: -1 }).populate("user", "username name _id dp").populate("likes", "username name _id dp")
    res.send(contact)
  })

const publishPost = expressAsyncHandler(async(req,res)=>{
  let { caption, audience } = req.body
  if(audience.length !=0){
    audience = audience.split(",") 
  }else{
    audience = []
  }
  const ImagesArr = []


  req.files.map((file) => {
      ImagesArr.push(file.filename)
  });
  const Post = await Posts.create({
    time,
    audience,
    caption,
    media: ImagesArr,
    likes : [],
    comments : [],
    user : req.user._id

  })
  const data = await Post.populate("user", "username name _id dp")
 res.status(200).json(data)
})
  router.post("/publishPost",authenticateToken, upload.array('images', 10), publishPost)


  router.post("/storyupdate", upload.single('story'), async(req,res)=>{
    const { PostId, UserId, images } = req.body
    let ImagesArr = ""
    ImagesArr = req.file.filename
    const data =  new Story({
      PostId, UserId, img : ImagesArr
    })
    const save = await data.save()

  })

  router.get("/storyupdate:userid", async (req, res) => {
    const contact = await Posts.find({ UserId: req.params.userid }).populate("user", "username name _id dp")
    res.send(contact)
  })
  router.get("/allposts", async (req, res) => {
    const posts = await Posts.find().sort({ _id: -1 }).populate("user", "username name _id dp").populate("likes", "username name _id dp")
    res.send(posts)
    // console.log(posts)
  })
  const deleteFile = (filename)=>{
    const filePathToDelete = path.join(uploadDirectory, filename);
    if (fs.existsSync(filePathToDelete)) {
      // If the file exists, delete it
      fs.unlinkSync(filePathToDelete);
      console.log(`File ${filename} has been deleted.`);
    } else {
      console.log(filename)
    }
  }

  router.delete("/deletePost:id", async(req,res)=>{
    const getPost = await Posts.findByIdAndDelete(req.params.id)
    getPost.media.forEach(element => {
      deleteFile(element)
    });
    const deletePost = await Posts.findByIdAndDelete(req.params.id)
    res.status(200).send(deletePost)
  })
  router.put("/editPost:id", async(req,res)=>{
    const {editCaption} = req.body
    const editPost = await Posts.findByIdAndUpdate(req.params.id, {
      caption : editCaption
    }, {new : true})
    res.status(200).send(editPost)
  })
  router.post("/sharePost:id",authenticateToken, async(req,res)=>{

    const user = req.user._id
    try {
      
      const post = await Posts.findById(req.params.id)
      
      const create = await Posts.create({
        time,
        caption : post.caption,
        media : post.media,
        likes : [],
        comments : [],
        user : req.user._id,
        shares : []
      })
      
      const update = await Posts.findByIdAndUpdate(req.params.id, {
        $push : {shares : req.user._id}
      })
      // console.log(post)
      res.status(200).send("success")  
    } catch (error) {
    res.status(400).send("error")  
    }
  })


  router.get("/searchPosts", async(req,res)=>{
    console.log("first")
const posts = await Posts.find({
  caption : {$regex : req.query.search, $options : "i"}
}).populate("user", "username name _id dp").populate("likes", "username name _id dp")
res.json(posts)


  })
  module.exports = router