const ChatRoom = require("../../models/chatRoom.model");
const Message = require("../../models/message.model");

async function createChatRoom(req, res) {
    try {
        const { roomName } = req.body;
        const isRoomExist = await ChatRoom.findOne({ roomName });
        if (isRoomExist) {
            res.status(409).json({ message: 'Chat room already exists' });
        } else {
            const chatRoom = new ChatRoom(req.body);
            const savedChatRoom = await chatRoom.save();
            res.status(201).json(savedChatRoom.roomName);
        }
    } catch (err) {
        res.status(500).json({message: 'Chat room creation failed'});
    }
}

async function joinChatRoom(req, res) {
    try {
        const chatRooms = await ChatRoom.find({}, 'roomName');
        const roomNames = chatRooms.map((chatRoom) => chatRoom.roomName);
        res.status(200).json(roomNames);
    } catch(err) {
        res.status(500).json({message: 'couldn\'t join chat room'});
    }
}

async function getRoomMessages(req, res) {
    try {
        const { room } = req.params;
        const messages = await Message.find({ room }).sort({ createdAt: 1 }).limit(50); // Last 50 messages
        res.status(200).json(messages);
    } catch(err) {
        res.status(500).json({message: 'Couldn\'t fetch messages'});
    }
}

module.exports = {
    createChatRoom,
    joinChatRoom,
    getRoomMessages,
}