"use client";
import React, { useState, useEffect } from "react";

const ChatBotBadge = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setMessages([]);
      setError(null);
    }
  };

  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage = inputValue.trim();
    setInputValue("");
    setError(null);
    
    // Add user message to chat
    const newMessages = [...messages, { role: "user", content: userMessage }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      // Call the backend API to get response from GROQ
      const response = await fetch("/api/chatbot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: userMessage }),
      });

      // Get response text first to debug
      const responseText = await response.text();
      console.log("Raw response:", responseText);
      
      // Only parse if we have text
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error("JSON parse error:", parseError);
        throw new Error("Invalid response from server. Please try again.");
      }

      if (!response.ok) {
        throw new Error(data.error || "Failed to get response from chatbot");
      }
      
      // Add assistant message to chat
      setMessages([...newMessages, { role: "assistant", content: data.response }]);
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage = error.message || "Sorry, I encountered an error. Please try again.";
      setError(errorMessage);
      setMessages([
        ...newMessages,
        { 
          role: "assistant", 
          content: errorMessage 
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Chatbot Badge - Minimal Neo-Brutalist */}
      <button
        onClick={toggleChat}
        className="fixed bottom-8 right-8 z-50 w-14 h-14 bg-black border-3 border-black shadow-[4px_4px_0px_0px_rgba(255,255,255,0.8)] hover:shadow-[6px_6px_0px_0px_rgba(255,255,255,0.8)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all flex items-center justify-center text-xl font-black text-white cursor-pointer"
        title="Chat with Travel Assistant"
      >
        💬
      </button>

      {/* Chatbot Modal */}
      {isOpen && (
        <div className="fixed bottom-24 right-8 z-50 w-96 h-[500px] bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col">
          {/* Header - Minimal Neo-Brutalist */}
          <div className="bg-black border-b-4 border-black p-4 flex justify-between items-center">
            <h3 className="font-black text-lg text-white">YathraGo Assistant</h3>
            <button
              onClick={toggleChat}
              className="w-8 h-8 bg-white border-2 border-black flex items-center justify-center font-black text-black hover:bg-gray-200 transition-colors"
            >
              ×
            </button>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="bg-[#FF6B6B] border-b-3 border-black p-3 font-semibold text-sm text-white">
              ⚠️ {error}
            </div>
          )}

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 bg-gray-50 text-black">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-4 text-black">
                <div className="text-3xl mb-3 font-black">✈️</div>
                <h4 className="font-black text-lg mb-2 text-black">Travel Assistant</h4>
                <p className="text-sm text-gray-700">
                  Ask about destinations, activities, and travel tips!
                </p>
                <div className="mt-4 p-3 border-2 border-black bg-white">
                  <p className="text-xs text-black"><strong>Example:</strong><br/>&ldquo;Best places in Paris?&rdquo;</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`p-3 border-3 border-black text-sm ${
                      message.role === "user"
                        ? "bg-black text-white ml-8 mr-0"
                        : "bg-white text-black ml-0 mr-8"
                    }`}
                  >
                    <div className="font-black text-xs uppercase tracking-wide mb-1">
                      {message.role === "user" ? "You" : "YathraGo"}
                    </div>
                    <div>{message.content}</div>
                  </div>
                ))}
                {isLoading && (
                  <div className="p-3 border-3 border-black bg-white ml-0 mr-8">
                    <div className="font-black text-xs uppercase tracking-wide text-black mb-2">YathraGo</div>
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-black rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-black rounded-full animate-bounce delay-100"></div>
                      <div className="w-2 h-2 bg-black rounded-full animate-bounce delay-200"></div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-4 border-t-4 border-black bg-white">
            <div className="flex gap-2">
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask something..."
                className="flex-1 p-3 border-3 border-black resize-none min-h-12 max-h-24 focus:outline-none focus:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all text-black font-medium text-sm"
                disabled={isLoading}
              />
              <button
                onClick={sendMessage}
                disabled={isLoading || !inputValue.trim()}
                className={`px-4 py-3 border-3 border-black font-bold transition-all ${
                  isLoading || !inputValue.trim()
                    ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                    : "bg-black text-white hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[-1px] active:translate-y-[-1px]"
                }`}
              >
                {isLoading ? "..." : "Send"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBotBadge;