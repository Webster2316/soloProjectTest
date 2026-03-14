require('dotenv').config();
const http = require('http');
const WebSocket = require('ws');

const app = require('./app');
const { getUserFromCookie } = require('./middleware/auth.middleware'); 
const chatroomModel = require('./models/chatroomModel');
const userModel = require('./models/userModel');

const port = process.env.PORT || 3000;

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const clients = new Map();

wss.on('connection', async (ws, req) => {
  const user = await getUserFromCookie(req);
  if (!user) return ws.close();

  clients.set(ws, user);

  ws.send(JSON.stringify({ type: 'welcome', message: `Hi ${user.username}!` }));
const todayStart = new Date();
todayStart.setHours(0, 0, 0, 0);

if (
  !user.lastTransmissionGrantAt ||
  new Date(user.lastTransmissionGrantAt) < todayStart
) {
  user.transmissions += 300;

  await userModel.updateUserById(user.id, {
    transmissions: user.transmissions,
    lastTransmissionGrantAt: new Date()
  });

  ws.send(JSON.stringify({
    type: "dailyBonus",
    amount: 300
  }));
}


  const recentMessages = await chatroomModel.getRecentMessages();
  ws.send(JSON.stringify({ type: 'recentMessages', messages: recentMessages }));

  let messagesSentCount = user.messagesSentCount || 0;

  ws.on('message', async (data) => {
    const parsed = JSON.parse(data);
    if (parsed.type === 'newMessage') {
      if (user.transmissions < 5) {
        ws.send(JSON.stringify({ type: 'error', message: 'Not enough transmissions' }));
        return;
      }

      const message = await chatroomModel.createMessage(user.id, parsed.content);

      user.transmissions -= 5;
      messagesSentCount += 1;

      await userModel.updateUserById(user.id, { 
        transmissions: user.transmissions,
        messagesSentCount
      });

      if (messagesSentCount === 3) {
        ws.send(JSON.stringify({ type: 'unlockPfp', message: 'You can now upload a profile picture! 💖' }));
      }

      const payload = JSON.stringify({ type: 'message', message });

     clients.forEach((user, clientWs) => {
  if (clientWs.readyState === WebSocket.OPEN) {
    clientWs.send(payload);
  }
});

    }
  });

  ws.on('close', () => clients.delete(ws));
});
    server.listen(port, () => console.log(`App listening on port ${port}`));