const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const socket = require('socket.io');

const db = require('./database/database');
const auth = require('./routes/auth.routes');
const message = require('./routes/message.routes');

dotenv.config();
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', auth);
app.use('/api/message', message);

const server = app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

const io = socket(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

global.onlineUsers = new Map();

io.on('connection', (socket) => {
  // Add user to onlineUsers map when they connect
  socket.on('add-user', (userId) => {
    onlineUsers.set(userId, socket.id);
  });

  // Handle message sending
  socket.on('send-msg', (data) => {
    const recipientSocket = onlineUsers.get(data.to); // Find the recipient's socket ID

    if (recipientSocket) {
      // Create the message object to send to the recipient
      const messageData = {
        message: data.message,
        senderId: data.from,
        createdAt: new Date().toISOString(),
      };

      // Emit the message to recipient
      socket.to(recipientSocket).emit('msg-recived', messageData);
    }
  });

  // Handle user disconnection
  socket.on('disconnect', () => {
    // Remove user from onlineUsers map when they disconnect
    const disconnectedUserId = [...onlineUsers.entries()].find(([userId, socketId]) => socketId === socket.id)?.[0];
    if (disconnectedUserId) {
      onlineUsers.delete(disconnectedUserId);
    }
  });
});
