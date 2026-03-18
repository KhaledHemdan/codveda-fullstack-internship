const express = require('express');
const http = require('http'); // Required to wrap express for Socket.io
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

// 1. Create the HTTP server
const server = http.createServer(app);

// 2. Attach Socket.io to the server with CORS settings
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173", // Your Vite frontend URL
        methods: ["GET", "POST"]
    }
});

// 3. Listen for connection events
io.on('connection', (socket) => {
    console.log(`User Connected: ${socket.id}`);

    // EVENT: User Joins a specific notification room
    socket.on('join_server', (username) => {
        socket.join("global_room");
        console.log(`${username} joined global notifications`);
        
        // Send a "Welcome" notification ONLY to the person who joined
        socket.emit('notification', {
            title: "System",
            message: `Welcome to the app, ${username}!`
        });

        // Broadcast to everyone ELSE that a user joined
        socket.broadcast.to("global_room").emit('notification', {
            title: "New User",
            message: `${username} has logged in.`
        });
    });

    // EVENT: Real-time Chat Messaging
    socket.on('send_msg', (data) => {
        // io.emit sends to EVERYONE connected
        io.emit('receive_msg', data);
    });

    // EVENT: Handle Disconnection
    socket.on('disconnect', () => {
        console.log("User Disconnected", socket.id);
    });
});

const PORT = 5000;
server.listen(PORT, () => {
    console.log(`🚀 Real-time engine running on port ${PORT}`);
});
