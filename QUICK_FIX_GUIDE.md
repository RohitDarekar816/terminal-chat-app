# Quick Fix Guide - Priority Issues

This guide provides copy-paste ready fixes for the most critical issues found in the code review.

---

## 🔴 CRITICAL FIX #1: Command Injection in Notifications

### File: `client/attachEvents.js`

**Replace lines 82-93 with:**

```javascript
const { execFile } = require('child_process');
const fs = require('fs');
const os = require('os');

// ... inside the 'chat message' event handler:

client.on('chat message', (message) => {
  displayMessage(message);
  
  // Desktop notification - SECURE VERSION
  if (os.platform() === 'linux') {
    execFile('notify-send', ['Terminal Chat', message], (error) => {
      if (error) console.error('Notification failed:', error.message);
    });
  }
  
  // Sound notification - SECURE VERSION
  const soundPath = path.join(__dirname, '../noti.wav');
  if (fs.existsSync(soundPath)) {
    const soundCommand = os.platform() === 'darwin' ? 'afplay' : 'aplay';
    if (os.platform() !== 'win32') {
      execFile(soundCommand, [soundPath], (error) => {
        if (error) console.error('Sound error:', error.message);
      });
    }
  }
});
```

---

## 🟠 HIGH FIX #1: Environment-Based Configuration

### Create: `client/config.js`

```javascript
module.exports = {
  API_BASE_URL: process.env.API_BASE_URL || 'http://localhost:3001',
  SOCKET_URL: process.env.SOCKET_URL || 'http://localhost:3001',
};
```

### Create: `client/.env.example`

```env
API_BASE_URL=http://localhost:3001
SOCKET_URL=http://localhost:3001
```

### Update: `client/commander.js`

```javascript
const config = require('./config');

// Replace line 31:
const client = io(config.SOCKET_URL, {
  auth: { token }
});
```

### Update: `client/attachEvents.js`

```javascript
const config = require('./config');

// Replace line 60:
const response = await axios.get(`${config.API_BASE_URL}/api/chatrooms/${room}/messages`);
```

### Update all other files similarly:
- `client/src/auth/getToken.js`
- `client/src/auth/loginUser.js`
- `client/src/auth/registerUser.js`
- `client/src/menu/createChatRoom.js`
- `client/src/menu/joinChatRoom.js`
- `client/src/views/chatMessageInterface.js`

---

## 🟠 HIGH FIX #2: Input Validation

### File: `server/src/routes/chatRoom/chatRoom.controller.js`

**Replace the createChatRoom function:**

```javascript
async function createChatRoom(req, res) {
    try {
        const { roomName } = req.body;
        
        // Input validation
        if (!roomName || typeof roomName !== 'string') {
            return res.status(400).json({ message: 'Invalid room name' });
        }
        
        const sanitizedRoomName = roomName.trim();
        
        if (sanitizedRoomName.length === 0 || sanitizedRoomName.length > 50) {
            return res.status(400).json({ 
                message: 'Room name must be between 1 and 50 characters' 
            });
        }
        
        // Check for invalid characters
        if (!/^[a-zA-Z0-9-_ ]+$/.test(sanitizedRoomName)) {
            return res.status(400).json({ 
                message: 'Room name contains invalid characters' 
            });
        }
        
        const isRoomExist = await ChatRoom.findOne({ roomName: sanitizedRoomName });
        
        if (isRoomExist) {
            return res.status(409).json({ message: 'Chat room already exists' });
        }
        
        const chatRoom = new ChatRoom({ roomName: sanitizedRoomName });
        const savedChatRoom = await chatRoom.save();
        res.status(201).json(savedChatRoom.roomName);
    } catch (err) {
        console.error('Chat room creation error:', err);
        res.status(500).json({ message: 'Chat room creation failed' });
    }
}
```

---

## 🟠 HIGH FIX #3: Socket Message Validation

### File: `server/socketManager.js`

**Replace the 'chat message' handler:**

