import { NextResponse } from "next/server";
import { connectToDB } from "@/mongodb";
import ChatRoom from "@/models/ChatRoom";

// GET - Fetch a single chat room by ID
export async function GET(req, { params }) {
    try {
        await connectToDB();
        const { id } = params;

        const chatRoom = await ChatRoom.findById(id);

        if (!chatRoom) {
            return NextResponse.json({ message: "Chat room not found" }, { status: 404 });
        }

        return NextResponse.json(chatRoom, { status: 200 });
    } catch (err) {
        console.error("ERROR_GET_CHATROOM", err);
        return NextResponse.json({ message: "Failed to fetch chat room" }, { status: 500 });
    }
}

// PUT - Update chat room (join, leave, send message, etc.)
export async function PUT(req, { params }) {
    try {
        await connectToDB();
        const { id } = params;
        const body = await req.json();
        const { action, userEmail, userName, message, pollData } = body;

        const chatRoom = await ChatRoom.findById(id);

        if (!chatRoom) {
            return NextResponse.json({ message: "Chat room not found" }, { status: 404 });
        }

        switch (action) {
            case "join":
                // Check if user is already a member
                const isMember = chatRoom.members.some(m => m.email === userEmail);
                if (isMember) {
                    return NextResponse.json({ message: "Already a member" }, { status: 400 });
                }

                // Check if room is full
                if (chatRoom.members.length >= chatRoom.maxMembers) {
                    return NextResponse.json({ message: "Chat room is full" }, { status: 400 });
                }

                // Add user to members
                chatRoom.members.push({
                    email: userEmail,
                    name: userName,
                    joinedAt: new Date(),
                });

                // Add join message
                chatRoom.messages.push({
                    sender: "system",
                    senderName: "Travel Companion",
                    content: `${userName} joined the adventure! 🎒`,
                    messageType: "join",
                });
                break;

            case "leave":
                // Remove user from members
                chatRoom.members = chatRoom.members.filter(m => m.email !== userEmail);

                // Add leave message
                chatRoom.messages.push({
                    sender: "system",
                    senderName: "Travel Companion",
                    content: `${userName} left the chat room.`,
                    messageType: "leave",
                });
                break;

            case "message":
                // Add new message
                if (!message || !message.content) {
                    return NextResponse.json({ message: "Message content required" }, { status: 400 });
                }

                chatRoom.messages.push({
                    sender: userEmail,
                    senderName: userName,
                    content: message.content,
                    messageType: message.messageType || "text",
                    pollOptions: message.pollOptions || [],
                });
                break;

            case "vote":
                // Vote on a poll
                if (!pollData || !pollData.messageId || pollData.optionIndex === undefined) {
                    return NextResponse.json({ message: "Poll data required" }, { status: 400 });
                }

                const pollMessage = chatRoom.messages.id(pollData.messageId);
                if (!pollMessage || pollMessage.messageType !== "poll") {
                    return NextResponse.json({ message: "Poll not found" }, { status: 404 });
                }

                // Remove previous vote if exists
                pollMessage.pollOptions.forEach(option => {
                    option.votes = option.votes.filter(email => email !== userEmail);
                });

                // Add new vote
                if (pollMessage.pollOptions[pollData.optionIndex]) {
                    pollMessage.pollOptions[pollData.optionIndex].votes.push(userEmail);
                }
                break;

            case "tip":
                // Add a travel tip
                chatRoom.messages.push({
                    sender: userEmail,
                    senderName: userName,
                    content: message.content,
                    messageType: "tip",
                });
                break;

            default:
                return NextResponse.json({ message: "Invalid action" }, { status: 400 });
        }

        await chatRoom.save();

        return NextResponse.json(chatRoom, { status: 200 });
    } catch (err) {
        console.error("ERROR_UPDATE_CHATROOM", err);
        return NextResponse.json({ message: "Failed to update chat room" }, { status: 500 });
    }
}

// DELETE - Delete a chat room (only creator can delete)
export async function DELETE(req, { params }) {
    try {
        await connectToDB();
        const { id } = params;
        const { searchParams } = new URL(req.url);
        const userEmail = searchParams.get("userEmail");

        const chatRoom = await ChatRoom.findById(id);

        if (!chatRoom) {
            return NextResponse.json({ message: "Chat room not found" }, { status: 404 });
        }

        // Check if user is the creator
        if (chatRoom.creator !== userEmail) {
            return NextResponse.json({ message: "Only creator can delete" }, { status: 403 });
        }

        await ChatRoom.findByIdAndDelete(id);

        return NextResponse.json({ message: "Chat room deleted successfully" }, { status: 200 });
    } catch (err) {
        console.error("ERROR_DELETE_CHATROOM", err);
        return NextResponse.json({ message: "Failed to delete chat room" }, { status: 500 });
    }
}
