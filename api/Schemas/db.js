const mongoose = require('mongoose');
const ConnecitontoDatabase = ()=>{

  mongoose.connect("mongodb+srv://saadb451:Saadbhaizindabaad1!@cluster0.vbcrt.mongodb.net/?retryWrites=true&w=majority").then(() => {
    console.log("connected")
  }).catch((error) => {
    console.log(error)
  })
}
module.exports = ConnecitontoDatabase