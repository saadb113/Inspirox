const mongoose = require('mongoose');


const messageSchema = new mongoose.Schema({
    sender : {type : mongoose.Schema.Types.ObjectId,
    ref : "user"},
    content : String ,
    chat : {type : mongoose.Schema.Types.ObjectId,
      ref : "Chat"},
   time: String
    // shares : Array
  });
  const Messsage = mongoose.model('Message', messageSchema);
  module.exports = Messsage