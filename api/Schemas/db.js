const mongoose = require('mongoose');
const ConnecitontoDatabase = ()=>{

  mongoose.connect("mongodb://127.0.0.1:27017/Allies").then(() => {
    console.log("connected")
  }).catch((error) => {
    console.log(error)
  })
}
module.exports = ConnecitontoDatabase