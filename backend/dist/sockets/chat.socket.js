"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const chat_model_1 = require("../models/chat.model");
const users_manager_1 = require("./users.manager");
const setupChatSocket = (io) => {
    io.on('connection', (socket) => {
        let currentRoom = null;
        // On connect
        console.log(`User connected: ${socket.id}`);
        socket.on('joinRoom', (data) => {
            currentRoom = data.joinRoom;
            socket.join(data.room);
            (0, users_manager_1.addUser)(data.room, socket.id, data.username);
            socket.emit('chatRoom', {
                username: "System",
                message: `Welcome to ${data.room}, ${data.username}`
            });
            socket.broadcast.to(data.room).emit('chatRoom', {
                username: "System",
                message: `${data.username} has joined the room`
            });
            // Update users list for all users in room
            io.to(data.room).emit("updateRoomUsers", (0, users_manager_1.getUsersInRoom)(data.room));
        });
        //leave
        socket.on("leaveRoom", (data) => {
            socket.leave(data.room);
            const username = (0, users_manager_1.getUsername)(data.room, socket.id);
            (0, users_manager_1.removeUser)(data.room, socket.id);
            if (username) {
                socket.to(data.room).emit('chatRoom', {
                    username: "System",
                    message: `${username} has left the room`
                });
                io.to(data.room).emit('updateRoomUsers', (0, users_manager_1.getUsersInRoom)(data.room));
            }
        });
        socket.on('chatRoom', (data) => {
            const username = (0, users_manager_1.getUsername)(data.room, socket.id) || "unknown";
            io.to(data.room).emit('chatRoom', {
                username,
                message: data.message
            });
        });
        // // Listen to 'sendMessage' event
        socket.on('chatRoom', (data) => __awaiter(void 0, void 0, void 0, function* () {
            const { room, username, message } = data;
            try {
                // Save message to MongoDB
                const chat = new chat_model_1.Chat({ username, message, room });
                yield chat.save();
                // Broadcast the chat object to all connected clients via the newMessage event
                // io.emit('newMessage', chat);
                // For room-based broadcast
                io.to(data.room).emit('chatRoom', chat);
            }
            catch (error) {
                console.error('Error saving chat:', error);
            }
        }));
        // On disconnect
        socket.on('disconnect', () => {
            console.log(`User disconnected: ${socket.id}`);
        });
    });
};
exports.default = setupChatSocket;
