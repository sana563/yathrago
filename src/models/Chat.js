import mongoose, { Schema } from "mongoose";

const ChatSchema = new Schema({
  members: [{
    type: Schema.Types.ObjectId,
    ref: "User"
  }],
  messages: [{
    type: Schema.Types.ObjectId,
    ref: "Message"
  }],
  isGroupChat: {
    type: Boolean,
    default: false,
  },
  name: {
    type: String,
    default: "",
  },
  groupPhoto: {
    type: String,
    default: "",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Chat = mongoose.models.Chat || mongoose.model("Chat", ChatSchema);

export default Chat;
