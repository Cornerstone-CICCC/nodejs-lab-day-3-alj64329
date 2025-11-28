"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUsername = exports.getUsersInRoom = exports.removeUser = exports.addUser = void 0;
const usersInRoom = {};
// Add user to room
const addUser = (room, socketId, username) => {
    // If room does not exist, create room
    if (!usersInRoom[room]) {
        usersInRoom[room] = {};
    }
    // Add user to room
    usersInRoom[room][socketId] = username;
};
exports.addUser = addUser;
// Remove user from room
const removeUser = (room, socketId) => {
    const roomUsers = usersInRoom[room];
    if (!roomUsers)
        return; // room does not exist
    // Remove user from room
    delete roomUsers[socketId];
    // if room is empty, remove the room
    if (Object.keys(roomUsers).length === 0) {
        delete usersInRoom[room];
    }
};
exports.removeUser = removeUser;
// Get all users from specific room
const getUsersInRoom = (room) => {
    const roomUsers = usersInRoom[room];
    return roomUsers ? Object.values(roomUsers) : [];
};
exports.getUsersInRoom = getUsersInRoom;
// Get username from room
const getUsername = (room, socketId) => {
    var _a;
    return (_a = usersInRoom[room]) === null || _a === void 0 ? void 0 : _a[socketId];
};
exports.getUsername = getUsername;
