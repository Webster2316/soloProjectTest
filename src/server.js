require('dotenv').config();
const http = require('http');
const WebSocket = require('ws');

const app = require('./app');
const { getUserFromCookie } = require('./middleware/auth.middleware'); // your session check

const port = process.env.PORT || 3000;

// create HTTP server
const server = http.createServer(app);

// WebSocket server
const wss = new WebSocket.Server({ server });

// store connected clients
const clients = new Map();

wss.on('connection', async (ws, req) => {
  // extract session/user from cookie manually
  const user = await getUserFromCookie(req); 
  if (!user) return ws.close();

  clients.set(ws, user);

  ws.send(JSON.stringify({ type: 'welcome', message: `Hi ${user.username}!` }));

  ws.on('message', async (data) => {
    const parsed = JSON.parse(data);
    if (parsed.type === 'newMessage') {
      const chatroomModel = require('./models/chatroomModel');
      const userModel = require('./models/userModel');

      if (user.transmissions < 5) {
        ws.send(JSON.stringify({ type: 'error', message: 'Not enough transmissions' }));
        return;
      }

      const message = await chatroomModel.createMessage(user.id, parsed.content);

      user.transmissions -= 5;
      await userModel.updateUserById(user.id, { transmissions: user.transmissions });

      if (!user.messagesSentCount) user.messagesSentCount = 0;
      user.messagesSentCount += 1;

      if (user.messagesSentCount === 3) {
        ws.send(JSON.stringify({ type: 'unlockPfp', message: 'You can now upload a profile picture!' }));
      }

      const payload = JSON.stringify({ type: 'message', message });
      clients.forEach((clientWs) => clientWs.send(payload));
    }
  });

  ws.on('close', () => clients.delete(ws));
});

server.listen(port, () => console.log(`App listening on port ${port}`));