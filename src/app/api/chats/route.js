import { connectToDB } from "@/mongodb";
import Chat from "@/models/Chat";
import User from "@/models/User";

export const GET = async (req) => {
  try {
    await connectToDB();
    
    const { searchParams } = new URL(req.url);
    const userEmail = searchParams.get("userEmail");
    
    if (!userEmail) {
      return new Response(
        JSON.stringify({ error: "User email is required" }),
        { status: 400 }
      );
    }

    // Find user
    const user = await User.findOne({ email: userEmail }).populate({
      path: "chats",
      model: "Chat",
      populate: {
        path: "members",
        model: "User",
      },
    });

    if (!user) {
      return new Response(
        JSON.stringify({ error: "User not found" }),
        { status: 404 }
      );
    }

    return new Response(JSON.stringify(user.chats || []), { status: 200 });
  } catch (error) {
    console.error("Failed to fetch chats:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch chats" }),
      { status: 500 }
    );
  }
};

export const POST = async (req) => {
  try {
    await connectToDB();
    const body = await req.json();
    const { currentUserID, members, isGroupChat, name, groupPhoto } = body;

    // Ensure the current user is included in members
    if (!members.includes(currentUserID)) {
      members.push(currentUserID);
    }

    const sortedMembers = members.sort();
    let queryExistingChat;

    // Handle individual (1-on-1) chats
    if (!isGroupChat) {
      queryExistingChat = {
        isGroupChat: false,
        members: { $all: sortedMembers, $size: sortedMembers.length }, // Check members
      };
    } else {
      // Handle group chats
      queryExistingChat = {
        isGroupChat: true,
        name: name, // Ensure group chat uniqueness by name
      };
    }

    // Check if a chat with the same members or group name already exists
    const existingChat = await Chat.findOne(queryExistingChat).populate({
      path: "members",
      model: "User",
    });

    if (existingChat) {
      return new Response(
        JSON.stringify({
          message: "Chat already exists",
          chat: existingChat,
        }),
        { status: 200 }
      );
    }

    // Create new chat if none exists
    const newChat = new Chat({
      members: sortedMembers,
      isGroupChat,
      name,
      groupPhoto,
    });

    await newChat.save();

    // Populate members before returning
    await newChat.populate({
      path: "members",
      model: "User",
    });

    // Add the chat to each user's chat list
    const query = { _id: { $in: members } };
    const update = { $push: { chats: newChat._id } };
    await User.updateMany(query, update);

    return new Response(JSON.stringify(newChat), { status: 201 });
  } catch (error) {
    console.error("Failed to create chat", error);
    return new Response(
      JSON.stringify({ message: "Failed to create chat", error }),
      { status: 500 }
    );
  }
};
