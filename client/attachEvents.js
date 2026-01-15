const axios = require('axios');
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const colors = [
  '\x1b[31m', // red
  '\x1b[32m', // green
  '\x1b[33m', // yellow
  '\x1b[34m', // blue
  '\x1b[35m', // magenta
  '\x1b[36m', // cyan
  '\x1b[37m', // white
  '\x1b[90m', // grey
];

const reset = '\x1b[0m';
const red = '\x1b[31m';

function getColor(username) {
  const hash = username.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
  return colors[hash % colors.length];
}

function getISTTimestamp(date = null) {
  const now = date ? new Date(date) : new Date();
  const time = new Intl.DateTimeFormat('en-IN', {
    timeZone: 'Asia/Kolkata',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  }).format(now);
  const dateStr = new Intl.DateTimeFormat('en-IN', {
    timeZone: 'Asia/Kolkata',
    day: '2-digit',
    month: 'short',
    year: '2-digit'
  }).format(now);
  return dateStr + ' ' + time;
}

function displayMessage(message, timestamp = null) {
  const colonIndex = message.indexOf(': ');
  if (colonIndex === -1) {
    console.info(message);
  } else {
    const username = message.substring(0, colonIndex);
    const msg = message.substring(colonIndex + 2);
    const color = getColor(username);
    const ts = timestamp ? getISTTimestamp(timestamp) : getISTTimestamp();
    const fullMessage = color + username + ': ' + reset + msg;
    const visibleLength = username.length + 2 + msg.length;
    const totalWidth = process.stdout.columns || 80;
    const padding = Math.max(0, totalWidth - visibleLength - ts.length);
    console.info(fullMessage + ' '.repeat(padding) + red + ts + reset);
  }
}

async function fetchHistory(room) {
  try {
    const response = await axios.get(`http://192.168.0.101:3001/api/chatrooms/${room}/messages`);
    const messages = response.data;
    if (messages.length > 0) {
      console.info('--- Chat History ---');
      messages.forEach(msg => {
        const formatted = `${msg.username}: ${msg.message}`;
        displayMessage(formatted, msg.createdAt);
      });
      console.info('--- End History ---');
    }
  } catch (error) {
    console.error('Failed to fetch chat history');
  }
}

module.exports = (client) => {

    client.on('connect', () => { });

    // Handles 'chat message' event when another user sends a message
    client.on('chat message', (message) => {
      displayMessage(message);
      // Desktop notification
      exec(`notify-send "Terminal Chat" "${message}"`, (error) => {
        if (error) console.error('Notification failed:', error);
      });
      // Sound notification
      const soundPath = path.join(__dirname, '../noti.wav');
      exec(`aplay "${soundPath}"`, (error, stdout, stderr) => {
        if (error) {
          console.log('Sound error:', error.message);
        } else {
          console.log('Sound played');
        }
      });
    });

    client.on('joined', (data) => {
      console.info(data.message);
      fetchHistory(data.room);
    });

    client.on('user joined', (info) => {
      console.info(info);
    });

    // // Handles 'user left' event when a user leaves a room
    client.on('user left', (info) => {
      console.info(info);
    });

    client.on('file', (username, filename, base64Data) => {
      try {
        const data = Buffer.from(base64Data, 'base64');
        const savePath = path.join(__dirname, '../downloads', filename);
        fs.mkdirSync(path.dirname(savePath), { recursive: true });
        fs.writeFileSync(savePath, data);
        console.info(`${username} sent file: ${filename} (saved to downloads/)`);
        // Notification
        exec(`notify-send "File received" "${filename} from ${username}"`, (error) => {});
        // Sound
        const soundPath = path.join(__dirname, '../noti.wav');
        exec(`aplay "${soundPath}"`, (error) => {});
      } catch (error) {
        console.error('Error saving file:', error.message);
      }
    });

}