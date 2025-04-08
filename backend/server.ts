import express from 'express';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import dgram from 'dgram';
import { FixtureRGBW } from '@libs/interfaces/fixture';

// UDP Settings
const UDP_PORT = 59999;               // Port for receiving UDP messages
const UDP_HOST = '0.0.0.0';          // Listen on all available interfaces
//const UDP_HOST = '192.168.0.73';          // Listen on all available interfaces
const UDP_SEND_PORT = 59998;          // Additional UDP port for sending data
const UDP_SEND_HOST = '127.0.0.1';  // Host for sending data (adjust as needed)

// Socket.IO Settings
const PORT = 5000;                   // Port for Socket.IO server
const IP_ADDRESS = '0.0.0.0';      // Local IP for the Socket.IO server
//const IP_ADDRESS = '192.168.0.73'; 

// Create an instance of Express
const app = express();

// Create an HTTP server and attach Socket.IO
const server = http.createServer(app);
const io = new SocketIOServer(server, {
    cors: {
        origin: '*',                // Adjust this to your frontend URL if needed
        methods: ['GET', 'POST'],
    },
});

// Define the number of fixtures
const fixtureCount = 11;
const BYTES_PER_FIXTURE = 6; // Each fixture has 6 bytes (R, G, B, W, BRIGHTNESS, CONTROL_IS_ACTIVE)
// Helper function to generate random fixture data
function generateFixtureData() {
    const fixtures:FixtureRGBW[] = [];
    for (let i = 0; i < fixtureCount; i++) {
        fixtures.push({
            r: Math.floor(Math.random() * 256),
            g: Math.floor(Math.random() * 256),
            b: Math.floor(Math.random() * 256),
            w: Math.floor(Math.random() * 256),
            brightness: Math.floor(Math.random() * 101),
            controlIsActive: false,
        });
    }
    return fixtures;
}

// Function to parse incoming UDP bytes into fixture data
function parseFixtureData(bytes: Buffer) {  // Add ': Buffer'
    const fixtures:FixtureRGBW[] = [];
    //const byteCount = 5;
    for (let i = 0; i < fixtureCount; i++) {
        const fixtureBytes = bytes.slice(i * BYTES_PER_FIXTURE, i * BYTES_PER_FIXTURE + BYTES_PER_FIXTURE); // Each fixture has 5 bytes (R, G, B, W, BRIGHTNESS)
        const r = fixtureBytes[0];
        const g = fixtureBytes[1];
        const b = fixtureBytes[2];
        const w = fixtureBytes[3];
        const brightness = fixtureBytes[4];
        // if fixutreBytes[5] is greater than 0, then set controlIsActive to true
        const controlIsActive = fixtureBytes[5] > 0;
        fixtures.push({ r, g, b, w, brightness, controlIsActive });
    }
    return fixtures;
}


