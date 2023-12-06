const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
  status : {
    type : String,
    default : "active"
  },
  name : String,  
  dp : String,
  username: String,
  email : String,
  password: String,
  followers : [{
    type : mongoose.Schema.Types.ObjectId,
    ref : "user"
  }],
  following : [{
    type : mongoose.Schema.Types.ObjectId,
    ref : "user"
  }],
  phone : String,
  city : String,
  country : String,
  gender : String,
  rlp : String,
  bio : String

  });
const User = mongoose.model('user', userSchema);
module.exports = User