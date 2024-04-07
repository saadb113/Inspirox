const express = require("express")
const router = express.Router()
const User = require('../Schemas/users')
const Settings = require('../Schemas/Settings')
const Notifications = require('../Schemas/Notifications')
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require("path")
const expressAsyncHandler = require("express-async-handler")
const fs = require('fs');
const TimeFunc = require('./Time');
const Time = TimeFunc()
const { runInNewContext } = require("vm");
const authenticateToken = require("./Authentication");
const secretKey = 'saadbhaizindabaad1';
const uploadDirectory = path.join(__dirname, '../uploads'); 
var bcrypt = require('bcryptjs');
const Posts = require("../Schemas/post")
var salt = bcrypt.genSaltSync(10);
const {date, month, hours, minutes, ampm} = Time
const time = `${date} ${month} ${hours}:${minutes} ${ampm}`
const storage = multer.diskStorage({
  destination: 'uploads',
  filename: function (req, file, cb) {
    cb(null, `${file.originalname.split(".")[0]}-${Date.now()}${path.extname(file.originalname)}`);
  },
});
console.log(storage)
const upload = multer({
  storage
});
router.post("/register", async (req, res) => {
    const { name, username, email, password } = req.body
    const exstingUser = await User.find({ username })

    const hashedPassword = bcrypt.hashSync(password, salt);
    if (exstingUser.length == 0) {
  
      const data = new User({
        name, password : hashedPassword, username, email, followers : [],following : [],
        phone : "",
        dp : "defaultUser.jpg",
        city : "",
        country : "",
        gender : "",
        rlp : "",
        bio : ""
      })
      const settings = await Settings.create({
        user : data._id,
        blockedbyMe : [],
        blockedbyOthers : [],
        postPrivacy : []
      })
      const save = await data.save()
      res.status(200).send(save) 
    } else {
      res.status(401).send("error")
      console.log("User Already Exists")
    }
  })

  function generateToken(user) {
    const payload = {
      _id : user._id,
      username: user.username
    };
  
    return jwt.sign(payload, secretKey, { expiresIn: '30d' }); 
  }
  router.post("/login", async (req, res) => {
    const { username, password } = req.body;
    const data = await User.findOne({ username });
    let comparedPassword;
    if(data){
    comparedPassword = bcrypt.compareSync(password, data.password);
    }
    if (!data || data.status != "active") {
      res.status(404).send({ msg: "User not found" });
    }else if (!comparedPassword) {
      res.status(401).send({ msg: "Wrong Creadentials" });
    }else{
      

      
      const token = generateToken(data);
      res.status(200).json({ msg: "User Authenticated", status: 200, token });
      console.log(token);
    }
  });



