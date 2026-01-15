const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  room: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
}, { timestamps: true });

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;