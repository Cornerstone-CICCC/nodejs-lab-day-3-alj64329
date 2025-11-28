import express from 'express';
import chatController from '../controllers/chat.controller';

const chatRouter = express.Router();

// Get all chat messages
chatRouter.get('/', chatController.getAllChats);
chatRouter.get('/room/:roomNum', chatController.getMessagesByRoom);

export default chatRouter;