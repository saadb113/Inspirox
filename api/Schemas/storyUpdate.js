const mongoose = require('mongoose');


const StorySchema = new mongoose.Schema({
    UserId: Number,
    PostId: Number,
    img: Array,
    });
  const Story = mongoose.model('StoryUpdates', StorySchema);
  module.exports = Story