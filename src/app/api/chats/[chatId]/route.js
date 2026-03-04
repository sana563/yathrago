import Chat from "@/models/Chat";
import User from "@/models/User";
import { connectToDB } from "@/mongodb";

export const GET = async (req, { params }) => {
  try {
    await connectToDB();

    const { chatId } = params;
    const { searchParams } = new URL(req.url);
    const currentUserId = searchParams.get("userId");

    // Validate chatId is a valid ObjectId
    if (!chatId || !/^[0-9a-fA-F]{24}$/.test(chatId)) {
      return new Response(
        JSON.stringify({ error: "Invalid chat ID" }), 
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const chat = await Chat.findById(chatId)
      .populate({
        path: "members",
        model: User,
        select: "name email profilePic", // Populate member details
      })
      .exec();

    if (!chat) {
      return new Response(
        JSON.stringify({ error: "Chat not found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    // Determine if it's a group or a one-on-one chat
    const isGroup = chat.members.length > 2;

    let response = {
      isGroup,
      groupName: isGroup ? chat.name : null,
      groupPic: isGroup ? chat.groupPhoto : null,
      members: chat.members,
      otherUserName: null,
      otherUserPic: null,
    };

    // For one-on-one chats, find the other user
    if (!isGroup && currentUserId) {
      const otherUser = chat.members.find(
        (member) => member._id.toString() !== currentUserId
      );
      if (otherUser) {
        response.otherUserName = otherUser.name || otherUser.email;
        response.otherUserPic = otherUser.profilePic;
      }
    }

    return new Response(JSON.stringify(response), { 
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    console.error("Failed to get chat details:", err);
    return new Response(
      JSON.stringify({ error: "Failed to get chat details" }), 
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
