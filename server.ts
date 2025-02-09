import express from 'express';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';

// Create an instance of Express
const app = express();

// Create an HTTP server and attach Socket.IO
const server = http.createServer(app);
const io = new SocketIOServer(server);

// Define the number of fixtures
const fixtureCount = 11;

// Helper function to generate random fixture data
function generateFixtureData() {
  const fixtures = [];
  for (let i = 0; i < fixtureCount; i++) {
    fixtures.push({
      r: Math.floor(Math.random() * 256),
      g: Math.floor(Math.random() * 256),
      b: Math.floor(Math.random() * 256),
      w: Math.floor(Math.random() * 256),
    });
  }
  return fixtures;
}

// On connection, listen for client events
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  // Send fixture data every ~15ms
  const fixtureDataInterval = setInterval(() => {
    const fixtureData = generateFixtureData();
    socket.emit('data', { message: fixtureData });
  }, 150); // Send data every 15ms

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
    clearInterval(fixtureDataInterval); // Stop emitting data when client disconnects
  });
});

// Start the server on port 5000
server.listen(5000, () => {
  console.log('Socket.IO server running on http://localhost:5000');
});