```javascript
// Add at the top of the file
const MAX_MESSAGE_LENGTH = 1000;
const MAX_ROOM_NAME_LENGTH = 50;

// Replace the chat message handler:
socket.on('chat message', async (room, message) => {
    try {
        // Validate room
        if (!room || typeof room !== 'string') {
            socket.emit('error', 'Invalid room');
            return;
        }
        
        const sanitizedRoom = room.trim();
        if (sanitizedRoom.length === 0 || sanitizedRoom.length > MAX_ROOM_NAME_LENGTH) {
            socket.emit('error', 'Invalid room name length');
            return;
        }
        
        // Validate message
        if (!message || typeof message !== 'string') {
            socket.emit('error', 'Invalid message');
            return;
        }
        
        const sanitizedMessage = message.trim();
        if (sanitizedMessage.length === 0) {
            socket.emit('error', 'Message cannot be empty');
            return;
        }
        
        if (sanitizedMessage.length > MAX_MESSAGE_LENGTH) {
            socket.emit('error', `Message too long (max ${MAX_MESSAGE_LENGTH} characters)`);
            return;
        }
        
        // Save message to DB
        const newMessage = new Message({
            room: sanitizedRoom,
            username: socket.username,
            message: sanitizedMessage,
        });
        
        await newMessage.save();
        
        socket.broadcast.to(sanitizedRoom).emit(
            'chat message', 
            `${socket.username}: ${sanitizedMessage}`
        );
    } catch (error) {
        console.error('Message handling error:', error);
        socket.emit('error', 'Failed to send message');
    }
});
```

---

## 🟡 MEDIUM FIX: Rate Limiting

### File: `server/socketManager.js`

**Add rate limiting to socket messages:**

```javascript
// Add at the top of the file
const MESSAGE_RATE_LIMIT = 10; // messages per minute
const RATE_LIMIT_WINDOW = 60000; // 1 minute in ms

// Inside io.on('connection', (socket) => {
const messageRateLimiter = new Map();

socket.on('chat message', async (room, message) => {
    // Rate limiting check
    const userId = socket.username;
    const now = Date.now();
    const userLimit = messageRateLimiter.get(userId) || { 
        count: 0, 
        resetTime: now + RATE_LIMIT_WINDOW 
    };
    
    if (now > userLimit.resetTime) {
        userLimit.count = 0;
        userLimit.resetTime = now + RATE_LIMIT_WINDOW;
    }
    
    if (userLimit.count >= MESSAGE_RATE_LIMIT) {
        socket.emit('error', 'Rate limit exceeded. Please slow down.');
        return;
    }
    
    userLimit.count++;
    messageRateLimiter.set(userId, userLimit);
    
    // ... rest of validation and message handling
});
```

---

## 🟢 BONUS: Better Error Handling

### File: `client/attachEvents.js`

**Improve fetchHistory function:**

```javascript
async function fetchHistory(room) {
  try {
    const config = require('./config');
    const response = await axios.get(
      `${config.API_BASE_URL}/api/chatrooms/${room}/messages`,
      { timeout: 5000 } // 5 second timeout
    );
    
    const messages = response.data;
    
    if (!Array.isArray(messages)) {
      console.error('Invalid response format');
      return;
    }
    
    if (messages.length > 0) {
      console.info('--- Chat History ---');
      messages.forEach(msg => {
        if (msg.username && msg.message) {
          const formatted = `${msg.username}: ${msg.message}`;
          displayMessage(formatted, msg.createdAt);
        }
      });
      console.info('--- End History ---');
    } else {
      console.info('No previous messages in this room');
    }
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      console.error('Cannot connect to server');
    } else if (error.code === 'ETIMEDOUT') {
      console.error('Request timed out');
    } else {
      console.error('Failed to fetch chat history:', error.message);
    }
  }
}
```

---

## Installation Steps

1. **Install required dependencies:**
```bash
cd client
npm install dotenv
```

2. **Create .env file:**
```bash
cp .env.example .env
# Edit .env with your actual values
```

3. **Update package.json scripts:**
```json
{
  "scripts": {
    "start": "node -r dotenv/config commander.js"
  }
}
```

4. **Test the fixes:**
```bash
# Run tests
npm test

# Start the application
npm start
```

---

## Verification Checklist

After applying fixes, verify:

- [ ] No command injection possible in notifications
- [ ] Application works with environment variables
- [ ] Invalid inputs are rejected with proper error messages
- [ ] Rate limiting prevents spam
- [ ] Error messages don't expose sensitive information
- [ ] Application works on different platforms (Linux, macOS, Windows)
- [ ] All API endpoints use config instead of hardcoded URLs

---

## Testing Commands

```bash
# Test command injection (should be safe now)
# Try sending: test"; rm -rf / #

# Test rate limiting
# Send 15 messages rapidly - should be blocked after 10

# Test input validation
# Try creating room with name: {"$ne": null}
# Should be rejected

# Test environment variables
export API_BASE_URL=https://your-production-url.com
npm start
```

---

## Need Help?

Refer to:
- Full report: `CODE_REVIEW_REPORT.md`
- Summary: `REVIEW_SUMMARY.md`
- This guide: `QUICK_FIX_GUIDE.md`

---

**Last Updated:** $(date)
**Status:** Ready to implement
