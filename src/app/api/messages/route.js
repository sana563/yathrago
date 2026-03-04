import { NextResponse } from "next/server";
import Message from "@/models/Message";
import { connectToDB } from "@/mongodb";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const chatId = searchParams.get("chatId");

    console.log("Fetching messages for chatId:", chatId); // Debugging

    // Validate chatId is a valid ObjectId
    if (!chatId || !/^[0-9a-fA-F]{24}$/.test(chatId)) {
      console.log("Invalid chatId, returning empty array");
      return NextResponse.json([]);
    }

    // Connect to the database
    await connectToDB();

    // Fetch messages for the given chat ID
    const messages = await Message.find({ chat: chatId })
      .populate("sender")
      .exec();

    console.log("Fetched messages:", messages); // Debugging

    return NextResponse.json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error); // Debugging
    return NextResponse.json(
      { error: "Failed to fetch messages." },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const { content, sender, chatId, timestamp } = await req.json();

    console.log("Saving message:", { content, sender, chatId, timestamp }); // Debugging

    // Connect to the database
    await connectToDB();

    // Create a new message
    const newMessage = new Message({
      content,
      sender: sender, // This should be the user ID
      chat: chatId,
      timestamp,
    });

    // Save the new message to MongoDB
    await newMessage.save();

    // After saving the message, populate the sender details
    const populatedMessage = await newMessage.populate("sender");

    console.log("Saved message:", populatedMessage); // Debugging

    // Return the populated message
    return NextResponse.json(populatedMessage);
  } catch (error) {
    console.error("Error saving message:", error); // Debugging
    return NextResponse.json(
      { error: "Failed to save the message." },
      { status: 500 }
    );
  }
}
