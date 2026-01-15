require('dotenv').config();
const mongoose = require('mongoose');
const ChatRoom = require('./src/models/chatRoom.model');

async function clearRooms() {
  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const rooms = await ChatRoom.find({}, 'roomName');
  console.log('Existing chat rooms:', rooms.map(r => r.roomName));
  const count = rooms.length;
  console.log(`Found ${count} chat rooms`);

  if (count > 0) {
    await ChatRoom.deleteMany({});
    console.log('All chat rooms deleted');
  } else {
    console.log('No chat rooms to delete');
  }

  await mongoose.disconnect();
}

clearRooms().catch(console.error);