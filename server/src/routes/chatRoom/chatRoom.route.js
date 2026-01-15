const express = require('express');
const { createChatRoom, joinChatRoom, getRoomMessages } = require('./chatRoom.controller');

const chatRoomRouter = express.Router();

chatRoomRouter.post('/chatrooms', createChatRoom);
chatRoomRouter.get('/chatrooms', joinChatRoom);
chatRoomRouter.get('/chatrooms/:room/messages', getRoomMessages);

module.exports = chatRoomRouter;