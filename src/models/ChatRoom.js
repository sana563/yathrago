import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
    sender: {
        type: String,
        required: true,
    },
    senderName: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    messageType: {
        type: String,
        enum: ["text", "poll", "tip", "join", "leave"],
        default: "text",
    },
    pollOptions: [{
        option: String,
        votes: [String], // Array of user emails who voted
    }],
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const ChatRoomSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
    },
    destination: {
        type: String,
        required: true,
    },
    continent: {
        type: String,
        enum: ["Africa", "Asia", "Europe", "North America", "South America", "Australia", "Antarctica"],
    },
    travelDates: {
        startDate: Date,
        endDate: Date,
    },
    maxMembers: {
        type: Number,
        default: 50,
    },
    creator: {
        type: String, // email of creator
        required: true,
    },
    creatorName: {
        type: String,
        required: true,
    },
    members: [{
        email: String,
        name: String,
        joinedAt: {
            type: Date,
            default: Date.now,
        },
    }],
    messages: [MessageSchema],
    tags: [String],
    category: {
        type: String,
        enum: ["Adventure", "Backpacking", "Luxury", "Food Tour", "Cultural", "Beach", "City Break", "Road Trip"],
        default: "Adventure",
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    roomImage: {
        type: String,
        default: "",
    },
}, { timestamps: true });

const ChatRoom = mongoose.models.ChatRoom || mongoose.model("ChatRoom", ChatRoomSchema);

export default ChatRoom;
