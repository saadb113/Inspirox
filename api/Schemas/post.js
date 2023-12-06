const mongoose = require('mongoose');


const PostSchema = new mongoose.Schema({
    time : String, 
    audience : [
      {
        type : mongoose.Schema.Types.ObjectId,
      ref : "user"
      }
    ],
    caption: String,
    media: Array,
    likes: [
      {
        type : mongoose.Schema.Types.ObjectId,
      ref : "user"
      }
    ],
    comments: Array,
    user : {
      type : mongoose.Schema.Types.ObjectId,
      ref : "user"
    },
    shares : [{
      type : mongoose.Schema.Types.ObjectId,
      ref : "user"}
      ]
    // shares : Array
  });
  const Posts = mongoose.model('Post', PostSchema);
  module.exports = Posts