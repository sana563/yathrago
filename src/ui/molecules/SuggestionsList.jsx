import React from "react";
import ListItem from "../atoms/ListItem";
import { useRouter } from "next/navigation";

const SuggestionsList = ({
  suggestions,
  onSelectSuggestion,
  currentUser, // Pass the current user
  groupName, // Pass the group name (optional)
}) => {
  const router = useRouter();

  const createChat = async (suggestion) => {
    const selectedUser = suggestion;

    if (!groupName.trim() || !selectedUser) return;

    const res = await fetch("/api/chats", {
      method: "POST",
      body: JSON.stringify({
        currentUserID: currentUser._id,
        members: [currentUser._id, selectedUser._id], // Create chat with the selected user
        isGroupChat: false, // Assuming it's a direct chat, you can adjust if it's a group chat
        name: groupName, // Optional group name
      }),
    });

    if (res.ok) {
      const chat = await res.json();
      console.log("Chat created:", chat);
      router.push(`/chats/${chat._id}`); // Navigate to the created chat
    } else {
      console.error("Failed to create chat");
    }
  };

  return (
    <ul className="absolute bg-white border border-gray-300 rounded-md mt-1 w-full max-h-60 overflow-y-auto shadow-lg z-10">
      {suggestions.map((suggestion, index) => (
        <ListItem
          key={index}
          onClick={() => {
            onSelectSuggestion(suggestion.name); // Call the onSelectSuggestion prop
            createChat(suggestion); // Create the chat with the selected suggestion
          }}
        >
          <div className="flex justify-between items-center p-2 hover:bg-gray-100">
            <span>{suggestion.name}</span>
            <span className="text-gray-500 text-sm">
              {suggestion.travelCity}, {suggestion.travelCountry}
            </span>
          </div>
        </ListItem>
      ))}
    </ul>
  );
};

export default SuggestionsList;
