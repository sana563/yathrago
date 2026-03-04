"use client";
import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

const ChatListItem = ({ chat, currentUser }) => {
  const params = useParams();
  const isActive = params?.chatId === chat._id;

  console.log("💬 ChatListItem - chat:", chat);
  console.log("👤 ChatListItem - currentUser:", currentUser);

  // Get other members (exclude current user)
  // Convert both IDs to strings for comparison
  const currentUserId = currentUser?.id?.toString() || currentUser?._id?.toString();
  const currentUserEmail = currentUser?.email;
  
  const otherMembers = chat?.members?.filter((member) => {
    const memberId = member?._id?.toString();
    const memberEmail = member?.email;
    return memberId !== currentUserId && memberEmail !== currentUserEmail;
  }) || [];

  console.log("👥 ChatListItem - otherMembers:", otherMembers);

  const chatName = chat?.isGroup 
    ? chat.name || "Group Chat"
    : otherMembers[0]?.name || otherMembers[0]?.email || "Unknown";

  const lastMessage = chat?.lastMessage || "";
  const truncatedMessage = lastMessage.length > 30 
    ? lastMessage.substring(0, 30) + "..."
    : lastMessage;

  return (
    <Link href={`/chats/${chat._id}`}>
      <div
        className={`flex items-center gap-3 p-4 border-b-2 border-black hover:bg-[#FFC700] transition-colors cursor-pointer ${
          isActive ? "bg-[#4ADE80]" : "bg-white"
        }`}
      >
        {/* Avatar */}
        <div className="w-12 h-12 bg-[#00D9FF] border-3 border-black flex items-center justify-center font-black text-xl text-black flex-shrink-0">
          {chat?.isGroup ? "👥" : "👤"}
        </div>

        {/* Chat Info */}
        <div className="flex-1 min-w-0">
          <h4 className="font-black text-black truncate">{chatName}</h4>
          {truncatedMessage && (
            <p className="text-sm font-medium text-black opacity-70 truncate">
              {truncatedMessage}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ChatListItem;
