import { Request, Response } from 'express';
import { Chat } from '../models/chat.model';

// Get all chats
const getAllChats = async (req: Request, res: Response) => {
  try {
    const chats = await Chat.find().sort({ createdAt: -1 }); // Sort by createdAt field
    res.status(200).json(chats);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching chats' });
  }
};

const getMessagesByRoom = async(req:Request<{roomNum:string}>, res:Response)=>{
  console.log(req.params.roomNum)
  try{
    const chats = await Chat.find({
      room: `room-${req.params.roomNum}`
    })
    .sort({ createdAt: -1 })

    res.status(200).json(chats)
  }catch(err){
    res.status(500).json({ error: 'Error fetching chats' })
  }
}

export default {
  getAllChats,
  getMessagesByRoom
}