router.get("/allusers", async (req,res)=>{
  const users = await User.find({status : "active"})
  res.json(users)
})
router.get("/user/:userId", expressAsyncHandler(async (req,res)=>{
  const users = await User.findOne({_id : req.params.userId})
  res.json(users)
  // console.log(users)
}))
router.get("/user/multipleUsers", async (req,res)=>{
  try {
    const users = await User.find({ username: { $in: usernames } });

    if (users.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }

    res.json(users);
    console.log(users)
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
})
router.get("/allusers", async (req,res)=>{
  try {
    const users = await User.find();
    res.json(users);
    console.log(users)
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
})

router.post("/addfollow", async (req,res)=>{
  const {otheruser, myuser, value} = req.body

  const follower = await User.findOneAndUpdate(
    { _id : otheruser },
   value ?  { $push: { followers: myuser } } : { $pull: { followers: myuser } } 
  );
  const following = await User.findOneAndUpdate(
    { _id : myuser },
    value ?  { $push: { following: otheruser } } : { $pull: { following: otheruser } }
  );

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
router.post("/editprofile",authenticateToken, upload.single("profilePic"), async(req,res)=>{

  let {username, name, email, phone, city, country, gender, rlp, bio} = req.body
  try {
    const user = await User.findById(req.user._id)
  let dp;
  if(!req.file){
    dp = user.dp
  }else{
    dp = req.file.filename
    if(user.dp == "defaultUser.jpg"){
  
    }else{
      deleteFile(user.dp)
    }
  }
  const UserUpdate = await User.findOneAndUpdate({_id: req.user._id}, {
    name, email, phone, city, country, dp, gender, rlp, bio
  })
  res.status(200).send("Profile Updated Successfully")
  
} catch (error) {
  res.status(500).send(error)
  console.log(error)
}
  // deleteFile(user.dp)
  
  // console.log(UserUpdate)
})



router.post('/notification',authenticateToken,async(req,res)=>{

  const {type , notification} = req.body 
  const notif = await Notifications.create({
    time,
    notification,
    type,
    user : req.user._id,
    seen : false
  })

  res.send(notif)
  console.log(notif)
})
router.post('/postnotification',authenticateToken,async(req,res)=>{
  const user = req.user
  const AuthUser = await User.findById(user._id)
  AuthUser.followers.forEach(async (element) => {
  const notif = await Notifications.create({
      time,
      notification : user._id,
      type : "post",
      user : element,
      seen : false
    })
  });
  // console.log(notif)
  // res.send(notif)
  

  // res.send(notif)
})
router.get('/notifications/',authenticateToken, async(req,res)=>{

  const user = req.user 
  const notif = await Notifications.find({user : user._id}).sort({_id : -1}).populate("notification", "username name dp").populate("user","username name dp")
  res.send(notif)
  // console.log(notif)
})
router.post('/notificationseen',authenticateToken, async(req,res)=>{

  const user = req.user 
  const notif = await Notifications.updateMany({user : user._id, seen : false}, {seen : true})
  // notif.forEach(element => {
  //   await Notifications.findOneAndUpdate(element)
  // });(e)
  
  // console.log(notif)
})

router.post("/changePassword", authenticateToken, expressAsyncHandler(async(req,res)=>{
const  user = req.user
const {oldpassword, newpassword} = req.body
const myUser = await User.findById(user._id)

const comparedPassword = await bcrypt.compare(oldpassword, myUser.password)

console.log(comparedPassword)
if(comparedPassword){
  const hashedpassword = bcrypt.hashSync(newpassword, salt)
  const password = await User.findByIdAndUpdate(user._id, {password : hashedpassword}, {new : true})
  res.status(200).send({ msg: "Password Changes Successfully" });

}else{
  res.status(401).send({ msg: "Wrong Old Password" });

}
}))


router.put("/blockUser:id",  authenticateToken,async(req,res)=>{
  const user = req.user._id
  const blockedbyMe = await Settings.findOneAndUpdate({user},{
    $push : {blockedbyMe : req.params.id}
  }, {new : true})
  const blockedbyOthers = await Settings.findOneAndUpdate({user : req.params.id},{
    $push : {blockedbyOthers : user}
  }, {new : true})

})
router.put("/unblockUser:id",  authenticateToken,async(req,res)=>{
  const user = req.user._id
  const blockedbyMe = await Settings.findOneAndUpdate({user},{
    $pull : {blockedbyMe : req.params.id}
  }, {new : true})
  const blockedbyOthers = await Settings.findOneAndUpdate({user : req.params.id},{
    $pull : {blockedbyOthers : user}
  }, {new : true})
})
router.put("/getBlockedUsers",  authenticateToken,async(req,res)=>{
  const user = req.user._id
  const block = await Settings.findOne({user}).populate("blockedbyMe", "_id name dp").populate("blockedbyOthers", "_id name username dp").populate("postPrivacy", "_id name username dp")
  res.status(200).json(block)
})



router.delete("/deleteUser", authenticateToken, expressAsyncHandler(async(req,res)=>{
  const user = req.user._id
  const {password} = req.body
  
  const userdp = await User.findById(user)
  const verifPassword = bcrypt.compareSync(password, userdp.password)
  if(!verifPassword){
 res.status(401).send({ msg: "Wrong Creadentials" });
}

    
    const deleteUser = await User.findByIdAndUpdate(user, {
      status : "deleted"
    }, {new : true})
    const deleteNotifications = await Notifications.deleteMany({user})
    
    const getPosts = await Posts.find({user})
    getPosts.forEach(element => {
      element.media.forEach(img => {
      deleteFile(img)
    });
  });
  const deletePosts = await Posts.deleteMany({user})
  console.log(deleteUser)
  const deleteSettings = await Settings.findOneAndDelete({user})

}))

router.put("/privacy", authenticateToken,async(req,res)=>{
  const user = req.user._id
  const {value,users} = req.body
if(value){

  const privacy = await Settings.findOneAndUpdate({user}, {
$push : {postPrivacy : users}
  })
  console.log(privacy)
}else{
  const privacy = await Settings.findOneAndUpdate({user}, {
$pull : {postPrivacy : users}
  })
  console.log(privacy)

}

})

router.put("/privacyeveryne", authenticateToken,async(req,res)=>{
  const user = req.user._id
  const {users} = req.body
  users.forEach(async element => {
    
    const privacy = await Settings.findOneAndUpdate({user}, {
      $pull : {postPrivacy : element}
    })
  });
})
module.exports = router