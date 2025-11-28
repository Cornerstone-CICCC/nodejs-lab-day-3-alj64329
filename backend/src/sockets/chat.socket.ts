import { Server, Socket } from 'socket.io';
import { Chat } from '../models/chat.model';
import { addUser, getUsername, getUsersInRoom, removeUser } from './users.manager';

const setupChatSocket = (io: Server) => {
  io.on('connection', (socket: Socket) => {
    let currentRoom :string|null = null
    // On connect
    console.log(`User connected: ${socket.id}`);

    socket.on('joinRoom', (data)=>{
      currentRoom = data.joinRoom
      socket.join(data.room)
      addUser(data.room, socket.id, data.username)

      socket.emit('chatRoom',{
        username:"System",
        message:`Welcome to ${data.room}, ${data.username}`
      })

      socket.broadcast.to(data.room).emit('chatRoom',{
        username:"System",
        message:`${data.username} has joined the room`
      })
          // Update users list for all users in room
    io.to(data.room).emit("updateRoomUsers", getUsersInRoom(data.room))
    })

    //leave
    socket.on("leaveRoom", (data)=>{
      socket.leave(data.room)
      const username = getUsername(data.room, socket.id)
      removeUser(data.room, socket.id)

      if(username){
        socket.to(data.room).emit('chatRoom', {
          username:"System",
          message: `${username} has left the room`
        })
        io.to(data.room).emit('updateRoomUsers', getUsersInRoom(data.room))
      }
    })

    socket.on('chatRoom', (data)=>{
      const username = getUsername(data.room, socket.id)|| "unknown"
      io.to(data.room).emit('chatRoom',{
        username,
        message:data.message
      })
    })

    // // Listen to 'sendMessage' event
    socket.on('chatRoom', async (data) => {
      const { room, username, message} = data;
      try {
        // Save message to MongoDB
        const chat = new Chat({ username , message,room});
        await chat.save();

        // Broadcast the chat object to all connected clients via the newMessage event
        // io.emit('newMessage', chat);
        
        // For room-based broadcast
        io.to(data.room).emit('chatRoom', chat)
      } catch (error) {
        console.error('Error saving chat:', error);
      }
    });

    // On disconnect
    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });
};

export default setupChatSocket;