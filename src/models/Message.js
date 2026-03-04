// models/Message.js
import mongoose, { Schema } from "mongoose";

const MessageSchema = new Schema({
  content: {
    type: String,
    required: true,
  },
  sender: {
    type: Schema.Types.ObjectId,
    ref: "User", // Reference to the User schema
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  chat: {
    type: Schema.Types.ObjectId,
    ref: "Chat", // Optional reference to the Chat schema
  },
});

const Message =
  mongoose.models.Message || mongoose.model("Message", MessageSchema);

export default Message;
