import express from 'express';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import dgram from 'dgram';

// UDP Settings
const UDP_PORT = 9999;
const UDP_HOST = '0.0.0.0'; // Listen on all available interfaces

// Create an instance of Express
const app = express();

// Create an HTTP server and attach Socket.IO
const server = http.createServer(app);
const io = new SocketIOServer(server, {
    cors: {
        origin: '*', // Adjust this to your frontend URL (e.g., 'http://localhost:3000')
        methods: ['GET', 'POST'],
    },
});

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

function parseFixtureData(bytes:Buffer) {
    const fixtures = [];
    for (let i = 0; i < fixtureCount; i++) {
        const fixtureBytes = bytes.slice(i * 4, i * 4 + 4); // Each fixture has 4 bytes (R, G, B, W)

        const r = fixtureBytes[0];
        const g = fixtureBytes[1];
        const b = fixtureBytes[2];
        const w = fixtureBytes[3];
        fixtures.push({ r, g, b, w });
    }
    return fixtures;
}

// Handle Socket.IO Connections
io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    // Send fixture data every ~150ms
    const fixtureDataInterval = setInterval(() => {
        // const fixtureData = generateFixtureData();
        //socket.emit('data', { message: fixtureData });
    }, 150); // Send data every 150ms

    socket.onAny((event, ...args) => {
        console.log(`Received event: ${event}`, args);
    });

    // Listen for newData event and emit it to all clients
    socket.on('newData', (newData) => {
        console.log('Received new data:', newData);
        io.emit('data', { message: newData });
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
        clearInterval(fixtureDataInterval); // Stop emitting data when client disconnects
    });
});


// Start the server on 0.0.0.0 (accessible from other devices)
const PORT = 5000;
server.listen(PORT, '192.168.0.48', () => {
    //console.log(`Socket.IO server running at http://${LOCAL_IP}:${PORT}`);
});

// Create a UDP Listener
const udpServer = dgram.createSocket('udp4');

udpServer.on('message', (msg, rinfo) => {
    if (msg.length !== 44) {
        console.warn(`Ignoring incomplete UDP message (${msg.length} bytes) from ${rinfo.address}:${rinfo.port}`);
        return; // Ignore messages that are not exactly 44 bytes
    }
    //console.log(`Received UDP message from ${rinfo.address}:${rinfo.port} - ${msg}`);
    const fixtureData = parseFixtureData(msg);
    // Forward UDP data to all connected Socket.IO clients
    //socket.emit('data', { message: fixtureData });
    io.emit('data', { 'message': fixtureData });
});

udpServer.on('listening', () => {
    const address = udpServer.address();
    console.log(`UDP server listening on ${address.address}:${address.port}`);
});

// Bind the UDP server to the specified port
udpServer.bind(UDP_PORT, UDP_HOST);
