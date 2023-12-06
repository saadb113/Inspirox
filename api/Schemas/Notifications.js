const mongoose = require('mongoose');


const NotifSchema = new mongoose.Schema({
    time : String,
    notification : {type : mongoose.Schema.Types.ObjectId,
      ref : "user"} ,
    user : {type : mongoose.Schema.Types.ObjectId,
      ref : "user"},
      noOfSeen : Number,
   type: String,
   seen : Boolean
    // shares : Array
  });
  const Notifications = mongoose.model('Notifications', NotifSchema);
  module.exports = Notifications