const mongoose = require('mongoose');


const SettingsSchema = new mongoose.Schema({
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "user"
    },
    blockedbyMe : [{
            type : mongoose.Schema.Types.ObjectId,
            ref : "user"
        }] ,
    blockedbyOthers : [{
            type : mongoose.Schema.Types.ObjectId,
            ref : "user"
        }] ,
    postPrivacy : [{
            type : mongoose.Schema.Types.ObjectId,
            ref : "user"
        }] , 
    });
  const Settings = mongoose.model('Settings', SettingsSchema);
  module.exports = Settings