import { errorHandler } from "../utils/error.js";
import User from "../model/user.model.js";
import Conversation from "../model/conversation.model.js";
import Message from "../model/message.model.js";
import { getReceiverSocketId, io } from "../socket/socket.js";

export const getGroup = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return next(errorHandler(404, "User not found"));
    }

    if (user.role === "driver") {
      return next(errorHandler(401, "Unauthorized"));
    }

    const conversation = await Conversation.findOne({
      station: req.params.station,
    }).populate("message");

    if (conversation) {
      res.status(200).json(conversation);
    } else {
      return next(errorHandler(404, "Group not found"));
    }
  } catch (error) {
    next(error);
  }
};

export const sendMessage = async (req, res, next) => {
  try {
    const { message } = req.body;
    if (!message || message === "") {
      return next(errorHandler(400, "All fields are required"));
    }

    const sender = await User.findById(req.params.id);
    if (!sender) {
      return next(errorHandler(404, "User not found."));
    }

    if (sender.role === "driver") {
      return next(errorHandler(401, "Unauthorized"));
    }

    let conversation = await Conversation.findOne({
      station: req.params.station,
    });

    if (!conversation) {
      conversation = await Conversation.create({
        station: req.params.station,
      });
    }

    const newMessage = new Message({
      senderId: req.params.id,
      station: req.params.station,
      senderName: sender.name,
      senderImage: sender.profilePicture,
      message,
    });

    if (newMessage) {
      conversation.message.push(newMessage._id);
    }

    if (req.params.station === "all") {
      var participants = await User.find({ role: { $ne: "driver" } });
    } else {
      var participants = await User.find({ pStation: req.params.station });
    }
    participants.forEach((participant) => {
      const participantSocketId = getReceiverSocketId(participant._id);
      if (participantSocketId) {
        io.to(participantSocketId).emit("newMessage", newMessage);
      }
    });

    await Promise.all([conversation.save(), newMessage.save()]);

    res.status(201).json(newMessage);
  } catch (error) {
    next(error);
  }
};
