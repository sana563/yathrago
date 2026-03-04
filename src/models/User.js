import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide your name"],
  },
  email: {
    type: String,
    required: [true, "Please provide your email"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please provide your password"],
  },
  profileImage: {
    type: String,
    default: "",
  },
  bio: {
    type: String,
    default: "",
  },
  travelCity: {
    type: String,
    default: "",
  },
  travelCountry: {
    type: String,
    default: "",
  },
  chats: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Chat"
  }],
});

const User = mongoose.models.User || mongoose.model("User", UserSchema);

export default User;
