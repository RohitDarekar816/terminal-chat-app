const readline = require('readline');
const io = require('socket.io-client');
const fs = require('fs');
const path = require('path');
const exitApp = require('../menu/exitApp');
const getMenuOption = require('./getMenuOption');
const render = require('./renderInterface');
const getToken = require('../auth/getToken');
const attachEvents = require('../../attachEvents');

function chatMessageInterface(client, chatRoom) {
  console.info('----------------------------------------------');
  console.info('Press -h to go Home.');
  console.info('Press -e to Exit.');
  console.info('----------------------------------------------');

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  let clientUsername;

  // Event listener for the 'username' event
  client.on('username', (username) => {
    clientUsername = username;
  });

  rl.on('line', async (input) => {
    const message = input.trim();
    if (message === '-e') {
      rl.close(); // Close the readline interface
      exitApp();
    } else if (message === '-h') {
      // Check if the clientUsername is defined
      if (!clientUsername) {
        console.log('Waiting for username...');
        return;
      }

      const token = await getToken(clientUsername);
      client.disconnect();

      // create a new client connection
      const newClient = io('http://192.168.0.101:3001', {
        auth: {
          token
        }
      });

      // Attach events to newClient
      attachEvents(newClient);

      // Display Home menu after successful authentication
      const homeOption = await getMenuOption();

      // Render menu interface according to what the user selects
      const chatRoom = await render[homeOption](newClient);

      // Start chat room messaging
      chatMessageInterface(newClient, chatRoom);
    } else if (message.startsWith('@')) {
      // File sending
      const filePath = message.slice(1);
      try {
        const stats = fs.statSync(filePath);
        if (stats.size > 10 * 1024 * 1024) { // 10MB limit
          console.log('File too large (max 10MB)');
          return;
        }
        const data = fs.readFileSync(filePath);
        const base64Data = data.toString('base64');
        const filename = path.basename(filePath);
        client.emit('send file', chatRoom, filename, base64Data);
        console.log(`File ${filename} sent`);
      } catch (error) {
        console.log('Error sending file:', error.message);
      }
    } else {
      client.emit('chat message', chatRoom, message);
    }
  });
}


module.exports = chatMessageInterface;
