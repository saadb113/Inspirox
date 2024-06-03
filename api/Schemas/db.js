const mongoose = require('mongoose');
require('dotenv').config();

const ConnecitontoDatabase = ()=>{

  mongoose.connect(`mongodb+srv://saadb451:${process.env.DBPASSWORD}!@cluster0.vbcrt.mongodb.net/?retryWrites=true&w=majority`).then(() => {
    console.log("connected")
  }).catch((error) => {
    console.log(error)
  })
}
module.exports = ConnecitontoDatabase