// Handle Socket.IO Connections
io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    // Send fixture data every ~150ms
    const fixtureDataInterval = setInterval(() => {
         //const fixtureData = generateFixtureData();
        //socket.emit('data', { message: fixtureData });
    }, 150); // Send data every 150ms

    socket.onAny((event, ...args) => {
        // console.log(`Received event: ${event}`, args);
    });

    // Listen for newData event and emit it to all clients
    socket.on('newData', (newData) => {
        console.log('Received new data:', newData);
        io.emit('data', { message: newData });
    });

    // Listen for buttonPress event and handle it
    socket.on('buttonPress', (data) => {
        if (data.controlType === 'group' || data.controlType === 'fixture') {
            console.log(data.controlType, 'button pressed -',"id:", data.id,"color:", data.color);
            data.controlType += 'Set';

            // Send button press data via UDP to additional port
            const message = Buffer.from(JSON.stringify(data));

            console.log(data);

            const udpClient = dgram.createSocket('udp4');
            udpClient.send(message, 0, message.length, UDP_SEND_PORT, UDP_SEND_HOST, (err) => {
                if (err) {
                    console.error('Error sending UDP message:', err);
                } else {
                    // console.log(`Sent UDP message to ${UDP_SEND_HOST}:${UDP_SEND_PORT}`);
                }
                udpClient.close();
            });
        }
        else if (data.controlType === 'sceneSet') {
            console.log('Scene button pressed:', data.id);
            // Send button press data via UDP to additional port
            const message = Buffer.from(JSON.stringify(data));

            const udpClient = dgram.createSocket('udp4');
            udpClient.send(message, 0, message.length, UDP_SEND_PORT, UDP_SEND_HOST, (err) => {
                if (err) {
                    console.error('Error sending UDP message:', err);
                } else {
                    // console.log(`Sent UDP message to ${UDP_SEND_HOST}:${UDP_SEND_PORT}`);
                }
                udpClient.close();
            });
        }
        else if (data.controlType === 'blackout') {
            console.log('Blackout button pressed');
            const message = Buffer.from(JSON.stringify(data));

            const udpClient = dgram.createSocket('udp4');
            udpClient.send(message, 0, message.length, UDP_SEND_PORT, UDP_SEND_HOST, (err) => {
                if (err) {
                    console.error('Error sending UDP message:', err);
                } else {
                    // console.log(`Sent UDP message to ${UDP_SEND_HOST}:${UDP_SEND_PORT}`);
                }
                udpClient.close();
            });
        }
        else if (data.controlType === 'masterBrightness') {
            console.log('Master slider changed:', data.value);
            const message = Buffer.from(JSON.stringify(data));

            const udpClient = dgram.createSocket('udp4');
            udpClient.send(message, 0, message.length, UDP_SEND_PORT, UDP_SEND_HOST, (err) => {
                if (err) {
                    console.error('Error sending UDP message:', err);
                } else {
                    // console.log(`Sent UDP message to ${UDP_SEND_HOST}:${UDP_SEND_PORT}`);
                }
                udpClient.close();
            });
        }

    });

    // Handle disconnection
    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
        clearInterval(fixtureDataInterval); // Stop emitting data when client disconnects
    });
});

// Start the Socket.IO server
server.listen(PORT, IP_ADDRESS, () => {
    console.log(`Socket.IO server running at http://${IP_ADDRESS}:${PORT}`);
});

// Create a UDP Listener
const udpServer = dgram.createSocket('udp4');

udpServer.on('message', (msg, rinfo) => {
    if (msg.length !== 2 + BYTES_PER_FIXTURE * fixtureCount) {
        console.warn(`Ignoring incomplete UDP message ${msg.slice(0, 2).toString('utf8')} (${msg.length} bytes) from ${rinfo.address}:${rinfo.port}, expected ${2 + BYTES_PER_FIXTURE * fixtureCount} bytes`);
        return; // Ignore messages that are not exactly 44 bytes
    }

    // Extract the first two bytes (prefix)
    const prefix = msg.slice(0, 2).toString('utf8');

    // Extract the remaining 44 bytes
    const dataPayload = msg.slice(2);

    if (prefix === 'FD') {
        const fixtureData = parseFixtureData(dataPayload);
        io.emit('fixtureData', { message: fixtureData });
    } 
    else if (prefix === 'RF') {
        const fixtureData = parseFixtureData(dataPayload);
        io.emit('rawFixtureDataRgb', { message: fixtureData });
    }
    else if (prefix === 'GD') {
        // Handle Group Data prefix if needed
        const groupData = parseFixtureData(dataPayload);
        // console.log('Received group 0 controlIsActive:', groupData[0].controlIsActive);
        io.emit('groupData', { message: groupData });
    }
    else if (prefix === 'EV') {
        // Handle MD prefix if needed
        try {
            const jsonData = JSON.parse(dataPayload.toString());
            console.log('Received event data:', jsonData);
            io.emit('event', jsonData);
        } catch (error) {
            console.error('Error parsing event payload:', error);
        }
    }
});

udpServer.on('listening', () => {
    const address = udpServer.address();
    console.log(`UDP server listening on ${address.address}:${address.port}`);
});

// Bind the UDP server to the specified port
udpServer.bind(UDP_PORT, UDP_HOST);
