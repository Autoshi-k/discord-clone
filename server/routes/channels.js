import express from 'express';
import { auth as verify } from '../helper/tokenVerify.js';
import Message from '../models/Message.js';
import User from '../models/User.js';
import Participant from '../models/Participant.js';

export const router = express.Router();

// the whole app in under url /channels therefor this /api/channels
// is the first stop after logging in
// getting user information is the only purpose 


const getMessages = async (objRooms, roomId, participant) => {
  const thisParticipant = await User.findById(participant.userId).select('_id displayName image');
  const messagesByParticipant = await Message.find({participantId: participant._id}).sort({ _id: -1 }).limit(30);
  
  objRooms[roomId].participants[participant._id.toString()] = { displayName: thisParticipant.displayName, imgae: thisParticipant.image };
  objRooms[roomId].messages.push(...messagesByParticipant);
}

const getParticipants = async (objRooms, room) => {
  objRooms[room.roomId] = {
    participants: {},
    messages: []
  };
  const participantsInRoom = await Participant.find({ roomId: room.roomId }).select('userId');
  await Promise.all(participantsInRoom.map(participant => getMessages(objRooms, room.roomId, participant)), err => console.log(err)) // return array
}

const getRoomsData = async (objRooms, rooms) => {
  await Promise.all(rooms.map(room => getParticipants(objRooms, room)), err => console.log(err)) // return array
}

router.get('/', verify, async (req, res) => {
  // array to object 
  // only one messages (not an array again)
  const user = await User.findById(req.user.id).select('-password -updatedAt -createdAt -__v');
  const rooms = await Participant.find({ userId: user._id }); // array
  let objRooms = {};
  await getRoomsData(objRooms, rooms);
  console.log('objRooms', objRooms);
  res.send({ user, objRooms });
})
