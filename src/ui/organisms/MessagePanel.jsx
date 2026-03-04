"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import MessageItem from "../molecules/MessageItem";
import ChatInput from "../molecules/ChatInput";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation"; // To get chatId from the URL
import { useSocket } from "@/context/SocketContext";

const MessagePanel = () => {
  const [messages, setMessages] = useState([]);
  const [chatDetails, setChatDetails] = useState(null); // State to store chat details (name, profile pic, etc.)
  const { data: session } = useSession(); // To get the logged-in user's info
  const { chatId } = useParams(); // Assume you're using dynamic routing with chatId in the URL
  const { socket, isConnected } = useSocket(); // Use shared socket from context
  const messagesEndRef = useRef(null);
  const hasJoinedRoom = useRef(false);
  const currentChatId = useRef(null);

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Helper function to check if chatId is valid
  const isValidChatId = (id) => {
    // Check if it's a valid MongoDB ObjectId (24 hex characters)
    return id && typeof id === 'string' && /^[0-9a-fA-F]{24}$/.test(id);
  };

  // Stable handler for receiving messages - doesn't depend on messages state
  const handleReceiveMessage = useCallback((newMessage) => {
    console.log("📨 Received message via socket:", newMessage);
    setMessages((prevMessages) => {
      // Check if message already exists to avoid duplicates
      const exists = prevMessages.some(msg => 
        msg._id === newMessage._id || 
        (msg.content === newMessage.content && msg.sender?._id === newMessage.sender?._id && 
         Math.abs(new Date(msg.timestamp) - new Date(newMessage.timestamp)) < 1000)
      );
      if (exists) {
        console.log("⚠️ Duplicate message, skipping");
        return prevMessages;
      }
      console.log("✅ Adding new message to UI");
      return [...prevMessages, newMessage];
    });
  }, []);

  // Join chat room when socket is ready
  useEffect(() => {
    if (!isValidChatId(chatId) || !socket || !isConnected) {
      console.log("⏭️ Skipping chat setup - chatId:", chatId, "socket:", !!socket, "isConnected:", isConnected);
      hasJoinedRoom.current = false;
      currentChatId.current = null;
      return;
    }

    console.log("💬 MessagePanel: Setting up chat", chatId);
    currentChatId.current = chatId;

    // Join the specific chat room
    const joinRoom = () => {
      if (socket && isConnected) {
        console.log("🚪 Emitting joinChat for:", chatId);
        socket.emit("joinChat", chatId);
        
        // Listen for join confirmation
        const handleJoinConfirmation = (data) => {
          if (data.chatId === chatId) {
            console.log("✅ Successfully joined chat room:", chatId);
            hasJoinedRoom.current = true;
          }
        };
        
        socket.once("joinedChat", handleJoinConfirmation);
        
        // Set timeout in case confirmation doesn't arrive
        setTimeout(() => {
          if (!hasJoinedRoom.current) {
            console.log("⏰ Join confirmation timeout, assuming success");
            hasJoinedRoom.current = true;
          }
        }, 1000);
      }
    };

    joinRoom();

    // Fetch previous messages and chat details
    getMessages();
    fetchChatDetails();

    // Clean up on component unmount or chatId change
    return () => {
      if (socket && hasJoinedRoom.current && currentChatId.current) {
        console.log("🚪 Leaving chat room:", currentChatId.current);
        socket.emit("leaveChat", currentChatId.current);
        hasJoinedRoom.current = false;
      }
    };
  }, [chatId, socket, isConnected]);

  // Set up socket listener separately (only once)
  useEffect(() => {
    if (!socket) return;

    console.log("👂 Setting up receiveMessage listener");
    
    // Message handler
    socket.on("receiveMessage", handleReceiveMessage);

    // Handle reconnection - rejoin current chat
    const handleReconnect = () => {
      console.log("🔄 Socket reconnected, rejoining chat");
      if (currentChatId.current && isValidChatId(currentChatId.current)) {
        hasJoinedRoom.current = false; // Reset flag
        console.log("🚪 Rejoining chat:", currentChatId.current);
        socket.emit("joinChat", currentChatId.current);
        
        const handleRejoinConfirmation = (data) => {
          if (data.chatId === currentChatId.current) {
            console.log("✅ Successfully rejoined chat room:", currentChatId.current);
            hasJoinedRoom.current = true;
          }
        };
        
        socket.once("joinedChat", handleRejoinConfirmation);
      }
    };

    socket.on("connect", handleReconnect);

    return () => {
      console.log("🧹 Removing socket listeners");
      socket.off("receiveMessage", handleReceiveMessage);
      socket.off("connect", handleReconnect);
    };
  }, [socket, handleReceiveMessage]);

  // Function to handle sending a new message
  const addMessage = async (newMessage) => {
    if (newMessage.trim()) {
      // Check if we're in a valid chat and socket is ready
      if (!isValidChatId(chatId)) {
        console.error("❌ Cannot send message - invalid chatId");
        return;
      }

      if (!socket || !isConnected) {
        console.error("❌ Cannot send message - socket not connected");
        alert("Connection lost. Please refresh the page.");
        return;
      }

      const tempId = Date.now().toString();
      const messageData = {
        content: newMessage,
        sender: session?.user?.id, // Use user ID instead of email
        chatId,
        timestamp: new Date().toISOString(),
      };

      // Optimistic UI update - show message immediately
      const optimisticMessage = {
        ...messageData,
        _id: tempId,
        sender: {
          _id: session?.user?.id,
          name: session?.user?.name,
          email: session?.user?.email
        }
      };
      setMessages((prevMessages) => [...prevMessages, optimisticMessage]);

      console.log("📤 Sending message:", messageData);
      console.log("🔍 Socket state - connected:", isConnected, "hasJoinedRoom:", hasJoinedRoom.current);

      // Emit via socket if connected
      if (socket && isConnected) {
        console.log("📡 Emitting sendMessage via Socket.IO to room:", chatId);
        socket.emit("sendMessage", messageData);
      } else {
        console.warn("⚠️ Socket not connected, message will only be saved to DB");
      }

      // Send message to the server (backup and for persistence)
      try {
        const response = await fetch("/api/messages", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(messageData),
        });

        if (!response.ok) {
          throw new Error("Failed to send message");
        }

        const savedMessage = await response.json();

        console.log("💾 Message saved to database:", savedMessage);

        // Replace optimistic message with saved message from server
        setMessages((prevMessages) => 
          prevMessages.map(msg => msg._id === tempId ? savedMessage : msg)
        );
      } catch (error) {
        console.error("❌ Error sending message:", error);
        // Remove optimistic message on error
        setMessages((prevMessages) => 
          prevMessages.filter(msg => msg._id !== tempId)
        );
        alert("Failed to send message. Please try again.");
      }
    }
  };
  // Function to fetch previous messages for the current chat
  const getMessages = async () => {
    try {
      const response = await fetch(`/api/messages?chatId=${chatId}`);
      const data = await response.json();
      console.log("Fetched messages:", data); // Debugging
      // Ensure data is an array before setting messages
      if (Array.isArray(data)) {
        setMessages(data);
      } else {
        console.error("Messages data is not an array:", data);
        setMessages([]);
      }
    } catch (error) {
      console.error("Failed to fetch messages:", error.message);
      setMessages([]);
    }
  };

  // Function to fetch chat details (name, profile picture, etc.)
  const fetchChatDetails = async () => {
    try {
      const userId = session?.user?.id || '';
      const response = await fetch(`/api/chats/${chatId}?userId=${userId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch chat details");
      }
      const data = await response.json();
      console.log("Fetched chat details:", data); // Debugging
      setChatDetails(data);
    } catch (error) {
      console.error("Failed to fetch chat details:", error.message);
      setChatDetails(null);
    }
  };

  // Show placeholder for invalid chatId
  if (!isValidChatId(chatId)) {
    return (
      <div className="h-full flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="text-8xl mb-4">💬</div>
          <h3 className="text-2xl font-black text-black mb-2">Select a Chat</h3>
          <p className="text-lg font-medium text-black">Choose a conversation to start messaging</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 bg-[#4ADE80] border-b-4 border-black">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white border-3 border-black rounded-full overflow-hidden flex items-center justify-center font-black text-2xl text-black">
            {chatDetails?.isGroup ? '👥' : '👤'}
          </div>
          <div>
            <h3 className="text-xl font-black text-black">
              {chatDetails ? (
                chatDetails.isGroup
                  ? chatDetails.groupName || 'Group Chat'
                  : chatDetails.otherUserName || 'Chat'
              ) : (
                'Loading...'
              )}
            </h3>
            <p className="text-sm font-bold text-black opacity-80">
              {chatDetails ? (
                chatDetails.isGroup ? `${chatDetails.members?.length || 0} members` : 'Online'
              ) : (
                'Connecting...'
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {!Array.isArray(messages) || messages.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl mb-3">💭</div>
              <p className="text-lg font-bold text-black">No messages yet</p>
              <p className="text-sm font-medium text-black opacity-70">Start the conversation!</p>
            </div>
          </div>
        ) : (
          <>
            {messages.map((msg, index) => {
              const isOwnMessage = msg.sender?._id === session?.user?.id || msg.sender === session?.user?.id;
              return (
                <MessageItem
                  key={msg._id || index}
                  message={msg.content}
                  sender={msg.sender}
                  timestamp={msg.timestamp || msg.createdAt}
                  isOwnMessage={isOwnMessage}
                />
              );
            })}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Chat Input */}
      <div className="p-4 border-t-4 border-black bg-white">
        <ChatInput onSendMessage={addMessage} />
      </div>
    </div>
  );
};

export default MessagePanel;
