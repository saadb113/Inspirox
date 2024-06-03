const mongoose = require('mongoose');
require('dotenv').config();

const ConnecitontoDatabase = ()=>{

  mongoose.connect(`mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@cluster0.vbcrt.mongodb.net/?retryWrites=true&w=majority`).then(() => {
    console.log("connected")
  }).catch((error) => {
    console.log(error)
  })
}
module.exports = ConnecitontoDatabase