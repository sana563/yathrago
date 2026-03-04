"use client";
import React from "react";
import ChatListItem from "../molecules/ChatListItem";
import { useSession } from "next-auth/react";

const ChatList = () => {
  const { data: session } = useSession();
  const [chats, setChats] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchChats = async () => {
      if (!session?.user?.email) return;
      
      try {
        const res = await fetch(`/api/chats?userEmail=${encodeURIComponent(session.user.email)}`);
        if (res.ok) {
          const data = await res.json();
          console.log("📋 Fetched chats:", data);
          console.log("👤 Current user session:", session?.user);
          setChats(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        console.error("Failed to fetch chats:", error);
        setChats([]);
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
  }, [session]);

  return (
    <div className="h-full flex flex-col bg-white overflow-y-auto">
      {/* Header */}
      <div className="p-4 border-b-4 border-black bg-[#FF6B6B]">
        <h2 className="text-2xl font-black text-black uppercase">Chats</h2>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="p-4 text-center">
            <p className="font-bold text-black">Loading...</p>
          </div>
        ) : chats.length === 0 ? (
          <div className="p-4 text-center">
            <div className="text-5xl mb-2">💬</div>
            <p className="font-bold text-black">No chats yet</p>
            <p className="text-sm font-medium text-black opacity-70">Start a conversation!</p>
          </div>
        ) : (
          chats.map((chat) => (
            <ChatListItem key={chat._id} chat={chat} currentUser={session?.user} />
          ))
        )}
      </div>
    </div>
  );
};

export default ChatList;
