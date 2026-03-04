"use client";
import React, { useState } from "react";

const ChatInput = ({ onSendMessage }) => {
  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      onSendMessage(newMessage);
      setNewMessage(""); // Clear input after sending
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex items-center gap-2 w-full">
      <input
        type="text"
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        onKeyDown={handleKeyPress}
        placeholder="Type your message..."
        className="flex-1 px-4 py-3 border-3 border-black font-medium text-black placeholder-gray-500 focus:outline-none focus:ring-0 focus:border-black"
      />
      <button
        onClick={handleSendMessage}
        disabled={!newMessage.trim()}
        className="px-6 py-3 bg-black border-3 border-black text-white font-black hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-1px] hover:translate-y-[-1px]"
      >
        SEND
      </button>
    </div>
  );
};

export default ChatInput;
